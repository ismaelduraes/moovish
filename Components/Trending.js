import React from "react";
import { useState, useContext, useEffect, useRef } from "react";
import { Animated, View, Text, StyleSheet, Image, Dimensions, Easing } from "react-native";

import { ThemeContext } from "./Contexts/ThemeContext";
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Carousel from "react-native-snap-carousel";
import LinearGradient from "react-native-linear-gradient";
import { BlurView } from '@react-native-community/blur'
import { MovieContext } from "../App";
import { TMDB_API_KEY } from '@env'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default function Trending(){
    //states
    const theme = useContext(ThemeContext)
    const contextProps = useContext(MovieContext)

    const opacityAnimRef = useRef(new Animated.Value(0)).current
    const topAnimRef = useRef(new Animated.Value(25)).current

    const [trendingMovies, setTrendingMovies] = useState([])
    const [activeSlide, setActiveSlide] = useState(0)

    //function
    function playAnim(animRef, to = 0, duration = 1000, useNative = true){
        Animated.timing(animRef, {
            toValue: to,
            duration,
            useNativeDriver: true,
            easing: Easing.out(Easing.exp)
        }).start()
    }
    function fetchData(){
        fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}`)
        .then(result => result.json()
        .then(data => setTrendingMovies(data.results))
        )
    }

    useEffect(() => {
        Animated.timing(opacityAnimRef).reset()
        Animated.timing(topAnimRef).reset()
        playAnim(opacityAnimRef, 1, 1000)
        playAnim(topAnimRef, 0, 1000, false)
    }, [activeSlide])

    

    useEffect(() => {
        fetchData();
    }, [])

    const styles = StyleSheet.create({
        container: {
            marginBottom: 25,
            alignItems: 'center',
            position: 'relative',
            height: 750
        },
        sectionTitle: {
            fontSize: 26,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            paddingHorizontal: '7%',
            marginBottom: 20,
        },
        title: {
            marginTop: '5%',
            fontSize: 20,
            color: theme.foreground,
            fontFamily: theme.fontRegular,
        },
        banner: {
            backgroundColor: theme.accent,
            width: '100%',
            height: 500,
            borderRadius: 15,
            resizeMode: 'cover',
        },
        overview: {
            textAlign: 'left',
            marginTop: 10,
            fontFamily: theme.fontRegular,
            width: '100%',
            alignSelf: 'center',
            height: 100,
        },
        trendingGradient: {
            width: '100%',
            height: 200,
            top: '35%',
            position: 'absolute'
        },
        seeMore: {
            position: 'absolute',
            top: '85%',
            width: '100%'
        },
        seeMoreText: {
            position: 'absolute',
            textAlign: 'center',
            alignSelf: 'center',
            borderRadius: 50,
            height: 30,
            lineHeight: 30,
            width: '30%',
            color: theme.foreground,
            backgroundColor: theme.accent,
            top: '20%',
        },
        blur: {
            position: 'absolute',
            height: '100%',
            width: '100%',
        }
    })
    
    function Banner(item){
        return(
            <View>
                <View
                onTouchEnd={
                    () => {
                    contextProps.setIsOnMovie(true)
                    contextProps.setSelectedMovie(item.item.id)
                }}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                    }}
                >
                    <Image source={{uri: `https://image.tmdb.org/t/p/original${item.item.poster_path}`}} style={styles.banner}
                    />

                    {
                    item.index === 0 &&
                    <Icon
                        name="arrow-right"
                        size={24}
                        style={{left: 5}}
                    />
                    }
                </View>

                {
                activeSlide === item.index &&
                <View>
                    <Animated.Text
                    style={{
                        ...styles.title,
                        opacity: opacityAnimRef,
                        transform: [{translateY: topAnimRef}]
                    }}>
                        {item.item.title}
                    </Animated.Text>

                    <Animated.Text
                    style={{
                        ...styles.overview,
                        opacity: opacityAnimRef,
                        transform: [{translateY: topAnimRef}]
                    }}>
                        {item.item.overview}
                    </Animated.Text>

                    <LinearGradient
                    style={styles.trendingGradient}
                    colors={
                        ['rgba(0, 0, 0, 0)',
                         'rgba(0, 0, 0, 1)',
                         'rgba(0, 0, 0, 1)']
                    }/>

                    <Animated.View
                        //open movie if such is the active slide and clicked
                        //this conditon prevents users from opening the wrong slide
                        //accidentaly
                        onTouchEnd={(() => {
                            if (item.index === activeSlide){
                                contextProps.setIsOnMovie(true)
                                contextProps.setSelectedMovie(item.item.id)
                            }
                        })}
                        style={{
                            ...styles.seeMore,
                            opacity: opacityAnimRef,
                            transform: [{translateY: topAnimRef}]
                    }}>
                        
                        <Text style={{
                            ...styles.seeMoreText,
                            position: 'absolute'
                        }}>
                            See More
                        </Text>

                    </Animated.View>
                </View>
                }
            </View>
        )
    }

    return(
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>
                Trending
            </Text>
            <Carousel
                data={trendingMovies}
                renderItem={Banner}
                sliderWidth={width}
                itemWidth={width*0.85}
                layout="stack"
                onSnapToItem={e => setActiveSlide(e)}
            />
        </View>
    )
}