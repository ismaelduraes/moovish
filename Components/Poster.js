import React from "react";
import {
    useContext,
    useRef,
    useEffect,
    useState
} from "react";
import {
    StyleSheet,
    Animated,
    Easing,
    Dimensions,
    ActivityIndicator,
    View,
} from 'react-native'

import FastImage from "react-native-fast-image";
import { useNavigation } from "@react-navigation/native";

import { ThemeContext } from "./Contexts/ThemeContext";
import { imgPrefix, imgPrefixOriginal } from "./Utilities/Utilities";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import LinearGradient from "react-native-linear-gradient";

const width = Dimensions.get('window').width

export default function Poster({
    data,
    //↓disable if you want to add custom text
    showText = true,
    cutText = false,
    showGradient = false,
    useBackdrop = false,
    originalQuality = false,
    width = 100,
    height,
    marginRight = 15,
    marginBottom = 0,
    //↓useful if instantiating many. you can set the delay to be a multiple of the
    //index/key
    animDelay = 0,
    animate = true,
    //border radius
    isRounded = true,
    alignCenter
}) {
    const theme = useContext(ThemeContext)
    const [isImageLoading, setIsImageLoading] = useState(true)

    const mediaType = data.name ? 'tv' : 'movie'


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
            marginRight,
            marginBottom,
            transform: [{ 'translateY': slideAnim }],
            width: width,
            alignSelf: alignCenter ? 'center' : 'auto',
            // backgroundColor: 'blue'
        },
        gradient: {
            width: '100%',
            top: '60%',
            height: '40%',
            position: 'absolute',
            zIndex: 1,
        },
        title: {
            marginTop: 5,
            textAlign: 'center',
            color: theme.foreground,
            fontFamily: theme.fontRegular,
            // maxHeight: 45
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
            key={data.id}
        // removeClippedSubviews
        >
            <Pressable
                onPress={() => {
                    if (mediaType === "movie") {
                        navigation.push('movie', { movieId: data.id })
                    }
                    else if (mediaType === "tv") {
                        navigation.push('show', { showId: data.id })
                    }
                }
                }
            >
                <View>
                    {showGradient ?
                        <LinearGradient
                            colors={['rgba(0,0,0,0)', theme.background]}
                            style={styles.gradient}
                        /> : null}
                    {isImageLoading ?
                        <ActivityIndicator
                            style={{
                                position: 'absolute',
                                alignSelf: 'center',
                                zIndex: 1,
                                height: '100%'
                            }}
                            size="large"
                            color={theme.background}
                        /> : null
                    }
                    <FastImage
                        style={styles.banner}
                        source={{
                            uri: `${originalQuality ? imgPrefixOriginal : imgPrefix}${useBackdrop ? data.backdrop_path : data.poster_path}`,
                            priority: FastImage.priority.high
                        }
                        }
                        onLoad={() => setIsImageLoading(false)}
                    />
                </View>
            </Pressable>
            {showText && cutText ?
                <Animated.Text style={styles.title}>
                    {data.name ? data.name.slice(0, 25) : data.title.slice(0, 25)}{data.name ? (data.name.length >= 25 ? '...' : '') : (data.title.length >= 25 ? '...' : '')}
                </Animated.Text> : null}
            {showText && !cutText ?
                <Animated.Text style={styles.title}>
                    {data.name ? data.name : data.title}
                </Animated.Text> : null}

        </Animated.View>
    )
}