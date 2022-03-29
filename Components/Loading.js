import React, { useContext, useRef } from "react";
import {
    View,
    StyleSheet,
    Animated,
    Easing,
    Text
} from 'react-native'

import { default as MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons'
import { ThemeContext } from "./Contexts/ThemeContext";

export default function Loading({ isError = false }) {
    const theme = useContext(ThemeContext)

    const rotateAnim = useRef(new Animated.Value(0)).current

    const animTiming = Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.bounce
    })

    Animated.loop(animTiming).start()

    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: theme.background,
            zIndex: 10,
            alignItems: 'center',
            justifyContent: 'center'
        },
        text: {
            fontFamily: theme.fontBold,
            fontSize: 20,
            color: theme.foreground,
            marginTop: 15,
            textAlign: 'center',
            paddingHorizontal: theme.defaultPadding
        }
    })

    return (
        <View style={styles.container}>
            <Animated.View
                style={{
                    transform: [
                        {
                            rotateZ: rotateAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg']
                            })
                        }
                    ]
                }}
            >
                <MaterialCommunityIcons
                    name={isError ? "close" : "loading"}
                    size={50}
                    color={theme.accent}
                />
            </Animated.View>
            <Text style={styles.text}>
                {
                    isError ? "Something went wrong.\n\nPlease check your internet connection"
                        : "Loading..."
                }
            </Text>
        </View>
    )
}