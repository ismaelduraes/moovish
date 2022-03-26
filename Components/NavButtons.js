import React, { useContext, useState } from "react";
import {
    View,
    StyleSheet,
    NativeModules,
    Platform,
} from 'react-native'
import { useNavigation } from "@react-navigation/native";

const { StatusBarManager } = NativeModules;

const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBarManager.HEIGHT;

import BottomPopUp from "./BottomPopUp";

import { default as Feather } from 'react-native-vector-icons/Feather'
import { ThemeContext } from "./Contexts/ThemeContext";
import axios from "axios";
import { AuthContext } from "./Contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NavButtons({ movieId, movieRuntime, isInLibrary, setIsInLibrary }) {
    const theme = useContext(ThemeContext)
    const contextAuth = useContext(AuthContext)

    const [pendingPopUp, setPendingPopUp] = useState({ isActive: false })

    const navigation = useNavigation()

    function addToWatchLater() {
        axios.post
            (`http://192.168.15.10:8080/profile/library`, {
                movie_id: movieId,
                watched: false,
                runtime: movieRuntime,
            },
                { headers: { 'auth-token': contextAuth.token } }
            )
            .then(r => {
                setIsInLibrary(true)
                setPendingPopUp({ isActive: true, text: "Added to Library" })
            })
            .catch(e => alert(e))
    }

    function removeFromLibrary() {
        axios.delete(`http://192.168.15.10:8080/profile/library/${movieId}`,
            { headers: { 'auth-token': contextAuth.token } })
            .then(() => {
                setIsInLibrary(false)
                setPendingPopUp({ isActive: true, text: "Removed from Library" })
            })
            .catch(e => console.warn('error:', e))
    }

    const styles = StyleSheet.create({
        container: {
            height: 90,
            width: '100%',
            position: 'absolute',
            zIndex: 1
        },
        navigation: {
            //adds the height of status bar, adds nothing on ios
            marginTop: statusBarHeight,
            paddingHorizontal: theme.defaultPadding,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        iconBg: {
            width: 35,
            height: 35,
            backgroundColor: theme.gray + '4c',
            borderRadius: 35,
            justifyContent: 'center',
            alignItems: 'center'
        },
    })

    return (
        <SafeAreaView style={styles.container}>
            {pendingPopUp.isActive ?
                <BottomPopUp
                    popUpState={pendingPopUp}
                    setPopUpState={setPendingPopUp}
                /> : null
            }
            <View style={styles.navigation}>
                <View style={styles.iconBg} onTouchEnd={() => navigation.goBack()}>
                    <Feather
                        style={styles.icon}
                        name="arrow-left"
                        size={20}
                        color={theme.foreground}
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    {/* movieId being undefined means user is probably in actor screen*/}
                    {/* so add to library icon doesnt need to be shown */}
                    {movieId ?
                        <View style={{ ...styles.iconBg, marginRight: 15 }}>
                            <Feather
                                style={{ ...styles.icon }}
                                name={!isInLibrary ? 'plus' : 'minus'}
                                size={20}
                                color={theme.foreground}
                                onTouchEnd={
                                    contextAuth.isAuth ?
                                        () => !isInLibrary ? addToWatchLater() : removeFromLibrary()
                                        :
                                        () => navigation.push('login')
                                }
                            />
                        </View> : null
                    }
                    <View style={styles.iconBg}>
                        <Feather
                            style={styles.icon}
                            name="share"
                            size={20}
                            color={theme.foreground}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}