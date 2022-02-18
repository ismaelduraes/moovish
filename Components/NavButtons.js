import React, { useContext } from "react";
import {
    View,
    StyleSheet,
    NativeModules,
    Platform
} from 'react-native'

import { Link } from "react-router-native";
const { StatusBarManager } = NativeModules;

const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBarManager.HEIGHT;

import { default as Feather } from 'react-native-vector-icons/Feather'
import { ThemeContext } from "./Contexts/ThemeContext";
import { BlurView } from "@react-native-community/blur";

export default function NavButtons(){
    const theme = useContext(ThemeContext)
    const styles = StyleSheet.create({
        container: {
            height: 90,
            width: '100%',
            position: 'absolute',
            zIndex: 1
        },
        navigation: {
            marginTop: statusBarHeight+15,
            paddingHorizontal: theme.defaultPadding,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        icon: {
            width: 35,
            height: 35,
            textAlign: 'center',
            lineHeight: 35,
            borderRadius: 35,
            backgroundColor: theme.gray+'33'
        },
    })

    return(
        <View renderToHardwareTextureAndroid style={styles.container}>
            <View style={styles.navigation}>
                <Link to='/'>
                    <Feather
                    style={styles.icon}
                    name="arrow-left"
                    size={20}
                    color="white"
                    />
                </Link>
                <View style={{flexDirection: 'row'}}>
                    <Feather
                    style={{...styles.icon, marginRight: 15}}
                    name="plus"
                    size={20}
                    color="white"
                    >
                    </Feather>
                    <Feather
                    style={styles.icon}
                    name="share"
                    size={20}
                    color="white"
                    />
                </View>
            </View>
        </View>
    )
}