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
    TouchableHighlight
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import FastImage from 'react-native-fast-image'

import SlideAnimationFunction from "./Utilities/SlideAnimationFuncion";

import { ThemeContext } from "./Contexts/ThemeContext";
import Carousel from "react-native-snap-carousel";
import { MovieContext } from "../App";
import { TMDB_API_KEY } from '@env'
import { imgPrefixOriginal } from "./Utilities/Utilities";

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
        // console.log(`https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}`)
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
            position: 'relative',
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
        },
        title: {
            fontSize: 16,
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
            marginTop: 10,
            fontFamily: theme.fontRegular,
            width: '100%',
            alignSelf: 'center',
            color: theme.foreground,
            opacity: 0.6
        },
    })

    function Banner(item) {
        return (
            <TouchableHighlight
                onPress={() => navigation.push('movie', { movieId: item.item.id })}
                removeClippedSubviews
                renderToHardwareTextureAndroid
                key={item.item.movie_id}
            >
                <View>
                    <FastImage
                        source={{
                            uri: `${imgPrefixOriginal}${item.item.poster_path}`,
                            priority: FastImage.priority.high
                        }}
                        style={styles.banner}
                    />
                    {
                        activeSlide === item.index &&
                        <View>
                            <Animated.Text
                                style={{
                                    ...styles.title,
                                    transform: [{ translateY: slideAnim }],
                                }}>
                                {item.item.title}
                            </Animated.Text>

                            <Animated.Text
                                style={{
                                    ...styles.overview,
                                    transform: [{ translateY: slideAnim }],
                                }}>
                                {item.item.overview}
                            </Animated.Text>

                        </View>
                    }
                </View>
            </TouchableHighlight>
        )
    }

    return (
        <Animated.View style={styles.container}>
            <Text style={{
                ...styles.sectionTitle,
            }}>
                Trending
            </Text>
            <Text style={{
                ...styles.caption,
            }}>
                What everyone keeps talking about
            </Text>

            <Carousel
                data={trendingMovies}
                renderItem={Banner}
                sliderWidth={width}
                itemWidth={width - (theme.defaultPadding * 2)}
                layout="stack"
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
        </Animated.View>
    )
}