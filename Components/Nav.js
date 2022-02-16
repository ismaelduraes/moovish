import React from 'react'
import { useContext } from 'react'
import { ThemeContext } from './Contexts/ThemeContext'
import { Text, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { default as Ionicons } from 'react-native-vector-icons/Ionicons'
import { MovieContext } from '../App'

export default function Nav({title = 'moovish'}){
    const theme = useContext(ThemeContext)
    const contextProps = useContext(MovieContext)

    const styles = StyleSheet.create({
        container :{
            height: '15%',
            width: '100%',
            justifyContent: 'space-evenly',
            zIndex: 10
        },
        title: {
            fontSize: 28,
            fontFamily: theme.fontBold,
            color: theme.foreground
        },
        navigation: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11%',
            top: -30,
        }
    })

    return(
        <LinearGradient
            colors={[
                theme.accent,
                'rgba(0, 0, 0, 0)'
                ]}
            style={styles.container}
        >
            <View style={styles.navigation}>
                <Ionicons
                    name="ios-person-outline"
                    size={30}
                    color={theme.foreground}
                />

                <Text
                    onTouchEnd={() => {
                        contextProps.setIsOnSearch(false)
                        contextProps.setIsOnMovie(false)
                    }}
                    style={styles.title}
                >
                    {title}
                </Text>
                
                <View
                    onTouchEnd={() => {
                        contextProps.setIsOnSearch(!contextProps.isOnSearch)
                        contextProps.setIsOnMovie(false)
                    }}
                >
                    {
                    contextProps.isOnSearch ?
                    <Ionicons
                        name="close-outline"
                        size={30}
                        color={theme.foreground}
                    /> :
                    <Ionicons
                    name="ios-search-outline"
                    size={30}
                    color={theme.foreground}
                    />
                    }
                </View>
            </View>
        </LinearGradient>
    )
}