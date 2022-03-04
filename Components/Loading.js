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

export default function Loading(){
    const theme = useContext(ThemeContext)

    const rotateAnim = useRef(new Animated.Value(0)).current

    const animTiming = Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear
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
            color: theme.foreground
        }
    })

    return(
        <View style={styles.container}>
            <Animated.View
            style={{
                transform: [
                    {rotateZ: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                    })}
                ]
            }}
            >
                <MaterialCommunityIcons
                name="loading"
                size={50}
                color={theme.accent}
                />
            </Animated.View>
            <Text style={styles.text}>
                Loading...
            </Text>
        </View>
    )
}