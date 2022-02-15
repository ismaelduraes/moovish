import React from "react";
import { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";

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
    const theme = useContext(ThemeContext)
    const contextProps = useContext(MovieContext)

    const [trendingMovies, setTrendingMovies] = useState([])
    function fetchData(){
        fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}`)
        .then(result => result.json()
        .then(data => setTrendingMovies(data.results))
        )
    }

    useEffect(() => {
        fetchData();
    }, [])

    const styles = StyleSheet.create({
        container: {
            marginBottom: '15%',
            alignItems: 'center',
            position: 'relative',
        },
        sectionTitle: {
            fontSize: 26,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            alignSelf: 'center',
            paddingHorizontal: '7%',
            marginBottom: 20
        },
        title: {
            marginTop: '5%',
            fontSize: 20,
            color: theme.foreground,
            fontFamily: theme.fontRegular,
            alignSelf: 'center'
        },
        banner: {
            backgroundColor: theme.accent,
            width: '100%',
            height: 500,
            borderRadius: 15,
            resizeMode: 'cover',
        },
        overview: {
            textAlign: 'center',
            marginTop: 10,
            fontFamily: theme.fontRegular,
            width: '80%',
            alignSelf: 'center',
            height: 100
        },
        trendingGradient: {
            width: '100%',
            height: 100,
            position: 'absolute'
        },
        trendingGradientBg: {
            width: '100%',
            height: 100,
            zIndex: 2,
            borderRadius: 50
        },
        seeMore: {
            position: 'absolute',
            top: '88%',
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
        }
    })
    
    function Banner(item){
        return(
            <View>

                <View onTouchEnd={() => {
                    contextProps.setIsOnMovie(true)
                    contextProps.setSelectedMovie(item.item.id)
                }} style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={{uri: `https://image.tmdb.org/t/p/original${item.item.poster_path}`}} style={styles.banner}/>
                </View>

                <Text style={styles.title}>
                    {item.item.title}
                </Text>

                <Text style={styles.overview}>
                    {item.item.overview}
                </Text>

                <View style={styles.seeMore}>
                    <LinearGradient style={styles.trendingGradient} colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)']}/>

                    <Text style={{...styles.seeMoreText, position: 'absolute'}}>
                        See More
                    </Text>
                </View>
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
            layout="default"
            lockScrollWhileSnapping
            />
        </View>
    )
}