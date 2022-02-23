import React from 'react'
import { useContext } from 'react'
import { ThemeContext } from './Contexts/ThemeContext'
import {
    Text,
    StyleSheet,
    View
} from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { default as MaterialIcons } from 'react-native-vector-icons/MaterialIcons'
import { default as MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons'

import { SafeAreaView } from 'react-native-safe-area-context'
import { PropsContext } from './Contexts/PropsContext'
import { AuthContext } from './Contexts/AuthContext'
import { themes } from './Contexts/ThemeContext'

export default function Nav({isOnSearch = false, title = 'moovish'}){
    const theme = useContext(ThemeContext)
    const contextAuth = useContext(AuthContext)
    const contextProps = useContext(PropsContext)
    const navigation = useNavigation()

    const styles = StyleSheet.create({
        container :{
            zIndex: 1,
            width: '100%',

            marginTop: 20,
            marginBottom: 10,
            position: 'absolute',

            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: theme.defaultPadding,
        },
        title: {
            fontSize: 30,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            textAlign: 'left'
        },
        navigation: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            overflow: 'hidden',
            zIndex: 1,
            paddingHorizontal: theme.defaultPadding,
            alignItems: 'center',
        },
        searchBar: {
            width: '70%',
            backgroundColor: theme.gray,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            borderRadius: theme.borderRadius,
            flexDirection: 'row'
        },
        searchBarText: {
            color: theme.foreground,
            fontFamily: theme.fontRegular
        }
    })

    return(
        <SafeAreaView style={styles.container}>
            <View
                onTouchEnd={() => {
                    console.log('sad')
                    contextProps.setCurrentTheme(contextProps.currentTheme.type === 'light' ?
                    themes.dark : themes.light
                    )
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}
            >
                <MaterialCommunityIcons
                name='movie-open'
                size={25}
                color={theme.foreground}
                style={{marginRight: 15}}
                />
                {/* <Text style={styles.title}>
                    {title}
                </Text> */}
            </View>
            <View
            onTouchEnd={() => navigation.navigate('search')}
            style={styles.searchBar}
            >
                <MaterialIcons
                name='search'
                size={15}
                color={theme.foreground}
                style={{marginRight: 15}}
                />
                <Text style={styles.searchBarText}>
                    My favorite movie is...
                </Text>
            </View>

            <MaterialCommunityIcons
            name='bookshelf'
            size={25}
            color={theme.foreground}
            onTouchEnd={() => contextAuth.isAuth ? navigation.push('library') : navigation.push('login')}
            />
        </SafeAreaView>
    )
}