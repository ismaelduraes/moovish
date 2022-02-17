import React from "react";
import { useContext, useRef, useEffect } from "react";
import { Image, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native'

import { Link } from "react-router-native";

import { ThemeContext } from "./Contexts/ThemeContext";
import { imgPrefix, imgPrefixOriginal } from "./Utilities/Utilities";

const width = Dimensions.get('window').width

export default function Poster({
    movie,
    showText = true,
    //↓disable if you want to add custom text
    useBackdrop = false,
    originalQuality = false,
    width = 100,
    //↓useful if instantiating many. you can set the delay to be a multiple of the
    //index/key
    animDelay = 0
    }){
    const theme = useContext(ThemeContext)

    const slideAnim = useRef(new Animated.Value(200)).current
    
    function playAnim(){
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 750,
            delay: animDelay,
            useNativeDriver: true,
            easing: Easing.out(Easing.exp)
        }).start()
    }

    useEffect(() => {
        playAnim()
    }, [])


    const styles = StyleSheet.create({
        container: {
            marginRight: 9,
            transform: [{'translateY': slideAnim}],
            width: width,
        },
        title: {
            marginTop: 5,
            textAlign: 'center',
            color: theme.foreground,
            fontFamily: theme.fontRegular,
        },
        banner: {
            height: useBackdrop ? width*0.55 : width*1.6,
            width: width,
            borderRadius: 15,
            backgroundColor: theme.accent,
        }
    })
    
    return(
        <Link to={`/movie/${movie.id}`} state={{id: movie.id}}>
        <Animated.View
            style={styles.container}
        >
                <Image
                    style={styles.banner}
                    source={{uri: `${originalQuality ? imgPrefixOriginal : imgPrefix}${useBackdrop? movie.backdrop_path : movie.poster_path}`}}
                    progressiveRenderingEnabled
                    onError={e => console.log(e.nativeEvent)}
                />
            {showText && 
            <Animated.Text style={styles.title}>
                {movie.title}
            </Animated.Text>}

        </Animated.View>
        </Link>
    )
}