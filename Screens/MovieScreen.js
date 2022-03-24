import React from "react";
import { useState, useLayoutEffect, useEffect, useContext } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    Dimensions
} from "react-native";
import { ThemeContext } from "../Components/Contexts/ThemeContext";

import { TMDB_API_KEY } from '@env'
import { YT_API_KEY } from '@env'

import { sortCast, sortCrew } from "../Components/Utilities/CreditsSort";

import Header from "../Components/Header";
import TextBody from "../Components/TextBody";
import HorizontalProfileList from "../Components/HorizontalProfileList";
import ImageCarousel from "../Components/ImageCarousel";
import AndroidStatusBarGradient from '../Components/AndroidStatusBarGradient'
import NavButtons from "../Components/NavButtons";
import Loading from "../Components/Loading";

import { imgPrefix, imgPrefixLow, imgPrefixOriginal } from "../Components/Utilities/Utilities";
import { AuthContext } from "../Components/Contexts/AuthContext";

import axios from "axios";
import { SvgUri } from "react-native-svg";
import FastImage from "react-native-fast-image";

const width = Dimensions.get('window').width
const height = Dimensions.get('screen').height

export default function MovieScreen({ route }) {
    const [movieData, setMovieData] = useState({})
    const [productionCompany, setProductionCompanies] = useState('Unknown Production Company')
    const [movieImages, setMovieImages] = useState([])
    const [movieVideo, setMovieVideo] = useState([])

    const [cast, setCast] = useState({})
    const [crew, setCrew] = useState({})
    const [isInLibrary, setIsInLibrary] = useState(false)

    const [isLoading, setIsLoading] = useState(true)

    const theme = useContext(ThemeContext)
    const contextAuth = useContext(AuthContext)

    const { movieId } = route.params

    useEffect(() => {
        // fetchData()
        fetchAllData()

        return (() => {
            setMovieData({})
            setProductionCompanies('')
            setCast({})
            setCrew({})
        })
    }, [isInLibrary])

    useEffect(() => {
        //remove first image as it's already
        //used by the header (avoids redundancy in images)
        movieImages.shift()
    }, [movieImages])

    async function fetchAllData() {

        await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=images,videos,credits`)
            .then(d => {
                //insert data into their own state
                setMovieData(d.data)
                setMovieImages(d.data.images.backdrops)
                setMovieVideo(d.data.videos[0])
                sortCast(d.data.credits.cast, setCast)
                sortCrew(d.data.credits.crew, setCrew)
                setProductionCompanies(d.data.production_companies[0])

                axios.get('http://192.168.15.10:8080/profile/library',
                    { headers: { 'auth-token': contextAuth.token } }
                ).then(r => {
                    //check if any of the movies in library match current movieId
                    r.data.forEach(item => {
                        if (item.movie_id === movieId) {
                            setIsInLibrary(true)
                        }
                    })
                }).catch(() => setIsInLibrary(false))

                setIsLoading(false)
            })
    }


    async function fetchData() {
        //fetch movie data
        await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`)
            .then(d => {
                setMovieData(d.data)
                setProductionCompanies(d.data.production_companies[0])
                console.log(`${imgPrefixOriginal}${productionCompany.logo_path}`)
            })

        //fetch movie images
        await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${TMDB_API_KEY}`)
            .then(d => setMovieImages(d.data.backdrops))

        //fetch videos
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`)
            .then(d => setMovieVideo(d.data.results[0]))

        //fetch credits
        await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`)
            .then(d => {
                sortCast(d.data.cast, setCast)
                sortCrew(d.data.crew, setCrew)
            })

        await axios.get('http://192.168.15.10:8080/profile/library',
            { headers: { 'auth-token': contextAuth.token } }
        ).then(r => {
            //check if any of the movies in library match current movieId
            r.data.forEach(item => {
                if (item.movie_id === movieId) {
                    setIsInLibrary(true)
                }
            })
        }).catch(() => setIsInLibrary(false))
        setIsLoading(false)
    }

    function ratingColor(rating) {
        //return appropriate color for rating text
        //(red if low rating, yellow if average, green if good)
        if (rating < 5) return 'red'
        else if (rating < 7) return '#d94f00'
        else return 'green'
    }

    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            height,
            width,
            backgroundColor: theme.background,
        },
        smallText: {
            color: theme.foreground,
            maxWidth: 150,
            textAlign: 'center',
            paddingHorizontal: '3%',
            // backgroundColor: 'red'
        },
        rating: {
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: theme.defaultPadding,
            justifyContent: 'center',
            backgroundColor: theme.gray,
            borderRadius: 20,
            overflow: 'hidden',
            paddingVertical: 15,
        },
        ratingAverage: {
            fontFamily: theme.fontBold,
            color: ratingColor(movieData.vote_average),
            maxWidth: 120,
            textAlign: 'center',
            paddingHorizontal: '3%',
            // backgroundColor: 'red'
        },
        text: {
            color: theme.foreground,
            maxWidth: '100%',
            textAlign: 'center',
            paddingHorizontal: '3%',
        },
        companies: {
            textAlign: 'center',
            color: theme.accent
        },
        sectionTitle: {
            fontSize: 18,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            marginBottom: 10,
            paddingHorizontal: theme.defaultPadding
        },
        video: {
            height: 180,
            width: width - (theme.defaultPadding * 2),
            borderRadius: theme.borderRadius,
            backgroundColor: theme.background,
            alignSelf: 'center',
            overflow: 'hidden',
        },
        imageBg: {
            height: '100%',
            width: '100%',
            position: 'absolute',
            zIndex: -1,
            //dark theme has less opacity on blurred image
            //to keep theme darker
            opacity: theme.type === 'light' ? 0 : 0.07
        }
    })

    if (isLoading) return <Loading />

    else return (
        <View style={styles.container}>
            {/* <Nav/> */}
            <AndroidStatusBarGradient />
            <NavButtons
                movieId={movieId}
                isInLibrary={isInLibrary}
                setIsInLibrary={setIsInLibrary}
            />

            {/* background image */}
            {/* <Image
                style={styles.imageBg}
                source={movieData.backdrop_path ?
                    { uri: `${imgPrefixOriginal}${movieData.backdrop_path}` } :
                    require('../assets/images/profile_default.png')}
                blurRadius={50}
                progressiveRenderingEnabled
            /> */}
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>



                {/* Poster */}
                <Header
                    imagePath={movieData.backdrop_path}
                    fallbackImagePath={movieData.poster_path}
                    title={movieData.title}
                    subtitle={movieData.tagline}
                />

                {/* Ratings */}
                <View style={{ ...styles.rating }}>
                    {productionCompany.logo_path ?
                        <FastImage
                            source={{ uri: `${imgPrefixOriginal}${productionCompany.logo_path}` }}
                            style={{ width: 90, height: 20, marginHorizontal: 10 }}
                            resizeMode="contain"
                            tintColor={theme.foreground}
                        /> :
                        <Text style={styles.smallText}>
                            {productionCompany ? productionCompany.name :
                                'Unknown Production Company'
                            }
                        </Text>
                    }
                    <View>
                        <Text style={styles.ratingAverage}>
                            {movieData.vote_average ?
                                movieData.vote_average :
                                'This movie has no ratings yet'
                            }

                        </Text>
                        {movieData.vote_average !== 0 ?
                            <Text style={styles.smallText}>
                                Rating
                            </Text> : null
                        }
                    </View>


                    {movieData.runtime > 0 ?
                        <Text style={styles.smallText}>
                            {movieData.runtime} min
                        </Text> : null
                    }
                </View>

                {/* Overview */}
                {movieData.overview ?
                    <TextBody title="Overview" text={movieData.overview} /> : null
                }

                {/* Images carousel */}
                {movieImages.length > 0 ?
                    <ImageCarousel showsIcon={false} data={movieImages} /> : null
                }

                {/* Cast */}
                {cast.acting ?
                    <HorizontalProfileList
                        data={cast.acting}
                        title="Cast"
                    /> : null
                }

                {/* Video */}
                {/* {movieVideo ?
                    <View style={{
                        ...styles.section,
                        marginTop: '10%',
                    }}>

                        <Text style={styles.sectionTitle}>
                            Featured Video
                        </Text>
                        <YouTube
                            apiKey={YT_API_KEY}
                            videoId={movieVideo.key}
                            style={styles.video}
                        />

                    </View> : null
                } */}
            </ScrollView>
        </View>
    )
}