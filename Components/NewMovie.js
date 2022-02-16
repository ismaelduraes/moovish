import React from "react";
import { useContext, useState, useRef, useEffect } from "react";
import { View, Image, Text, StyleSheet, Animated, Easing } from 'react-native'
import { MovieContext } from "../App";

import { ThemeContext } from "./Contexts/ThemeContext";

export default function NewMovie({fullRes = false, movie, delay = 0}){
    const theme = useContext(ThemeContext)
    const contextProps = useContext(MovieContext)

    const slideAnim = useRef(new Animated.Value(200)).current
    const opacityAnim = useRef(new Animated.Value(0)).current
    
    function playAnim(){
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 750,
            delay: delay,
            useNativeDriver: true,
            easing: Easing.out(Easing.exp)
        }).start()
        Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 3000,
            delay: delay,
            useNativeDriver: true,
            easing: Easing.out(Easing.exp)
        }).start()
    }
    useEffect(() => {
        playAnim()
    }, [])


    const styles = StyleSheet.create({
        container: {
            marginRight: 15,
            transform: [{'translateY': slideAnim}],
            opacity: opacityAnim
        },
        title: {
            marginTop: 5,
            textAlign: 'center',
            width: 120,
            color: theme.foreground,
            fontFamily: theme.fontRegular,
        },
        banner: {
            height: 180,
            width: 120,
            borderRadius: 15,
            backgroundColor: theme.accent
        }
    })
    
    return(
        <Animated.View
            style={styles.container}
            onTouchEnd={() => {
                contextProps.setSelectedMovie(movie.id)
                contextProps.setIsOnMovie(true)
            }}
        >
            <Image
                style={styles.banner}
                source={{uri: `https://image.tmdb.org/t/p/${fullRes ? 'original' : 'w400'}/${movie.poster_path}`}}/>
            <Text style={styles.title}>
                {movie.title}
            </Text>
        </Animated.View>
    )
}