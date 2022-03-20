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
    Image,
    StyleSheet,
    Dimensions,
    Animated
} from 'react-native'

import axios from 'axios'

import { ThemeContext } from './Contexts/ThemeContext'
import Carousel from 'react-native-snap-carousel';

import Poster from './Poster'

import { TMDB_API_KEY } from '@env'
import SlideAnimationFunction from './Utilities/SlideAnimationFuncion';
import { MovieContext } from '../App';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default function NowPlaying() {
    const theme = useContext(ThemeContext)

    const [nowPlaying, setNowPlaying] = useState([])
    const [activeSlide, setActiveSlide] = useState(0)

    const containerSlideAnim = useRef(new Animated.Value(250)).current

    function fetchData() {
        axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&page=1`)
            .then(result => setNowPlaying(result.data.results))
    }

    useEffect(() => {
        SlideAnimationFunction(containerSlideAnim, 0, 500, true, 500)
        fetchData()
    }, [])

    const styles = StyleSheet.create({
        container: {
            marginBottom: theme.homeComponentsBottomMargin,
            overflow: 'hidden',
            // transform: [{ 'translateY': containerSlideAnim }]
        },
        sectionTitle: {
            fontSize: 22,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            paddingHorizontal: theme.defaultPadding,
        },
        caption: {
            fontFamily: theme.fontRegular,
            marginBottom: 15,
            paddingHorizontal: theme.defaultPadding,
            color: theme.accent,
            // opacity: 0.6,
        },
        movieTitle: {
            textAlign: 'center',
            color: theme.foreground,
            marginTop: 5,
            fontFamily: theme.fontRegular
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
        <Animated.View style={styles.container}>
            <Text style={styles.sectionTitle}>
                Now Playing
            </Text>
            <Text style={styles.caption}>
                Movies currently playing in theatres
            </Text>

            <Carousel
                data={nowPlaying}
                horizontal
                renderItem={
                    item => {
                        return (
                            <View style={{ alignSelf: 'flex-start' }}>
                                <Poster
                                    movie={item.item}
                                    width={(width - (theme.defaultPadding * 2)) - 10}
                                    useBackdrop
                                    showText={false}
                                    animDelay={item.index * 100}
                                    originalQuality
                                    animate={false}
                                />
                                <Animated.Text style={styles.movieTitle}>
                                    {item.item.title}
                                </Animated.Text>
                            </View>
                        )
                    }}
                sliderWidth={width}
                itemWidth={(width - (theme.defaultPadding * 2)) - 10}
                layout="default"
                layoutCardOffset={8}
                activeSlideAlignment='center'
                onSnapToItem={e => setActiveSlide(e)}
                loop
            />
        </Animated.View>
    )
}