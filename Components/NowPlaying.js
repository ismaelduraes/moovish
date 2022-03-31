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
    Pressable
} from 'react-native'

import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

import { ThemeContext } from './Contexts/ThemeContext'
import { TMDB_API_KEY } from '@env'

import Poster from './Poster'


import { default as MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default function NowPlaying() {
    const theme = useContext(ThemeContext)

    const navigation = useNavigation()

    const [nowPlaying, setNowPlaying] = useState({})

    function fetchData() {
        const rand = Math.floor(Math.random() * 10)
        axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&page=1`)
            .then(result => setNowPlaying(result.data.results[rand]))
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

            fontSize: 16,
            fontFamily: theme.fontBold,
            color: theme.foreground,
        },
        overview: {
            marginTop: 5,
            textAlign: 'left',
            paddingHorizontal: theme.defaultPadding,
            width: '100%',
            color: theme.foreground,
            fontFamily: theme.fontRegular,
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
                data={nowPlaying}
                width={width}
                height={height * 0.5}
                marginRight={0}
                showText={false}
                originalQuality
                animate={false}
                isRounded={false}
                showGradient={true}
                useBackdrop
            />
            <Pressable
                style={styles.text}
                onPress={() => navigation.push('movie', { movieId: nowPlaying.id })}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: theme.defaultPadding
                    }}
                >
                    <Text style={styles.sectionTitle}>
                        {nowPlaying.title}
                    </Text>
                    <MaterialCommunityIcons
                        name="chevron-right"
                        color={theme.foreground}
                        size={25}
                        style={{ marginLeft: 5 }}
                    />
                </View>
                <Text style={styles.overview}>
                    {nowPlaying.overview}
                </Text>
            </Pressable>

        </View>
    )
}