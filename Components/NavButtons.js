import React, { useContext } from "react";
import {
    View,
    StyleSheet,
    NativeModules,
    Platform
} from 'react-native'
import { useNavigation } from "@react-navigation/native";

const { StatusBarManager } = NativeModules;

const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBarManager.HEIGHT;

import { default as Feather } from 'react-native-vector-icons/Feather'
import { ThemeContext } from "./Contexts/ThemeContext";

export default function NavButtons(){
    const theme = useContext(ThemeContext)
    const { goBack } = useNavigation()

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
            backgroundColor: theme.gray+'b3'
        },
    })

    return(
        <View style={styles.container}>
            <View style={styles.navigation}>
                <View onTouchEnd={() => goBack()}>
                    <Feather
                    style={styles.icon}
                    name="arrow-left"
                    size={20}
                    color={theme.foreground}
                    />
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View>
                        <Feather
                        style={{...styles.icon, marginRight: 15}}
                        name="plus"
                        size={20}
                        color={theme.foreground}
                        />
                    </View>
                    <View>
                        <Feather
                        style={styles.icon}
                        name="share"
                        size={20}
                        color={theme.foreground}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}