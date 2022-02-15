import React from 'react'
import { useContext } from 'react'
import { ThemeContext } from './Contexts/ThemeContext'
import { Text, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { BlurView } from '@react-native-community/blur'

export default function Nav({title = 'moovish'}){
    const theme = useContext(ThemeContext)

    return(
        <LinearGradient colors={[theme.accent, 'rgba(0, 0, 0, 0)']} style={styles.container}>
            <Text style={styles.title}>
                {title}
            </Text>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container :{
        height: '15%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10
    },
    title: {
        top: -40,
        fontSize: 28,
        fontFamily: 'AtkinsonHyperlegible-Bold',
        color: 'white'
    },
})