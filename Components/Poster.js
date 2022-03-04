import React from "react";
import {
    useContext,
    useRef,
    useEffect
} from "react";
import {
    StyleSheet,
    Animated,
    Easing,
    Dimensions,
    Image
} from 'react-native'

import FastImage from "react-native-fast-image";
import { useNavigation } from "@react-navigation/native";

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
    animDelay = 0,
    animate = true
    }){
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()

    const slideAnim = useRef(new Animated.Value(animate ? 200 : 0)).current
    
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
        if(animate) playAnim()
    }, [])


    const styles = StyleSheet.create({
        container: {
            marginRight: 10,
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
            height: useBackdrop ? width*0.55 : width*1.5,
            width: width,
            borderRadius: theme.borderRadius,
            backgroundColor: theme.accent,
        }
    })
    
    return(
        <Animated.View
        style={styles.container}
        onTouchEnd={() => {
            navigation.push('movie', {movieId: movie.id})
        }}
        key={movie.id}
        removeClippedSubviews
        >
                <FastImage
                    style={styles.banner}
                    source={{
                        uri: `${originalQuality ? imgPrefixOriginal : imgPrefix}${useBackdrop? movie.backdrop_path : movie.poster_path}`,
                        priority: FastImage.priority.high
                    }
                }
                />
            {showText && 
            <Animated.Text style={styles.title}>
                {movie.title}
            </Animated.Text>}

        </Animated.View>
    )
}