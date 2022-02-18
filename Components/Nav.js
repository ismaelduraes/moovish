import React from 'react'
import { useContext } from 'react'
import { ThemeContext } from './Contexts/ThemeContext'
import { Text, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

export default function Nav({isOnSearch = false, title = 'moovish'}){
    const theme = useContext(ThemeContext)

    const styles = StyleSheet.create({
        container :{
            zIndex: 10,
            position: 'absolute',
            height: '100%',
            width: '100%',
        },
        title: {
            fontSize: 32,
            fontFamily: theme.fontBold,
            color: theme.foreground,
        },
        navigation: {
            flexDirection: 'row',
            justifyContent: 'center',
            height: 130,
            overflow: 'hidden',
            zIndex: 1,
            paddingHorizontal: theme.defaultPadding,
            alignItems: 'center'
        },
    })

    return(
        <View style={styles.container} pointerEvents='box-none'>
            <LinearGradient
                style={styles.navigation}
                colors={[
                    theme.accentAlt,
                    theme.accentAlt+'B3',
                    'rgba(0, 0, 0, 0)',
                ]}
            >

                <Text style={styles.title}>
                    {title}
                </Text>
            </LinearGradient>
        </View>
    )
}