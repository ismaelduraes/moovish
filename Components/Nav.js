import React from 'react'
import { useContext } from 'react'
import { ThemeContext } from './Contexts/ThemeContext'
import { Text, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { default as Ionicons } from 'react-native-vector-icons/Ionicons'
import { Link } from 'react-router-native'

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
            color: theme.accentLight,
        },
        navigation: {
            flexDirection: 'row',
            paddingTop: 5,
            justifyContent: 'space-between',
            height: 90,
            overflow: 'hidden',
            zIndex: 1,
            paddingHorizontal: theme.defaultPadding,
        },
    })

    return(
        <View style={styles.container} pointerEvents='box-none'>
            <LinearGradient
                style={styles.navigation}
                colors={[
                    theme.accent,
                    theme.accent+'B3',
                    'rgba(0, 0, 0, 0)',
                ]}
            >

                <View/>

                <Text style={styles.title}>
                    {title}
                </Text>
                
                <View>
                    {
                        !isOnSearch ?
                        <Link to={{pathname: "/search", push: true}}>
                            <Ionicons
                            name="ios-search-outline"
                            size={30}
                            color={theme.accentLight}
                            />
                        </Link>
                        :
                        <Link to="/">
                            <Ionicons
                            name="close-outline"
                            size={30}
                            color={theme.accentLight}
                            />
                        </Link>
                    }
                </View>
            </LinearGradient>
        </View>
    )
}