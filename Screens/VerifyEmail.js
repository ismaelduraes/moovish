import axios from "axios";
import React, { useState, useRef, useContext } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet
} from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import { default as MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons'

import { ThemeContext } from "../Components/Contexts/ThemeContext";
import Modal from "../Components/Modal";
import Loading from "../Components/Loading";

import Recaptcha from "react-native-recaptcha-that-works";
import { RECAPTCHA_CLIENT_KEY } from '@env'

import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../Components/Contexts/AuthContext";

export default function VerifyEmail({ route }) {
    const theme = useContext(ThemeContext)
    const contextAuth = useContext(AuthContext)
    const navigation = useNavigation()

    const recaptcha = useRef()

    const [code, setCode] = useState('')
    const [token, setToken] = useState("")

    const [isLoading, setIsLoading] = useState(false)

    const [pendingModal, setPendingModal] = useState({ isActive: false, })

    const { email } = route.params

    function verify() {
        setIsLoading(true)
        axios.post(`${contextAuth.moovishServer}/profile/verify`, { email, code })
            .then(r => {
                setPendingModal({
                    isActive: true,
                    title: "Verification complete!",
                    text: "You will now be prompted to sign in.",
                    confirmAction: () => navigation.navigate("login"),
                    hasCancelButton: false,
                    confirmText: "Sign in"
                })
                setIsLoading(false)
            })
            .catch(e => {
                setPendingModal({
                    isActive: true,
                    title: "Couldn't verify",
                    text: e.response.data === "expired" ? "This code has expired" : "Please make sure the code you entered is correct.",
                    confirmAction: () => e.response.data === "expired" ? recaptcha.current.open() : setPendingModal({ isActive: false }),
                    hasCancelButton: e.response.data === "expired" ? true : false,
                    cancelAction: () => setPendingModal({ isActive: false }),
                    confirmText: e.response.data === "expired" ? "Resend code" : "Try again"
                })
                setIsLoading(false)
            })
    }

    function resendVerify(token) {
        setIsLoading(true)
        axios.post(`${contextAuth.moovishServer}/profile/verify/resend`, { email, captcha: token })
            .then(() => {
                setPendingModal({
                    isActive: true,
                    title: "E-mail sent",
                    text: "Please check your e-mail account.",
                    confirmAction: () => setPendingModal({ isActive: false }),
                    hasCancelButton: false,
                })
                setIsLoading(false)
            })
            .catch(e => {
                setPendingModal({
                    isActive: true,
                    title: "Something went wrong.",
                    text: "Please try again.",
                    confirmAction: () => setPendingModal({ isActive: false }),
                    hasCancelButton: false,
                })
                setIsLoading(false)
            })
    }

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.background,
            width: '100%',
            height: '100%',
            // justifyContent: 'center'
        },
        closeButtonContainer: {
            // height: '10%',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            paddingHorizontal: theme.defaultPadding,
            marginBottom: '20%'
        },
        bigText: {
            color: theme.accent,
            fontFamily: theme.fontBold,
            fontSize: 30,
            textAlign: 'center',
            marginBottom: 15,
            padding: theme.defaultPadding,
        },
        text: {
            color: theme.foreground,
            fontFamily: theme.fontRegular,
            textAlign: 'center',
            paddingHorizontal: theme.defaultPadding,
        },
        input: {
            fontFamily: theme.fontRegular,

            width: '100%',
            alignSelf: 'center',

            color: theme.foreground,

            paddingHorizontal: '5%',
            paddingVertical: 10,

            backgroundColor: theme.gray,
            borderRadius: theme.borderRadius,
        },
        emailIcon: {
            alignSelf: 'center',
            marginTop: '20%'
        },
        button: {
            backgroundColor: theme.accent,
            padding: 15,
            borderRadius: theme.borderRadius,
            marginTop: 15,
            marginHorizontal: theme.defaultPadding,
        }
    })

    if (isLoading) return <Loading />

    else return (
        <SafeAreaView style={styles.container}>
            <View style={styles.closeButtonContainer}>
                <Pressable style={styles.closeButton}>
                    <MaterialCommunityIcons
                        name="arrow-left"
                        color={theme.foreground}
                        size={20}
                        onPress={() => navigation.navigate("home")}
                    />
                </Pressable>
            </View>
            {pendingModal.isActive ?
                <Modal
                    title={pendingModal.title}
                    text={pendingModal.text}
                    hasCancelButton={pendingModal.hasCancelButton}
                    confirmAction={pendingModal.confirmAction}
                    cancelAction={pendingModal.cancelAction}
                    confirmText={pendingModal.confirmText}
                /> : null}
            <Text style={styles.bigText}>
                We're almost there.
            </Text>
            <Text style={styles.text}>
                {"Just a second! Your account isn't verified yet.\nPlease enter the verification code you've received via e-mail."}
            </Text>

            <MaterialCommunityIcons
                name="email"
                size={60}
                color={theme.accent}
                style={styles.emailIcon}
            />

            <View style={{ marginTop: '10%', paddingHorizontal: theme.defaultPadding }}>
                <Text style={{ ...styles.text, textAlign: 'left', marginBottom: 5 }}>
                    Verification code
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Your code, e.g 123456"
                    onChangeText={text => setCode(text)}
                    keyboardType="number-pad"
                    maxLength={6}
                />
            </View>

            <Pressable style={styles.button}
                onPress={() => verify()}
            >
                <Text style={{ ...styles.text, color: theme.background }}>
                    Enter
                </Text>
            </Pressable>

            <Pressable
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '20%'
                }}
                onPress={() => {
                    setPendingModal({
                        isActive: true,
                        title: "Resend e-mail?",
                        text: "Another verification code will be sent to your e-mail.\n\nCodes expire in 10 minutes.",
                        cancelAction: () => setPendingModal({ isActive: false }),
                        confirmAction: () => recaptcha.current.open(),
                        confirmText: "Resend e-mail"
                    })
                }}
            >
                <Text style={{ ...styles.text, color: theme.accent, fontFamily: theme.fontBold }}>
                    Resend e-mail
                </Text>
                <MaterialCommunityIcons
                    name="arrow-right"
                    size={16}
                    color={theme.accent}
                />
            </Pressable>

            <Recaptcha
                siteKey={contextAuth.captchaKey}
                baseUrl={`http://localhost:8080`}
                onVerify={token => {
                    setToken(token)
                    resendVerify(token)
                }}
                size="normal"
                ref={recaptcha}
                onError={() => console.log('error')}
            />
        </SafeAreaView >
    )
}