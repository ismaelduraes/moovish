import React, { useContext, useEffect, useRef, useState } from "react";
import {
    StyleSheet,
    Dimensions,
    Text,
    Animated,
    Easing,
    View,
    SafeAreaView
} from 'react-native'
// import {  } from "react-native-safe-area-context";
import { ThemeContext } from "./Contexts/ThemeContext";

import SlideAnimationFunction from "./Utilities/SlideAnimationFuncion";

const height = Dimensions.get('window').height

export default function BottomPopUp({ setPopUpState, popUpState }) {
    const theme = useContext(ThemeContext)
    const slideAnim = useRef(new Animated.Value(100)).current

    //waits for 3.5 seconds and then sets popup as inactive
    async function unmount() {
        const timeout = await setTimeout(() => {
            Animated.timing(slideAnim, {
                toValue: 100,
                duration: 1000,
                useNativeDriver: true,
                easing: Easing.out(Easing.exp)
            }).start(() => clear())

        }, 3500)

        clear = () => {
            Animated.timing(slideAnim).stop()
            clearTimeout(timeout)
            setPopUpState({ isActive: false })
        }
        //slide down and set as inactive (from callback)
    }

    SlideAnimationFunction(slideAnim, 0, 1000, true)

    useEffect(() => {
        unmount()
    }, [])

    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            height: height,
            width: '100%',
            zIndex: 10,
            alignSelf: 'center',
            flex: 1,
            justifyContent: 'flex-end'
        },
        popUp: {
            zIndex: 10,
            height: 60,
            width: '100%',
            // marginTop: height - 60,

            // bottom: height - 60,
            paddingBottom: 15,

            backgroundColor: theme.background,

            transform: [{ translateY: slideAnim }],

            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',

            overflow: 'hidden'
        },
        text: {
            fontSize: 16,
            fontFamily: theme.fontRegular,
            color: theme.foreground
        },
        blur: {
            height: '1000%',
            width: '100%',
            position: 'absolute'
        }
    })

    return (
        // <Animated.View>
        <SafeAreaView pointerEvents="box-none" style={styles.container}>
            <Animated.View style={styles.popUp}>
                <Text style={styles.text}>
                    {popUpState.text}
                </Text>
            </Animated.View>
        </SafeAreaView>
        // </Animated.View>
    )
}