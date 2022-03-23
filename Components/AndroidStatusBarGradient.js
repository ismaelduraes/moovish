import React, { useContext } from "react";
import {
    View,
    StyleSheet,
    Platform,
    NativeModules
} from 'react-native'

import LinearGradient from "react-native-linear-gradient";
import { ThemeContext } from "./Contexts/ThemeContext";

const { StatusBarManager } = NativeModules;

const statusBarHeight = Platform.OS === 'ios' ? 30 : StatusBarManager.HEIGHT;

export default function AndroidStatusBarGradient() {
    const theme = useContext(ThemeContext)

    const styles = StyleSheet.create({
        container: {
            height: statusBarHeight * 8,
            width: '100%',
            position: 'absolute',
            zIndex: 1,
            overflow: 'hidden'
        }
    })

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[
                    theme.accent + '88',
                    'rgba(0, 0, 0, 0)',
                    'rgba(0, 0, 0, 0)',
                ]}
                style={styles.container} />
        </View>
    )
}