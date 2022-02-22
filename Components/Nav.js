import React from 'react'
import { useContext } from 'react'
import { ThemeContext } from './Contexts/ThemeContext'
import { Text, StyleSheet, View } from 'react-native'

import { default as MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons'
import { default as Feather } from 'react-native-vector-icons/Feather'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PropsContext } from './Contexts/PropsContext'
import { themes } from './Contexts/ThemeContext'

export default function Nav({isOnSearch = false, title = 'moovish'}){
    const theme = useContext(ThemeContext)
    const contextProps = useContext(PropsContext)

    const styles = StyleSheet.create({
        container :{
            zIndex: 10,
            position: 'absolute',
            // height: '100%',
            width: '100%',
            overflow: 'hidden',
            backgroundColor: theme.background
        },
        title: {
            fontSize: 32,
            fontFamily: theme.fontBold,
            color: theme.foreground,
        },
        navigation: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            height:70,
            overflow: 'hidden',
            zIndex: 1,
            paddingHorizontal: theme.defaultPadding,
            alignItems: 'center',
            // backgroundColor: theme.background,
        },
        blur: {
            width: '100%',
            height: '100%',
            position: 'absolute'
        }
    })

    return(
        <SafeAreaView style={styles.container} pointerEvents='box-none'>
            {/* <BlurView
            style={styles.blur}
            blurAmount={32}
            overlayColor={`${theme.type === 'light' ? '#ffffffb3' : '#000000cc'}`}
            /> */}
            <View style={styles.navigation}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <MaterialCommunityIcons
                    name="movie-open-outline"
                    size={30}
                    color={theme.accent}
                    style={{marginRight: 15}}
                    />
                    <Text style={styles.title}>
                        {title}
                    </Text>
                </View>
                <View
                onTouchEnd={
                    () => {
                        contextProps.setCurrentTheme(
                            contextProps.currentTheme.type === 'light' ?
                            themes.dark :
                            themes.light
                        )
                    }
                }
                >
                    <Feather
                    name="sun"
                    color={theme.foreground}
                    size={30}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}