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
    Image,
    View,
    TouchableOpacity
} from 'react-native'

import FastImage from "react-native-fast-image";
import { useNavigation } from "@react-navigation/native";

import { ThemeContext } from "./Contexts/ThemeContext";
import { imgPrefix, imgPrefixOriginal } from "./Utilities/Utilities";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import LinearGradient from "react-native-linear-gradient";

const width = Dimensions.get('window').width

export default function Poster({
    movie,
    //↓disable if you want to add custom text
    showText = true,
    showGradient = false,
    useBackdrop = false,
    originalQuality = false,
    width = 100,
    height,
    //↓useful if instantiating many. you can set the delay to be a multiple of the
    //index/key
    animDelay = 0,
    animate = true,
    //border radius
    isRounded = true
}) {
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()

    const slideAnim = useRef(new Animated.Value(animate ? 200 : 0)).current

    function playAnim() {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 750,
            delay: animDelay,
            useNativeDriver: true,
            easing: Easing.out(Easing.exp)
        }).start()
    }

    useEffect(() => {
        if (animate) playAnim()
    }, [])


    const styles = StyleSheet.create({
        container: {
            marginRight: 10,
            transform: [{ 'translateY': slideAnim }],
            width: width,
        },
        gradient: {
            width: '100%',
            top: '80%',
            height: '20%',
            position: 'absolute',
            zIndex: 1,
        },
        title: {
            marginTop: 5,
            textAlign: 'center',
            color: theme.foreground,
            fontFamily: theme.fontRegular,
            maxHeight: 45
        },
        banner: {
            //if height was defined, use it, if not, set height depending on whether image is backdrop or poster
            height: height ? height : (useBackdrop ? width * 0.55 : width * 1.5),
            width: width,
            borderRadius: isRounded ? theme.borderRadius : 0,
            backgroundColor: theme.accent,
        }
    })

    return (
        <Animated.View
            style={styles.container}
            key={movie.id}
            removeClippedSubviews
        >
            <Pressable
                onPress={() =>
                    navigation.push('movie', { movieId: movie.id })
                }
            >
                <View>
                    {showGradient ? <LinearGradient
                        colors={['rgba(0,0,0,0)', theme.background]}
                        style={styles.gradient}
                    /> : null}
                    <FastImage
                        style={styles.banner}
                        source={{
                            uri: `${originalQuality ? imgPrefixOriginal : imgPrefix}${useBackdrop ? movie.backdrop_path : movie.poster_path}`,
                            priority: FastImage.priority.high
                        }
                        }
                    />
                </View>
            </Pressable>
            {showText &&
                <Animated.Text style={styles.title}>
                    {movie.title}
                </Animated.Text>}

        </Animated.View>
    )
}