import React from 'react'
import { useContext, useState, useEffect, useRef } from 'react'
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    Animated
} from 'react-native'

import { default as Ionicons } from 'react-native-vector-icons/Ionicons'

import { ThemeContext } from './Contexts/ThemeContext'
import Poster from './Poster'
import { TMDB_API_KEY } from '@env'
import SlideAnimationFunction from './Utilities/SlideAnimationFuncion'

export default function TopRated() {
    const theme = useContext(ThemeContext)
    const [topRated, setTopRated] = useState([])

    const containerSlideAnim = useRef(new Animated.Value(150)).current
    const containerOpacityAnim = useRef(new Animated.Value(0)).current

    function fetchData() {
        fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&page=1`)
            .then(result => result.json()
                .then(data => setTopRated(data.results))
            )
    }

    useEffect(() => {
        fetchData()
        SlideAnimationFunction(containerSlideAnim, 0, 1000,)
        SlideAnimationFunction(containerOpacityAnim, 1, 1000)
    }, [])

    const styles = StyleSheet.create({
        container: {
            marginBottom: theme.homeComponentsBottomMargin,
            overflow: 'hidden',
            transform: [{ 'translateY': containerSlideAnim }],
            opacity: containerOpacityAnim
        },
        sectionTitle: {
            fontSize: 16,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            paddingHorizontal: theme.defaultPadding,
            marginBottom: 10,
        },
        caption: {
            fontFamily: theme.fontRegular,
            paddingHorizontal: theme.defaultPadding,
            color: theme.foreground,
            // opacity: 0.6,
        },
        gradient: {
            position: 'absolute',
            height: 300,
            width: 50,
            left: '86%',
            zIndex: 1,
        },
        scrollView: {
            paddingLeft: theme.defaultPadding
        }
    })

    return (
        <Animated.View style={styles.container}>
            <Text style={styles.sectionTitle}>
                Top rated movies
            </Text>

            <ScrollView
                removeClippedSubviews
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollView}
                horizontal
            >
                {topRated.splice(0, 10).map(
                    (item, index) => {
                        return (
                            <Poster
                                data={item}
                                key={index}
                            />
                        )
                    })}
            </ScrollView>
        </Animated.View>
    )
}
