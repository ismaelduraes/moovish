import React from "react";
import { useState, useMemo, useEffect, useContext } from "react";
import {
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
    Dimensions,
    Image
} from "react-native";
import { ThemeContext } from "../Components/Contexts/ThemeContext";

import { TMDB_API_KEY } from '@env'

import { sortCast, sortCrew } from "../Components/Utilities/CreditsSort";

import Header from "../Components/Header";
import HorizontalProfileList from "../Components/HorizontalProfileList";
import ImageCarousel from "../Components/ImageCarousel";
import AndroidStatusBarGradient from '../Components/AndroidStatusBarGradient'
import NavButtons from "../Components/NavButtons";
import Loading from "../Components/Loading";
import Comment from "../Components/Comment";
import WatchOn from "../Components/WatchOn";

import { imgPrefixOriginal } from "../Components/Utilities/Utilities";
import { AuthContext } from "../Components/Contexts/AuthContext";

import axios from "axios";
import FastImage from "react-native-fast-image";
import { default as MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons'

import { useNavigation } from "@react-navigation/native";
import TextBody from "../Components/TextBody";

const width = Dimensions.get('window').width
const height = Dimensions.get('screen').height

export default function TVShowScreen({ route }) {
    const [showData, setShowData] = useState({})
    const [productionCompany, setProductionCompanies] = useState({})
    const [showImages, setShowImages] = useState([])
    const [watchOn, setWatchOn] = useState([])
    const [similar, setSimilar] = useState([])
    const [reviews, setReviews] = useState([])
    const [showVideo, setMovieVideo] = useState([])

    const navigate = useNavigation()

    const [cast, setCast] = useState({})
    const [crew, setCrew] = useState({})
    // const [isInLibrary, setIsInLibrary] = useState(false)

    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    const theme = useContext(ThemeContext)
    const contextAuth = useContext(AuthContext)

    const { showId } = route.params

    useEffect(() => {
        // fetchData()
        fetchAllData()

        return (() => {
            setShowData({})
            setProductionCompanies('')
            setCast({})
            setCrew({})
        })
    }, [])

    useEffect(() => {
        //remove first image as it's already
        //used by the header (avoids redundancy in images)
        showImages.shift()
    }, [showImages])

    function fetchAllData() {
        axios.get(`https://api.themoviedb.org/3/tv/${showId}?api_key=${TMDB_API_KEY}&append_to_response=images,videos,credits,similar,reviews`)
            .then(d => {
                //insert data into their own state
                setShowData(d.data)
                setShowImages(d.data.images.backdrops)
                setMovieVideo(d.data.videos[0])
                sortCast(d.data.credits.cast, setCast)
                sortCrew(d.data.credits.crew, setCrew)
                setProductionCompanies(d.data.production_companies[0])
                setSimilar(d.data.similar.results)
                setReviews(d.data.reviews.results)
            })
            .catch(e => console.log(e.response.data))
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
        companyLogo: {
            width: 90,
            height: 20,
            marginHorizontal: 10,
        },
        companyLogoContainer: {
            backgroundColor: theme.accent,
            padding: 5,
            paddingVertical: 10,
            borderRadius: theme.borderRadius / 2
        },
        smallText: {
            color: theme.foreground,
            maxWidth: 150,
            textAlign: 'center',
            paddingHorizontal: '3%',
            fontFamily: theme.fontRegular
            // backgroundColor: 'red'
        },
        rating: {
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: theme.defaultPadding,
            justifyContent: 'space-around',
            borderColor: theme.accent + '1a',
            borderWidth: 3,
            borderRadius: theme.borderRadius,
            overflow: 'hidden',
            paddingVertical: 10,
            marginTop: 20
        },
        ratingAverage: {
            fontFamily: theme.fontBold,
            color: ratingColor(showData.vote_average),
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
            fontFamily: theme.fontRegular
        },
        companies: {
            textAlign: 'center',
            color: theme.accent
        },
        sectionTitle: {
            fontSize: 16,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            // marginBottom: 10,
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
            opacity: theme.type === 'light' ? 0 : 0.1
        }
    })

    return (
        <View style={styles.container}>
            {/* <Nav/> */}
            <AndroidStatusBarGradient />
            <NavButtons
                showId={showId}
                movieRuntime={showData.runtime}
            // isInLibrary={isInLibrary}
            // setIsInLibrary={setIsInLibrary}
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
                    imagePath={showData.backdrop_path}
                    fallbackImagePath={showData.poster_path}
                    title={showData.name}
                    subtitle={showData.tagline}
                />

                {/* Ratings */}
                <View style={{ ...styles.rating }}>
                    <Pressable
                        onPress={() => {
                            if (productionCompany) {
                                navigate.push('company', { companyId: productionCompany.id })
                            }
                        }}
                        style={styles.companyLogoContainer}
                    >
                        {productionCompany && productionCompany.logo_path ?
                            <FastImage
                                source={{ uri: `${imgPrefixOriginal}${productionCompany.logo_path}` }}
                                style={styles.companyLogo}
                                resizeMode="contain"
                                tintColor={theme.background}
                            />
                            :
                            <Text style={{ ...styles.smallText, color: theme.background }}>
                                {productionCompany ? productionCompany.name :
                                    'Unknown Production Company'
                                }
                            </Text>
                        }
                    </Pressable>
                    <View>
                        <Text style={styles.ratingAverage}>

                            {showData.vote_average ?
                                showData.vote_average :
                                'This movie has no ratings yet'
                            }

                        </Text>
                        {showData.vote_average !== 0 ?
                            <Text style={styles.smallText}>
                                Rating
                            </Text> : null
                        }
                    </View>


                    {showData.episode_run_time > 0 ?
                        <Text style={styles.smallText}>
                            {showData.episode_run_time} min / episode
                        </Text> : null
                    }
                </View>

                {/* Overview */}
                {showData.overview ?
                    <TextBody
                        title="Overview"
                        text={showData.overview}
                    /> : null
                }

                {watchOn.BR && watchOn.BR.flatrate ?
                    <WatchOn
                        data={watchOn.BR.flatrate}
                        tmdbLink={watchOn.hasOwnProperty('US') ? watchOn.US.link : ''}
                    /> : null}

                {/* Images carousel */}
                {showImages.length > 0 ?
                    <ImageCarousel originalQuality={false} showsIcon={false} data={showImages.slice(0, 5)} /> : null
                }

                {reviews.length > 0 ?
                    <View style={{ marginTop: 30 }}>
                        <Text style={styles.sectionTitle}>
                            Reviews, thoughts ({reviews.length})
                        </Text>
                        {
                            reviews.map((item,) => {
                                return (
                                    <Comment
                                        key={item.id}
                                        comment={item}
                                    />
                                )
                            })
                        }

                    </View> : null
                }

                {/* Cast */}
                {cast.acting ?
                    <HorizontalProfileList
                        data={cast.acting}
                        title="Cast"
                    /> : null
                }

                <View style={{ marginTop: 30, }}>
                    <Text style={{ ...styles.text, opacity: 0.5, fontFamily: theme.fontBold }}>
                        You've reached the end. What a ride!
                    </Text>
                    <MaterialCommunityIcons
                        name="dog"
                        style={{ marginBottom: 20, opacity: 0.5, alignSelf: 'center' }}
                        color={theme.foreground}
                        size={30}
                    />
                </View>

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