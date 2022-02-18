import React, { useContext } from "react";
import {
    View,
    StyleSheet,
    Platform,
    NativeModules
} from 'react-native'
import { BlurView } from "@react-native-community/blur";
import { ThemeContext } from "./Contexts/ThemeContext";

const { StatusBarManager } = NativeModules;

const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBarManager.HEIGHT;

export default function AndroidStatusBarBlur(){
    const theme = useContext(ThemeContext)

    const styles = StyleSheet.create({
        blurView: {
            width: '100%',
            height: 1000,
        },
        container: {
            height: statusBarHeight,
            width: '100%',
            position: 'absolute',
            zIndex: 1,
            overflow: 'hidden'
        }
    })

    return(
        <View style={styles.container}>
            <BlurView
            style={styles.blurView}
            blurAmount={10}
            overlayColor={`${theme.type === 'light' ? '#ffffff80' : '#00000033'}`}
            />
        </View>
    )
}