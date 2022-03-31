import React from "react";
import { useState, useLayoutEffect, useContext } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    Dimensions
} from 'react-native'

const width = Dimensions.get('window').width

import axios from "axios";

import { TMDB_API_KEY } from '@env'
import Header from "../Components/Header";
import { ThemeContext } from "../Components/Contexts/ThemeContext";
import TextBody from "../Components/TextBody";

import NavButtons from "../Components/NavButtons";
import AndroidStatusBarGradient from "../Components/AndroidStatusBarGradient";
import Loading from "../Components/Loading";
import Poster from "../Components/Poster";
import MasonryList from '@react-native-seoul/masonry-list';
import FastImage from "react-native-fast-image";
import { imgPrefix } from "../Components/Utilities/Utilities";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function CompanyScreen({ route }) {
    const companyId = route.params.companyId

    const theme = useContext(ThemeContext)
    const navigation = useNavigation()

    const [companyData, setCompanyData] = useState({})
    const [companyMovies, setCompanyMovies] = useState([])
    const [loaded, setLoaded] = useState(false)

    function fetchData() {
        axios.get(`https://api.themoviedb.org/3/company/${companyId}?api_key=${TMDB_API_KEY}&append_to_response=images`)
            .then(r => {
                setCompanyData(r.data)
            })
            .catch(() => navigation.goBack())

        axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&with_companies=${companyId}`)
            .then(d => setCompanyMovies(d.data.results))
            .catch(() => navigation.goBack())
        setLoaded(true)
    }

    useLayoutEffect(() => {
        fetchData()
    }, [])

    const styles = StyleSheet.create({
        container: {
            height: '100%',
            width: '100%'
        },
        imageBg: {
            width: '100%',
            height: '100%',
            position: 'absolute',
            opacity: theme.type === 'light' ? 0.3 : 0.1
        }
    })

    if (!loaded) return <Loading />

    else return (
        <View style={{ backgroundColor: theme.background }}>
            <AndroidStatusBarGradient />
            <NavButtons />
            {/* <Image
                style={styles.imageBg}
                source={{ uri: `${imgPrefixOriginal}${profileData.profile_path}` }}
                blurRadius={50}
            /> */}
            <ScrollView contentContainerStyle={{ paddingBottom: 60, paddingTop: 100 }} showsVerticalScrollIndicator={false} style={styles.container}>
                {/* <Header
                    title={companyData.name}
                    imagePath={companyData.logo_path}
                    subtitle={`${companyData.description}`}
                    resizeMode="contain"
                    tintColor={theme.background}
                /> */}
                <FastImage
                    source={{ uri: `${imgPrefix}${companyData.logo_path}` }}
                    style={{ height: 60, width: width - theme.defaultPadding * 2, alignSelf: 'center', marginTop: 50 }}
                    resizeMode="contain"
                    tintColor={theme.accent}
                />
                <View style={{ flexDirection: 'row' }}>
                    <TextBody
                        style={styles.section}
                        title={companyData.name}
                        text={companyData.headquarters ? companyData.headquarters : 'Unknown'}
                        hideIfLong
                        marginBottom={50}
                        width="50%"
                    />
                </View>
                {companyMovies ?
                    <MasonryList
                        renderItem={({ item, index }) => {
                            return (
                                <View
                                    key={index}
                                >
                                    <Poster
                                        data={item}
                                        width={(width * 1 / 3) - 25}
                                        height={width * 0.4}
                                        marginRight={0}
                                        animDelay={index * 100}
                                        marginBottom={10}
                                        alignCenter
                                    />
                                </View>
                            )
                        }
                        }
                        data={companyMovies}
                        contentContainerStyle={{
                            marginHorizontal: theme.defaultPadding,
                        }}
                        numColumns={3}
                    /> : null
                }
            </ScrollView>
        </View>
    )
}