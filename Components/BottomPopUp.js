import React, { useContext, useEffect, useRef } from "react";
import {
    StyleSheet,
    Dimensions,
    Text,
    Animated,
    Easing
} from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "./Contexts/ThemeContext";

import { BlurView } from "@react-native-community/blur";
import SlideAnimationFunction from "./Utilities/SlideAnimationFuncion";

const height = Dimensions.get('window').height

export default function BottomPopUp({setPopUpState, popUpState}){
    const theme = useContext(ThemeContext)
    const slideAnim = useRef(new Animated.Value(100)).current

    //waits for 3.5 seconds and then sets popup as inactive
    async function unmount(){
        const timeout = await setTimeout(() => {
            console.log('done')
            Animated.timing(slideAnim, {
                toValue: 100,
                duration: 1000,
                useNativeDriver: true,
                easing: Easing.out(Easing.exp)
            }).start(() => setPopUpState({isActive: false}))

        }, 3500)

        return () => {
            Animated.timing(slideAnim).stop()
            clearTimeout(timeout)
        }
        //slide down and set as inactive (from callback)
    }

    SlideAnimationFunction(slideAnim, 0, 500, true)

    useEffect(() => {
        unmount()
    }, [])
    
    const styles = StyleSheet.create({
        container: {
            height: '100%',
            width: '100%',
            position: 'absolute',
            zIndex: 10,
        },
        popUp: {
            zIndex: 10,
            height: 60,
            width: '100%',
            top: height-60,

            backgroundColor: theme.background,

            transform: [{translateY: slideAnim}],
            
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

    return(
        <Animated.View>
            <SafeAreaView pointerEvents="box-none" style={styles.container}>
                <Animated.View style={styles.popUp}>
                    <Text style={styles.text}>
                        {popUpState.text}
                    </Text>
                </Animated.View>
            </SafeAreaView>
        </Animated.View>
    )
}