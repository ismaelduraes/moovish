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
import { ThemeContext } from './Contexts/ThemeContext'
import Carousel from 'react-native-snap-carousel';

import Poster from './Poster'

import { TMDB_API_KEY } from '@env'
import SlideAnimationFunction from './Utilities/SlideAnimationFuncion';
import { MovieContext } from '../App';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default function NowPlaying(){
    const theme = useContext(ThemeContext)
    const contextProps = useContext(MovieContext)

    const [nowPlaying, setNowPlaying] = useState([])
    const [activeSlide, setActiveSlide] = useState(0)
    
    const containerSlideAnim = useRef(new Animated.Value(250)).current
    const titleSlideAnim = useRef(new Animated.Value(15)).current

    function fetchData(){
        fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&page=1`)
        .then(result => result.json()
        .then(data => setNowPlaying(data.results))
        )
    }

    useEffect(() => {
        SlideAnimationFunction(containerSlideAnim, 0, 500, true, 500)
        fetchData()
    }, [])
    
    useEffect(() => {
        Animated.timing(titleSlideAnim).reset()
        SlideAnimationFunction(titleSlideAnim, 0, 500)
    }, [activeSlide])

    const styles = StyleSheet.create({
        container: {
            marginBottom: theme.homeComponentsBottomMargin,
            overflow: 'hidden',
            transform: [{'translateY': containerSlideAnim}]
        },
        sectionTitle: {
            fontSize: 26,
            fontFamily: theme.fontBold,
            color: theme.accentLight,
            paddingHorizontal: theme.defaultPadding,
        },
        caption: {
            fontFamily: theme.fontRegular,
            marginBottom: '5%',
            paddingHorizontal: theme.defaultPadding,
            color: theme.foreground
        },
        movieTitle: {
            textAlign: 'center',
            color: theme.foreground,
            marginTop: 5,
            transform: [{'translateY': titleSlideAnim}]
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
                    return(
                    <View>
                    <Poster
                        movie={item.item}
                        width={width-(theme.defaultPadding*2)}
                        useBackdrop
                        originalQuality
                        showText={false}
                        animDelay={item.index * 100}
                    />
                    <Animated.Text style={styles.movieTitle}>
                        {activeSlide === item.index ? item.item.title : null}
                    </Animated.Text>
                    </View>
                    )
                }}
                sliderWidth={width}
                itemWidth={width-(theme.defaultPadding*2)}
                layout="stack"
                layoutCardOffset={10}
                removeClippedSubviews
                onSnapToItem={e => setActiveSlide(e)}
            />
        </Animated.View>
    )
}