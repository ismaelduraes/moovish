import React from "react";
import { useState, useLayoutEffect as useEffect, useContext } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    Dimensions
} from "react-native";
import { ThemeContext } from "../Components/Contexts/ThemeContext";

import { default as AntDesign } from "react-native-vector-icons/AntDesign";

import LinearGradient from "react-native-linear-gradient";
import Carousel from "react-native-snap-carousel";
import YouTube from "react-native-youtube";

import { YT_API_KEY } from '@env'
import { TMDB_API_KEY } from '@env'

import { imgPrefixOriginal, imgPrefixLow } from '../Components/Utilities/Utilities'

import Nav from "../Components/Nav";

import { sortCast, sortCrew } from "../Components/Utilities/CreditsSort";

import { Link, useParams } from "react-router-native";
import Header from "../Components/Header";


const width = Dimensions.get('window').width

export default function MovieScreen(){
    const [movieData, setMovieData] = useState({})
    const [productionCompany, setProductionCompanies] = useState('Unknown Production Company')
    const [movieImages, setMovieImages] = useState([])
    const [movieVideo, setMovieVideo] = useState([])
    const [cast, setCast] = useState({})
    const [crew, setCrew] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    
    const theme = useContext(ThemeContext)
    const movieId = useParams().movieId
    
    useEffect(() => {
        setIsLoading(true)
        fetchData()
    }, [])


    function fetchData(){
        //fetch movie data
        fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`)
        .then(r => r.json()
        .then(d => {
            setMovieData(d); setProductionCompanies(d.production_companies[0].name)
        })).catch(e => console.log(`COULDN'T FETCH: ${e}`))

        //fetch movie images
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${TMDB_API_KEY}`)
        .then(r => r.json())
        .then(d => setMovieImages(d.backdrops))
        
        //fetch videos
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`)
        .then(r => r.json())
        .then(d => setMovieVideo(d.results[0]))
        
        //fetch credits
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`)
        .then(r => r.json())
        .then(d => {
            sortCast(d.cast, setCast)
            sortCrew(d.crew, setCrew)
        })
        setIsLoading(false)
    }

    function ratingColor(rating){
        //return appropriate color for rating text
        //(red if low rating, yellow if average, green if good)
        if (rating < 5) return 'red'
        else if (rating < 7) return 'yellow'
        else return 'green'
    }



    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: theme.background
        },
        smallText: {
            color: theme.foreground,
            maxWidth: 150,
            textAlign: 'center',
            paddingHorizontal: '3%',
        },
        tagline: {
            width: '80%',
            paddingHorizontal: 30,
            top: -20,
            textAlign: 'center',
            alignSelf: 'center',
            color: theme.foreground
        },
        ratingCircle: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        ratingAverage: {
            fontFamily: theme.fontBold,
            color: ratingColor(movieData.vote_average),
            maxWidth: 120,
            textAlign: 'center',
            paddingHorizontal: '3%',
        },
        text: {
            color: theme.foreground,
            maxWidth: '100%',
            textAlign: 'center',
            paddingHorizontal: '3%',
        },
        rating: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: theme.defaultPadding,
            justifyContent: 'space-evenly',
        },
        companies: {
            textAlign: 'center',
            color: theme.accent
        },
        section: {
            paddingHorizontal: theme.defaultPadding,
            marginBottom: 35
        },
        sectionTitle: {
            fontSize: 20,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            marginBottom: 10,
        },
        overviewText: {
            textAlign: 'left',
            color: theme.foreground,
        },
        image: {
            height: 190,
            width: width-(theme.defaultPadding*2),
            borderRadius: 15,
            backgroundColor: theme.accent,
            alignSelf: 'center',
            overflow: 'hidden'
        },
        cast: {
            marginRight: 30,
            alignItems: 'center'
        },
        profileImage: {
            height: 100,
            width: 100,
            borderRadius: width*0.85,
            backgroundColor: theme.accent,
        },
        crew: {
            flexDirection: 'column',
            marginRight: 25,
            justifyContent: 'center'
        },
        video: {
            height: 180,
            width: width-(theme.defaultPadding*2),
            borderRadius: 15,
            backgroundColor: theme.background,
            alignSelf: 'center',
            overflow: 'hidden',
        }
    })

    if (isLoading) return null

    else return(
        <View style={styles.container}>
            <Nav/>
            <ScrollView showsVerticalScrollIndicator={false}>
                
                <Header
                imagePath={movieData.backdrop_path}
                title={movieData.title}
                />


                {/* tagline */}
                <Text
                    style={{
                        width: 30,
                        ...styles.tagline
                    }}
                >
                    {movieData.tagline}
                </Text>
            
            
            {/*  */}
            {/* RATINGS */}
                <View
                    style={{
                        ...styles.section,
                        ...styles.rating
                    }}
                >
                    <View>
                        <Text style={styles.ratingAverage}>
                            {movieData.vote_average ?
                            movieData.vote_average : 'This movie has no ratings yet'}
                        </Text>
            
                        {
                        movieData.vote_average != 0 &&
                        <Text style={styles.smallText}>
                                Rating
                        </Text>
                        }
                    </View>
                    {
                    productionCompany &&
                        <Text style={styles.smallText}>
                            {productionCompany}
                        </Text>
                    }
                    {
                    movieData.runtime > 0 &&
                        <Text style={styles.smallText}>
                            {movieData.runtime} min
                        </Text>
                    }
                </View>
            
            {/*  */}
            {/* OVERVIEW */}
                {
                movieData.overview !== '' &&
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                            Overview
                    </Text>
                    <Text style={styles.overviewText}>
                        {movieData.overview}
                    </Text>
                </View>
                }
            
            {/*  */}
            {/* IMAGES */}
                {
                movieImages.length > 0 &&
                <View
                    style={{
                        marginBottom: 35
                    }}
                >
                    <Text
                        style={{
                            ...styles.sectionTitle,
                            paddingHorizontal: theme.defaultPadding
                        }}
                    >
                        Images
                    </Text>
                    <Carousel
                        data={movieImages}
                        removeClippedSubviews
                        sliderWidth={width}
                        itemWidth={width-(theme.defaultPadding*2)}
                        layout="default"
                        layoutCardOffset={10}
                        renderItem={ (item) =>
                        {
                            return(
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                            removeClippedSubviews
                            >
                                <Image
                                    key={item.index}
                                    style={styles.image}
                                    source={{
                                        uri:
                                        `${imgPrefixOriginal}${item.item.file_path}`
                                    }}/>
                            </View>
                        )}}
                    />
                </View>
                }
            
            {/*  */}
            {/* CAST */}
                {cast.acting &&
                <View>
                    <Text
                        style={{
                            ...styles.sectionTitle,
                            ...styles.section
                        }}
                    >
                        Cast
                    </Text>
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        style={{
                            ...styles.section,
                            flexDirection: 'row'
                        }}
                        contentContainerStyle={{paddingRight: 30}}
                    >
                        {cast.acting &&
                        cast.acting.map((item, index) => {
                            if(item.profile_path)
                            return(
                                <View
                                style={styles.cast}
                                key={index}>
                                    <Image
                                    style={styles.profileImage}
                                    source={{uri:`${imgPrefixLow}${item.profile_path}`}}
                                    />
                                    <Text style={{
                                        ...styles.smallText,
                                        marginTop: 10,
                                        fontFamily: theme.fontBold,
                                    }}>
                                        {item.name}
                                    </Text>
                                    <Text
                                    style={{
                                        ...styles.smallText,
                                        marginTop: 0,
                                        color: theme.accentLight,
                                        opacity: 0.5
                                    }}>
                                        {item.character}
                                    </Text>
                                </View>
                            )
                        })
                        }
                    </ScrollView>
                </View>}
            
            {/*  */}
            {/* VIDEO */}
                {movieVideo &&
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Featured Video
                    </Text>
                    <YouTube
                        apiKey={YT_API_KEY}
                        videoId={movieVideo.key}
                        style={styles.video}
                    />
                </View>}
                <Text style={{textAlign: 'center', marginBottom: 20, color: 'gray', fontFamily: theme.fontRegular}}>
                    Movie ID: {movieData.id}
                </Text>
            </ScrollView>
        </View>
    )
}