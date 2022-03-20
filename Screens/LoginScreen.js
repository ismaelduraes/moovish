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
import RNSecureKeyStore, { ACCESSIBLE } from "react-native-secure-key-store";

import { SafeAreaView } from 'react-native-safe-area-context'
import { default as MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons'

import { ThemeContext } from '../Components/Contexts/ThemeContext'
import { AuthContext } from '../Components/Contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
    const theme = useContext(ThemeContext)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()

    const contextAuth = useContext(AuthContext)

    async function postData() {
        axios.post('http://192.168.15.10:8080/login',
            { username, password })
            .then(res => {
                RNSecureKeyStore.set('auth_token', res.data, { accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK })
                    .then(() => {
                        contextAuth.setToken(res.data)
                        contextAuth.setIsAuth(true)
                        navigation.navigate('home')
                    })
            })
            .catch(err => alert('Something went wrong. Please check your credentials\n' + err))
    }


    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.background,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',

            height: '100%',
        },
        title: {
            fontFamily: theme.fontBold,
            fontSize: 30,
            textAlign: 'center',
            marginTop: 25,
            paddingHorizontal: '7%',
            color: theme.foreground,
            marginBottom: 50
        },
        inputContainer: {
            width: '100%',
            marginBottom: 25
        },
        input: {
            fontFamily: theme.fontRegular,

            width: '90%',
            alignSelf: 'center',

            color: theme.foreground,

            paddingHorizontal: '5%',
            paddingVertical: 10,

            backgroundColor: theme.gray,
            borderRadius: theme.borderRadius
        },
        label: {
            fontFamily: theme.fontRegular,

            width: '90%',
            alignSelf: 'center',

            paddingHorizontal: '5%',
            marginBottom: 5,

            color: theme.foreground
        },
        signIn: {
            backgroundColor: theme.accent,
            padding: '3%',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 100
        },
        signInText: {
            color: theme.background,
            fontFamily: theme.fontBold,
            paddingHorizontal: '5%'
        }
    })

    return (
        <SafeAreaView style={styles.container}>

            <MaterialCommunityIcons
                name="movie-open"
                size={90}
                color={theme.accent}
            />
            <Text style={styles.title}>
                Your favorite movies, one button away.
            </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>
                    E-mail/username
                </Text>
                <TextInput
                    placeholder='Your moovish username'
                    style={styles.input}
                    placeholderTextColor={theme.foreground}
                    onChangeText={text => setUsername(text)}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>
                    Password
                </Text>
                <TextInput
                    placeholder='Your password'
                    style={styles.input}
                    placeholderTextColor={theme.foreground}
                    onChangeText={text => setPassword(text)}
                    textContentType="password"
                />
            </View>

            <View
                style={styles.signIn}
                onTouchEnd={() => {
                    postData()
                }}
            >
                <Text style={styles.signInText}>
                    Sign in
                </Text>
            </View>

            <Text style={{
                alignSelf: 'center',
                marginTop: 60,
                color: theme.accent
            }}
            >
                Don't have an account?
            </Text>

        </SafeAreaView>
    )
}