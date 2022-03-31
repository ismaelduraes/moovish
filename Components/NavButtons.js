import React, { useContext, useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    NativeModules,
    Platform,
    ActivityIndicator,
    Share
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

export default function NavButtons({ movieId, showId, movieRuntime, profileId }) {
    const theme = useContext(ThemeContext)
    const contextAuth = useContext(AuthContext)

    const [isInLibrary, setIsInLibrary] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [pendingPopUp, setPendingPopUp] = useState({ isActive: false })

    const navigation = useNavigation()

    function checkLibrary() {
        //check if movie is in library to set appropriate initial state
        axios.get(`${contextAuth.moovishServer}/profile/library`,
            { headers: { 'auth-token': contextAuth.token } })
            //if success
            .then(r => {
                //check if any of the movies in library match current movieId
                r.data.forEach(item => {
                    if (item.movie_id === movieId) {
                        setIsInLibrary(true);
                    }
                });
                setIsLoading(false)
            })
            //if fail
            .catch(() => {
                setIsInLibrary(false);
            });
    }

    useEffect(() => {
        if (movieId) checkLibrary()
    }, [])

    function addToWatchLater() {
        setIsLoading(true)
        axios.post
            (`${contextAuth.moovishServer}/profile/library`, {
                movie_id: movieId,
                watched: false,
                runtime: movieRuntime,
            },
                { headers: { 'auth-token': contextAuth.token } }
            )
            .then(r => {
                setIsInLibrary(true)
                setPendingPopUp({ isActive: true, text: "Added to Library" })
                setIsLoading(false)
            })
            .catch(e => {
                setIsLoading(false)
            })
    }

    function removeFromLibrary() {
        setIsLoading(true)
        axios.delete(`${contextAuth.moovishServer}/profile/library/${movieId}`,
            { headers: { 'auth-token': contextAuth.token } })
            .then(() => {
                setIsInLibrary(false)
                setPendingPopUp({ isActive: true, text: "Removed from Library" })
                setIsLoading(false)
            })
            .catch(e => {
                console.warn('error:', e)
                setPendingPopUp({ isActive: true, text: "Something went wrong while removing item from library" })
                setIsLoading(false)
            })
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
            backgroundColor: theme.foreground + '88',
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
                        color={theme.background}
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    {/* movieId being undefined means user is probably in actor screen*/}
                    {/* so add to library icon doesnt need to be shown */}
                    {movieId ?
                        <View style={{ ...styles.iconBg, marginRight: 15 }}>
                            {!isLoading ?
                                <Feather
                                    style={{ ...styles.icon }}
                                    name={!isInLibrary ? 'plus' : 'minus'}
                                    size={20}
                                    color={theme.background}
                                    onTouchEnd={
                                        contextAuth.isAuth ?
                                            () => !isInLibrary ? addToWatchLater() : removeFromLibrary()
                                            :
                                            () => navigation.push('login')
                                    }
                                /> : null}
                            {isLoading ?
                                <ActivityIndicator
                                    color={theme.background}
                                    style={{ alignSelf: 'center' }}
                                /> : null
                            }
                        </View> : null
                    }
                    <View style={styles.iconBg}>
                        <Feather
                            style={styles.icon}
                            name="share"
                            size={20}
                            color={theme.background}
                            onTouchEnd={() => Share.share({ message: movieId ? `https://tmdb.org/movie/${movieId}` : `https://tmdb.org/person/${profileId}` })}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}