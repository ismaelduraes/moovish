import React from 'react'
import {
    useContext,
    useRef, 
    useState,
    useEffect
} from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Animated
} from 'react-native'

import { ThemeContext } from './Contexts/ThemeContext'
import Poster from './Poster'

import SlideAnimationFunction from './Utilities/SlideAnimationFuncion'

import { TMDB_API_KEY } from '@env'

export default function New(){
    const theme = useContext(ThemeContext)
    const [newMoviesData, setNewMoviesData] = useState([])

    const containerSlideAnim = useRef(new Animated.Value(150)).current
    const containerOpacityAnim = useRef(new Animated.Value(0)).current

    function fetchData(){
        fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&page=1`)
        .then(result => result.json()
        .then(data => setNewMoviesData(data.results))
        )
    }

    useEffect(() => {
        fetchData()
        SlideAnimationFunction(containerSlideAnim, 0, 1000)
        SlideAnimationFunction(containerOpacityAnim, 1, 1000)
    }, [])

    const styles = StyleSheet.create({
        container: {
            marginBottom: theme.homeComponentsBottomMargin,
            overflow: 'hidden',
            transform: [{'translateY': containerSlideAnim}],
            opacity: containerOpacityAnim
        },
        sectionTitle: {
            fontSize: 22,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            paddingHorizontal: theme.defaultPadding,
        },
        caption: {
            fontFamily: theme.fontRegular,
            marginBottom: '5%',
            paddingHorizontal: theme.defaultPadding,
            color: theme.foreground,
            opacity: 0.6,
        },
        scrollView: {
            paddingHorizontal: theme.defaultPadding,
        }
    })

    return (
        <Animated.View style={styles.container}>
            <Text style={styles.sectionTitle}>
                New and fresh
            </Text>
            <Text style={styles.caption}>
                Just released or upcoming
            </Text>

            <FlatList
                removeClippedSubviews
                contentContainerStyle={styles.scrollView}
                showsHorizontalScrollIndicator={false}
                horizontal
                data={newMoviesData}
                renderItem={(item, index) => {
                    return(
                        <View key={item.index}>
                            <Poster
                                movie={item.item}
                                animDelay={item.index*100}
                                width={100}
                            />
                        </View>
                    )
                }}
            />
        </Animated.View>
    )
}
