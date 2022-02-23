import axios from 'axios'
import React from 'react'
import { useContext, useState } from 'react'
import {
    View,
    Image,
    Text,
    TextInput,
    StyleSheet
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ThemeContext } from '../Components/Contexts/ThemeContext'

export default function Library(){
    const theme = useContext(ThemeContext)
    const [currentScreen, setCurrentScreen] = useState(0)

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.background,
            height: '100%'
        },
        screenTitle: {
            fontSize: 30,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            width: '100%',
            paddingHorizontal: theme.defaultPadding,
            marginTop: 15,
        },
        navigation: {
            width: '100%',

            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',

            marginTop: 15,
        },
        navigationItem: {
            color: theme.foreground,
            padding: 10,
            paddingHorizontal: 20,
            borderRadius: theme.borderRadius
        }
    })

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.screenTitle}>
                Library
            </Text>

            <View style={styles.navigation}>
                <View onTouchEnd={() => setCurrentScreen(0)}>
                    <Text
                    style={{...styles.navigationItem,
                        marginRight: 15,
                        fontFamily: currentScreen === 0 ? theme.fontBold : theme.fontRegular,
                        backgroundColor: currentScreen === 0 ? theme.gray : 'transparent',
                    }}
                    >
                        To Watch
                    </Text>
                </View>
                <View onTouchEnd={() => setCurrentScreen(1)}>
                    <Text
                    style={{
                        ...styles.navigationItem,
                        fontFamily: currentScreen === 1 ? theme.fontBold : theme.fontRegular,
                        backgroundColor: currentScreen === 1 ? theme.gray : 'transparent',
                    }}
                    >
                        Watched
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    )
}