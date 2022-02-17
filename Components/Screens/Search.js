import React from "react"
import {
    useContext,
    useState,
    useEffect
} from "react"

import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    Image,
    Dimensions
} from 'react-native'

import { Link, useNavigate } from "react-router-native"

import { ThemeContext } from "../Contexts/ThemeContext"

import axios from "axios"

import { TMDB_API_KEY } from '@env'
import { imgPrefix } from "../Utilities/Utilities"
import { MovieContext } from "../../App"
import Nav from "../Nav"

const width = Dimensions.get('window').width

export default function Search(){
    const theme = useContext(ThemeContext)
    const contextProps = useContext(MovieContext)

    const [results, setResults] = useState([])
    const [query, setQuery] = useState('')
    const [input, setInput] = useState('')
    const navigate = useNavigate()

    function fetchData(){
        axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&page=1`)
        .then(r => setResults(r.data.results))
    }
    
    useEffect(() => {
        if (query) fetchData()
    }, [query])

    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: theme.background
        },
        scrollView: {
            marginTop: 40,
            height: '100%',
            width: '100%',
        },
        scrollViewContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        sectionTitleText: {
            marginTop: '20%',
            paddingHorizontal: theme.defaultPadding,
            fontFamily: theme.fontBold,
            color: theme.accentLight,
            fontSize: 30,
            marginBottom: 15
        },
        searchBar: {
            paddingHorizontal: 15,
            justifyContent: 'center',
            alignSelf: 'center',
            width: '90%',
            height: 50,
            borderRadius: 50,
            overflow: 'hidden',
            backgroundColor: theme.gray,
        },
        searchBarInput: {
            overflow: 'hidden',
            fontFamily: theme.fontRegular,
            fontSize: 18,
            color: theme.foreground
        },
        resultImage: {
            // width: '85%',
            height: '75%',
            borderRadius: 15,
            alignSelf: 'center'
        },
        resultText: {
            fontFamily: theme.fontBold,
            fontSize: 20,
            color: theme.foreground,
            paddingHorizontal: theme.defaultPadding,
            marginTop: 20,
            marginBottom: 20
        },
    })

    return(
        <View style={styles.container}>
            <Nav isOnSearch/>
            <View
                colors={[
                    theme.accent,
                    'rgba(0, 0, 0, 0)',
                ]}
                style={styles.sectionTitle}
            >
                <Text style={styles.sectionTitleText}>
                    Search
                </Text>
            </View>

            <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchBarInput}
                        placeholder="My favorite movie is..."
                        placeholderTextColor={theme.foreground}
                        onChangeText={e => {
                            setInput(e)
                        }}
                        onEndEditing={() => {
                            setQuery(input)
                        }}
                    />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContainer}
                showsVerticalScrollIndicator={false}
            >
                {
                    results.map((item, index) => {
                        if (item.backdrop_path || item.poster_path)
                        return(
                            <View
                            key={index}
                            style={{
                                ...styles.result,
                                width: item.popularity > 150 ? '100%' : '50%',
                                height: item.popularity > 200 ? 300 : 400
                            }}
                            >
                                <Link to={`/movie/${item.id}`}>
                                <View>
                                        <Image
                                        source={{uri: `${imgPrefix}${item.popularity > 150 ? item.backdrop_path : item.poster_path}`}}
                                        style={{
                                            ...styles.resultImage,
                                            width: item.popularity > 150 ? width-30 : (width/2)-30,
                                        }}
                                        />
                                    <Text style={styles.resultText}>
                                        {item.title}
                                    </Text>
                                </View>
                                </Link>
                            </View>
                        )
                    })
                }
            </ScrollView>

        </View>
    )
}