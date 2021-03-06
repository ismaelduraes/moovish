import React from "react";
import {
    useContext,
    useState,
    useEffect
} from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable
} from 'react-native'

import FastImage from "react-native-fast-image";
import { useNavigation } from "@react-navigation/native";

import { default as Ionicons } from 'react-native-vector-icons/Ionicons'
import { default as MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons'

import { ThemeContext } from "./Contexts/ThemeContext";
import { imgPrefixLow } from "./Utilities/Utilities";
import { TMDB_API_KEY } from '@env'

import axios from "axios";

export default function MovieVerticalList({ movieId, setPendingModal, isWatched }) {
    const [movieData, setMovieData] = useState({})

    const navigation = useNavigation()
    const theme = useContext(ThemeContext)

    async function getMovies() {
        await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`)
            .then(r => setMovieData(r.data))
    }

    useEffect(() => {
        getMovies()
    }, [])

    const styles = StyleSheet.create({
        container: {
            width: '100%',
            flexDirection: 'row',
            alignSelf: 'center',

            backgroundColor: theme.background,
            marginBottom: 5,
        },
        image: {
            width: '40%',
            height: '100%',
        },
        movieContainer: {
            minHeight: 140,
            flexDirection: 'row',
            justifyContent: 'center',
            marginHorizontal: theme.defaultPadding,
            backgroundColor: theme.gray,
            borderWidth: 2,
            borderColor: theme.gray,
            borderRadius: theme.borderRadius,
            overflow: 'hidden',
        },
        movieTitleContainer: {
            fontFamily: theme.fontBold,
            fontSize: 18,
            width: '45%',
            textAlignVertical: 'center',
            paddingVertical: 15,
            color: theme.foreground,
            alignSelf: 'center',
        },
        movieTitle: {
            fontFamily: theme.fontBold,
            fontSize: 18,
            textAlignVertical: 'center',
            color: theme.foreground,
            paddingHorizontal: 25
        },
        movieTagline: {
            fontFamily: theme.fontBold,
            fontSize: 14,
            textAlignVertical: 'center',
            color: theme.foreground,
            paddingHorizontal: 25,
            opacity: 0.6
        },
        buttons: {
            width: '15%',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            backgroundColor: theme.gray,
            borderTopRightRadius: theme.borderRadius,
            borderBottomRightRadius: theme.borderRadius,
        },
        button: {
            borderRadius: 50,
            padding: 10,
            backgroundColor: theme.background,
        }
    })

    return movieData ? (
        <View style={styles.container} removeClippedSubviews>

            <Pressable
                style={styles.movieContainer}
                onPress={() => navigation.push('movie', { movieId })}
            >
                <FastImage
                    source={{ uri: `${imgPrefixLow}${movieData.backdrop_path ? movieData.backdrop_path : movieData.poster_path}` }}
                    resizeMode={FastImage.resizeMode.cover}
                    style={styles.image}
                />
                <View
                    style={styles.movieTitleContainer}
                >
                    <Text style={styles.movieTitle}>
                        {movieData.title}
                    </Text>
                    <Text style={styles.movieTagline}>
                        {movieData.tagline}
                    </Text>
                </View>
                <View style={styles.buttons}>
                    {
                        !isWatched ?
                            <Pressable
                                onPress={() => setPendingModal({
                                    isActive: true,
                                    title: "Set as watched",
                                    text: `Do you want to set ${movieData.title} as watched?`,
                                    type: 'set_watched',
                                    movieId: movieId,
                                    cancelAction: () => setPendingModal({ isActive: false })
                                })}
                                style={styles.button}
                            >
                                <Ionicons
                                    name={'checkmark'}
                                    size={20}
                                    color={theme.accent}
                                />
                            </Pressable>
                            : null
                    }
                    <Pressable
                        onPress={() => setPendingModal({
                            isActive: true,
                            title: "Confirm deletion",
                            text: `You are about to remove ${movieData.title} from this list. Are you sure you want to proceed?`,
                            type: 'delete',
                            movieId: movieId,
                            cancelAction: () => setPendingModal({ isActive: false })
                        })}
                        style={styles.button}
                    >
                        <MaterialCommunityIcons
                            name={'minus'}
                            size={20}
                            color={theme.foreground + '80'}

                        />
                    </Pressable>
                </View>
            </Pressable>
        </View>
    ) : null
}