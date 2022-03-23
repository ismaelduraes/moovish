import React from 'react'
import {
    useContext,
    useState,
    useEffect,
    useRef
} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native'

import axios from 'axios'

import { ThemeContext } from './Contexts/ThemeContext'

import Poster from './Poster'

import { TMDB_API_KEY } from '@env'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default function NowPlaying() {
    const theme = useContext(ThemeContext)

    const [nowPlaying, setNowPlaying] = useState({})

    function fetchData() {
        axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&page=1`)
            .then(result => setNowPlaying(result.data.results[0]))
    }

    useEffect(() => {
        fetchData()
    }, [])

    const styles = StyleSheet.create({
        container: {
            marginBottom: -15
            // overflow: 'hidden',
        },
        text: {
            top: -50
        },
        sectionTitle: {
            textAlign: 'left',

            fontSize: 20,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            marginHorizontal: theme.defaultPadding,
            marginBottom: 15,
            marginTop: 30,
        },
        overview: {
            textAlign: 'left',
            paddingHorizontal: theme.defaultPadding,
            width: '100%',
            color: theme.foreground,
            fontFamily: theme.fontRegular,
            fontSize: 14
        },
        gradient: {
            position: 'absolute',
            height: 300,
            width: 50,
            left: '86%',
            zIndex: 1,
        }
    })

    return (
        <View style={styles.container}>
            <Poster
                movie={nowPlaying}
                width={width}
                height={height * 0.4}
                showText={false}
                originalQuality
                animate={false}
                isRounded={false}
                showGradient={true}
                useBackdrop
            />
            <View style={styles.text}>
                <Text style={styles.sectionTitle}>
                    {nowPlaying.title}
                </Text>
                <Text style={styles.overview}>
                    {nowPlaying.overview}
                </Text>
            </View>
        </View>
    )
}