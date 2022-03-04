import React, { useContext, useState } from "react";
import {
    View,
    StyleSheet,
    NativeModules,
    Platform
} from 'react-native'
import { useNavigation } from "@react-navigation/native";

const { StatusBarManager } = NativeModules;

const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBarManager.HEIGHT;

import BottomPopUp from "./BottomPopUp";

import { default as Feather } from 'react-native-vector-icons/Feather'
import { ThemeContext } from "./Contexts/ThemeContext";
import axios from "axios";
import { AuthContext } from "./Contexts/AuthContext";

export default function NavButtons({movieId, isInLibrary, setIsInLibrary}){
    const theme = useContext(ThemeContext)
    const contextAuth = useContext(AuthContext)

    const [pendingPopUp, setPendingPopUp] = useState({isActive: false})

    const navigation = useNavigation()

    function addToWatchLater(){
        axios.post
        (`http://192.168.15.10:8080/profile/library`, {
            movie_id: movieId,
            watched: false
        },
        {headers: {'auth-token': contextAuth.token}}
        )
        .then(r => {
            setIsInLibrary(true)
            setPendingPopUp({isActive: true, text: "Added to Library"})
        })
        .catch(e => alert(e))
    }

    function removeFromLibrary(){
        axios.delete(`http://192.168.15.10:8080/profile/library/${movieId}`,
        {headers: {'auth-token': contextAuth.token}})
        .then(() => {
            setIsInLibrary(false)
            setPendingPopUp({isActive: true, text: "Removed from Library"})
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
            marginTop: statusBarHeight+15,
            paddingHorizontal: theme.defaultPadding,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        icon: {
            width: 35,
            height: 35,
            textAlign: 'center',
            lineHeight: 35,
            borderRadius: 35,
            backgroundColor: theme.gray+'b3'
        },
    })

    return(
        <View style={styles.container}>
            {pendingPopUp.isActive ?
            <BottomPopUp
            popUpState={pendingPopUp}
            setPopUpState={setPendingPopUp}
            /> : null
            }
            <View style={styles.navigation}>
                <View onTouchEnd={() => navigation.goBack()}>
                    <Feather
                    style={styles.icon}
                    name="arrow-left"
                    size={20}
                    color={theme.foreground}
                    />
                </View>
                <View style={{flexDirection: 'row'}}>
                    {movieId ?
                        <View>
                        <Feather
                        style={{...styles.icon, marginRight: 15}}
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
                    <View>
                        <Feather
                        style={styles.icon}
                        name="share"
                        size={20}
                        color={theme.foreground}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}