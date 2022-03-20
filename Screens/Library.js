import axios from 'axios'
import React, { useEffect } from 'react'
import { useContext, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    NativeModules,
    Platform
} from 'react-native'
import { AuthContext } from '../Components/Contexts/AuthContext'

const { StatusBarManager } = NativeModules;
const statusBarHeight = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

import { ThemeContext } from '../Components/Contexts/ThemeContext'
import Modal from '../Components/Modal'
import MovieVerticalList from '../Components/MovieVerticalList'
import { useIsFocused } from '@react-navigation/native'

import DropShadow from 'react-native-drop-shadow'
import BottomPopUp from '../Components/BottomPopUp'

export default function Library() {
    const theme = useContext(ThemeContext)
    const contextAuth = useContext(AuthContext)

    const [toWatchMovies, setToWatchMovies] = useState([])
    const [watchedMovies, setWatchedMovies] = useState([])
    //0 is to watch list, 1 is watched
    const [currentScreen, setCurrentScreen] = useState(0)

    //pendingModal being active means a modal is currently open
    //and waiting for user action.
    //this state also gets the movie id to use as argument for the deleteMovie
    //function.
    //state is set by the MovieVerticalList component by passing setPendingModal
    //as props
    const [pendingModal, setPendingModal] = useState({ isActive: false })
    //same concept as pending modal
    const [pendingPopUpState, setPendingPopUpState] = useState({ isActive: false })

    //refetch when screen is focused. useful for when the user opens a movie,
    //removes it from library and then navigates back to this screen.
    //this makes it so changes made in other screens will be
    //taken into account when navigating back to this.
    const isFocused = useIsFocused()

    //separate movies into watched and to watch
    function parseMovies(data) {
        let toWatch = []
        let watched = []

        //push not watched movies to toWatch list
        data.forEach(item => {
            console.log(item.watched)
            if (item.watched) watched.push(item)
            else toWatch.push(item)
        })

        setToWatchMovies(toWatch.reverse())
        setWatchedMovies(watched.reverse())
    }

    async function fetchData() {
        axios.get('http://192.168.15.10:8080/profile/library',
            { headers: { 'auth-token': contextAuth.token } })
            .then(res => parseMovies(res.data))
            .catch(e => console.warn('error:', e))
    }

    function deleteMovie() {
        axios.delete(`http://192.168.15.10:8080/profile/library/${pendingModal.movieId}`,
            { headers: { 'auth-token': contextAuth.token } })
            .then(() => {
                console.log('deleting movie', pendingModal.movieId)
                fetchData()
                setPendingModal({ isActive: false })
                setPendingPopUpState({ isActive: true, text: 'Removed from library.' })
            })
            .catch(e => console.warn('error:', e))
    }

    function setWatched() {
        //change watched to true
        axios.patch
            (`http://192.168.15.10:8080/profile/library/`,
                { movie_id: pendingModal.movieId, watched: true },
                { headers: { 'auth-token': contextAuth.token } }
            ).then(() => {
                console.log('then')
                fetchData()
                setPendingModal({ isActive: false })
                setPendingPopUpState({ isActive: true, text: 'Moved to "Watched" list.' })
            })
            .catch(e => console.warn('error:', e))
    }

    useEffect(() => {
        fetchData()
    }, [isFocused])

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.background,
            width: '100%',
            height: '100%',
            position: 'absolute',
        },
        screenTitle: {
            fontSize: 30,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            width: '100%',
            paddingHorizontal: theme.defaultPadding,
            marginTop: statusBarHeight + 20,
        },
        navigation: {
            width: '100%',

            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'center','

            marginHorizontal: theme.defaultPadding,

            marginTop: 30,
            marginBottom: 20
        },
        navigationItem: {
            padding: 10,
            paddingHorizontal: 20,
            borderRadius: 30
        }
    })

    return (
        <View style={styles.container}>

            {pendingPopUpState.isActive ?
                <BottomPopUp
                    popUpState={pendingPopUpState}
                    setPopUpState={setPendingPopUpState}
                /> : null
            }

            {pendingModal.isActive ?
                <Modal
                    title={pendingModal.title}
                    text={pendingModal.text}
                    confirmAction={pendingModal.type === 'delete' ? deleteMovie : setWatched}
                    cancelAction={pendingModal.cancelAction}
                /> : null
            }

            <Text style={styles.screenTitle}>
                Library
            </Text>

            <View style={styles.navigation}>
                <DropShadow
                    style={{
                        shadowColor: theme.accent,
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: currentScreen === 0 ? 0.3 : 0,
                        shadowRadius: 20,
                    }}
                >
                    <View onTouchEnd={() => setCurrentScreen(0)}
                        style={{
                            ...styles.navigationItem,
                            marginRight: 15,
                            fontFamily: currentScreen === 0 ? theme.fontBold : theme.fontRegular,
                            backgroundColor: currentScreen === 0 ? theme.accent : 'transparent',
                            color: currentScreen === 0 ? theme.background : theme.foreground,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: theme.fontBold,
                                color: currentScreen === 0 ? theme.background : theme.foreground,
                            }}
                        >
                            To Watch
                        </Text>
                    </View>
                </DropShadow>
                <DropShadow
                    style={{
                        shadowColor: theme.accent,
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: currentScreen === 0 ? 0 : 0.3,
                        shadowRadius: 20,
                    }}
                >
                    <View onTouchEnd={() => setCurrentScreen(1)}
                        style={{
                            ...styles.navigationItem,
                            fontFamily: currentScreen === 1 ? theme.fontBold : theme.fontRegular,
                            backgroundColor: currentScreen === 1 ? theme.accent : 'transparent',
                        }}
                    >
                        <Text style={{
                            fontFamily: theme.fontBold,
                            color: currentScreen === 1 ? theme.background : theme.foreground,
                        }}>
                            Watched
                        </Text>
                    </View>
                </DropShadow>
            </View>

            <FlatList
                contentContainerStyle={{
                    paddingTop: 20, paddingBottom: 20
                }}
                style={{ zIndex: 0 }}

                data={currentScreen === 0 ? toWatchMovies : watchedMovies}
                renderItem={(item) => {
                    return (
                        <MovieVerticalList
                            movieId={item.item.movie_id}
                            key={item.item.item_id}
                            //pass pendingModal state to component
                            //so it can communicate with this through modal
                            setPendingModal={setPendingModal}
                            //let component know if it should behave as watched or to watch
                            isWatched={currentScreen === 1 ? true : false}
                        />
                    )
                }}
            >
            </FlatList>

        </View>
    )
}