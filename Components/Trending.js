import React from "react";
import {
    useState,
    useContext,
    useEffect,
    useRef
} from "react";
import {
    Animated,
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    LayoutAnimation,
    Pressable
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import FastImage from 'react-native-fast-image'

import SlideAnimationFunction from "./Utilities/SlideAnimationFuncion";

import { ThemeContext } from "./Contexts/ThemeContext";
import Carousel from "react-native-snap-carousel";
import { MovieContext } from "../App";
import { TMDB_API_KEY } from '@env'
import { imgPrefixOriginal } from "./Utilities/Utilities";
import IndexDots from "./IndexDots";

const width = Dimensions.get('window').width

export default function Trending() {
    //states
    const theme = useContext(ThemeContext)
    const slideAnim = useRef(new Animated.Value(25)).current
    const containerSlideAnim = useRef(new Animated.Value(150)).current

    const [trendingMovies, setTrendingMovies] = useState([])
    const [activeSlide, setActiveSlide] = useState(0)

    const navigation = useNavigation()

    //functions
    function fetchData() {
        fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}`)
            .then(result => result.json()
                .then(data => setTrendingMovies(data.results))
            )
    }

    //run on mount
    useEffect(() => {
        SlideAnimationFunction(containerSlideAnim, 0, 1000)
        fetchData()
    }, [])
    //

    useEffect(() => {
        // Animated.timing(opacityAnim).reset()
        Animated.timing(slideAnim).reset()
        SlideAnimationFunction(slideAnim, 0, 500)
    }, [activeSlide])


    const styles = StyleSheet.create({
        container: {
            marginBottom: theme.homeComponentsBottomMargin,
        },
        sectionTitle: {
            fontSize: 16,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            paddingHorizontal: theme.defaultPadding,
            marginBottom: 10,
        },
        title: {
            fontSize: 14,
            color: theme.foreground,
            fontFamily: theme.fontBold,
            marginTop: 20,
        },
        banner: {
            backgroundColor: theme.accent,
            width: width - (theme.defaultPadding * 2),
            //aspect-ratio is 1/1.4; as in height is width + 40% of width
            height: (width - (theme.defaultPadding * 2)) * 1.4,
            borderRadius: theme.borderRadius,
            resizeMode: 'cover',
        },
        overview: {
            textAlign: 'left',
            marginTop: 5,
            fontFamily: theme.fontRegular,
            width: '100%',
            alignSelf: 'center',
            color: theme.foreground,
            opacity: 0.5
        },
    })

    function Banner(item) {
        return (
            <Pressable
                key={item.index}
                onPress={() => navigation.push('movie', { movieId: item.item.id })}
                removeClippedSubviews
                renderToHardwareTextureAndroid
                underlayColor={theme.background}
            >
                <View>
                    <FastImage
                        source={{
                            uri: `${imgPrefixOriginal}${item.item.poster_path}`,
                            priority: FastImage.priority.high
                        }}
                        style={styles.banner}
                    />
                </View>
            </Pressable>
        )
    }

    return (
        <Animated.View style={styles.container}>
            <Text style={{
                ...styles.sectionTitle,
            }}>
                Trending movies
            </Text>

            <Carousel
                data={trendingMovies}
                renderItem={Banner}
                sliderWidth={width}
                itemWidth={width - (theme.defaultPadding * 2)}
                layoutCardOffset={10}
                layout="stack"
                renderToHardwareTextureAndroid
                loop
                onSnapToItem={e => {
                    setActiveSlide(e)
                    LayoutAnimation.configureNext(
                        {
                            duration: 700,
                            update: { type: 'spring', springDamping: 0.4 },
                        }
                    );
                }}
                removeClippedSubviews
            />
            {trendingMovies.length > 0 ?

                <Pressable
                    style={{ paddingHorizontal: theme.defaultPadding }}
                    onPress={() => navigation.push('movie', { movieId: trendingMovies[activeSlide].id })}
                >
                    <IndexDots
                        data={trendingMovies}
                        active={activeSlide}
                    />
                    <Animated.Text
                        style={{
                            ...styles.title,
                            transform: [{ translateY: slideAnim }],
                        }}>
                        {trendingMovies[activeSlide].title}
                    </Animated.Text>

                    <Animated.Text
                        style={{
                            ...styles.overview,
                            transform: [{ translateY: slideAnim }],
                        }}>
                        {trendingMovies[activeSlide].overview}
                    </Animated.Text>

                </Pressable> : null}
        </Animated.View>
    )
}