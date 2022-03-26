import axios from 'axios'
import React from 'react'
import { useContext, useState } from 'react'
import {
    View,
    Image,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Pressable
} from 'react-native'
import RNSecureKeyStore, { ACCESSIBLE } from "react-native-secure-key-store";

import { SafeAreaView } from 'react-native-safe-area-context'
import { default as MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons'

import { ThemeContext } from '../Components/Contexts/ThemeContext'
import { AuthContext } from '../Components/Contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

import Modal from '../Components/Modal';

export default function LoginScreen() {
    const theme = useContext(ThemeContext)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    //sign up
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    //this is the email input used for signing up. for signing in, the username var
    //is used.
    const [email, setEmail] = useState('')

    const [hasAccount, setHasAccount] = useState(true)

    const [pendingModal, setPendingModal] = useState({ isActive: false })

    const navigation = useNavigation()

    const contextAuth = useContext(AuthContext)

    async function login() {
        if (username.length < 6 && password.length < 8) {
            setPendingModal({ isActive: true, title: "Couldn't sign you in.", text: "Make sure your username is over 6 characters long, and your password is over 8 characters long." })
            return
        }
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
            //handle errors
            .catch(err => {
                switch (err.response.status) {
                    case 401:
                        setPendingModal({ isActive: true, title: "Couldn't sign you in.", text: "Incorrect username or password." })
                        break
                    default:
                        setPendingModal({ isActive: true, title: "Couldn't sign you in.", text: "Something went wrong and you couldn't be signed in." })
                        break
                }
            }
            )
    }

    async function signup() {
        function validateEmail(email) {
            return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        }

        if (username.length < 6 && password.length < 8) {
            setPendingModal({ isActive: true, title: "Couldn't sign you up.", text: "Make sure your username is over 6 characters long, and your password is over 8 characters long." })
            return
        }
        if (password !== passwordConfirmation) {
            setPendingModal({ isActive: true, title: "Couldn't sign you up.", text: "Your password and password confirmation don't match" })
            return
        }

        if (!validateEmail(email)) {
            setPendingModal({ isActive: true, title: "Couldn't sign you up.", text: "You need to input a valid e-mail address." })
            return
        }
        axios.post('http://192.168.15.10:8080/profile',
            { email, username, password })
            .then(res => {
                console.log(res.data)
            })
            //handle errors
            .catch(err => {
                switch (err.response.status) {
                    case 401:
                        setPendingModal({ isActive: true, title: "Couldn't sign you in.", text: "Incorrect username or password." })
                        break
                    default:
                        setPendingModal({ isActive: true, title: "Couldn't sign you in.", text: "Something went wrong and you couldn't be signed in." })
                        break
                }
            }
            )
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
            <ScrollView contentContainerStyle={styles.container} pointerEvents="box-none">
                {pendingModal.isActive ? <Modal
                    title={pendingModal.title}
                    text={pendingModal.text}
                    hasCancelButton={false}
                    confirmAction={() => setPendingModal({ isActive: false })}
                /> : null}

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
                        {hasAccount ? 'E-mail/username' : 'E-mail'}
                    </Text>
                    <TextInput
                        placeholder={hasAccount ? 'Your moovish username or e-mail' : 'Your e-mail address'}
                        style={styles.input}
                        placeholderTextColor={theme.foreground + '4c'}
                        onChangeText={text => hasAccount ? setUsername(text) : setEmail(text)}
                    />
                </View>

                {!hasAccount ? <View style={styles.inputContainer}>
                    <Text style={styles.label}>
                        Username
                    </Text>
                    <TextInput
                        placeholder='Your new moovish username'
                        style={styles.input}
                        placeholderTextColor={theme.foreground + '4c'}
                        onChangeText={text => setUsername(text)}
                    />
                </View> : null
                }

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>
                        Password
                    </Text>
                    <TextInput
                        placeholder='Your password'
                        style={styles.input}
                        placeholderTextColor={theme.foreground + '4c'}
                        onChangeText={text => setPassword(text)}
                        textContentType={"password"}
                        secureTextEntry={true}
                    />
                </View>

                {!hasAccount ? <View style={styles.inputContainer}>
                    <Text style={styles.label}>
                        Confirm Password
                    </Text>
                    <TextInput
                        placeholder='Your password'
                        style={styles.input}
                        placeholderTextColor={theme.foreground + '4c'}
                        onChangeText={text => setPasswordConfirmation(text)}
                        textContentType={"password"}
                        secureTextEntry={true}
                    />
                </View> : null
                }

                <Pressable
                    style={styles.signIn}
                    onPress={() => {
                        hasAccount ? login() : signup()
                    }}
                >
                    <Text style={styles.signInText}>
                        {hasAccount ? 'Sign in' : 'Sign Up'}
                    </Text>
                </Pressable>

                <Pressable style={{
                    flexDirection: hasAccount ? 'row-reverse' : 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: 60,
                }}
                    onPress={() => console.log(setHasAccount(!hasAccount))}
                >
                    <MaterialCommunityIcons
                        name={hasAccount ? "arrow-right" : "arrow-left"}
                        color={theme.accent}
                    />
                    <Text style={{
                        color: theme.accent,
                        fontFamily: theme.fontBold
                    }}
                    >
                        {hasAccount ? "Don't have an account?" : "I already have an account"}
                    </Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    )
}