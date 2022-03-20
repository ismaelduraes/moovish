import React from "react";
import { useState, useLayoutEffect, useContext } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    Image
} from 'react-native'
import axios from "axios";

import { TMDB_API_KEY } from '@env'
import Header from "../Components/Header";
import { ThemeContext } from "../Components/Contexts/ThemeContext";
import TextBody from "../Components/TextBody";
import ImageCarousel from "../Components/ImageCarousel";

import { imgPrefixOriginal } from "../Components/Utilities/Utilities";
import NavButtons from "../Components/NavButtons";
import AndroidStatusBarGradient from "../Components/AndroidStatusBarGradient";
import Loading from "../Components/Loading";

export default function ProfileScreen({ route }) {
    const profileId = route.params.profileId
    const theme = useContext(ThemeContext)

    const [profileData, setProfileData] = useState({})
    const [loaded, setLoaded] = useState(false)

    function fetchData() {
        axios.get(`https://api.themoviedb.org/3/person/${profileId}?api_key=${TMDB_API_KEY}&append_to_response=images`)
            .then(r => {
                setProfileData(r.data)
                setLoaded(true)``
            })
            .catch(e => console.log(e))
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
            <Image
                style={styles.imageBg}
                source={{ uri: `${imgPrefixOriginal}${profileData.profile_path}` }}
                blurRadius={50}
            />
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                <Header
                    title={profileData.name}
                    imagePath={profileData.profile_path}
                    subtitle={`Known for ${profileData.known_for_department}`}
                />
                <TextBody
                    style={styles.section}
                    title="Biography"
                    text={profileData.biography ? profileData.biography : 'No biography is available for this person'}
                    hideIfLong
                />
                <View style={{ flexDirection: 'row' }}>
                    <TextBody
                        style={styles.section}
                        title="Born in"
                        text={profileData.place_of_birth ? profileData.place_of_birth : 'Unknown'}
                        hideIfLong
                        marginBottom={50}
                        width="50%"
                    />
                    <TextBody
                        style={styles.section}
                        title="Gender"
                        text={profileData.gender === 1 ? 'Female' : 'Male'}
                        hideIfLong
                        width="50%"
                    />
                </View>
                <ImageCarousel
                    data={profileData.images.profiles}
                    isSquare
                    canChangeResize
                />
            </ScrollView>
        </View>
    )
}