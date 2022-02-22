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

import { TMDB_API_KEY } from '@env'

import { sortCast, sortCrew } from "../Components/Utilities/CreditsSort";

import Header from "../Components/Header";
import TextBody from "../Components/TextBody";
import HorizontalProfileList from "../Components/HorizontalProfileList";
import ImageCarousel from "../Components/ImageCarousel";
import AndroidStatusBarGradient from '../Components/AndroidStatusBarGradient'

import { imgPrefixOriginal } from "../Components/Utilities/Utilities";
import NavButtons from "../Components/NavButtons";

const width = Dimensions.get('window').width

export default function MovieScreen({route}){
    const [movieData, setMovieData] = useState({})
    const [productionCompany, setProductionCompanies] = useState('Unknown Production Company')
    const [movieImages, setMovieImages] = useState([])
    const [movieVideo, setMovieVideo] = useState([])
    const [cast, setCast] = useState({})
    const [crew, setCrew] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    
    const theme = useContext(ThemeContext)
    const { movieId } = route.params
    
    useEffect(() => {
        setIsLoading(true)
        fetchData()
    }, [])
    useEffect(() => {
        //remove first image as it's already
        //used by the header (avoids redundancy in images)
        movieImages.shift()
    }, [movieImages])


    function fetchData(){
        //fetch movie data
        fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`)
        .then(r => r.json()
        .then(d => {
            setMovieData(d); setProductionCompanies(d.production_companies[0].name)
        }))

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
            setIsLoading(false)
        })
    }

    function ratingColor(rating){
        //return appropriate color for rating text
        //(red if low rating, yellow if average, green if good)
        if (rating < 5) return 'red'
        else if (rating < 7) return '#d94f00'
        else return 'green'
    }



    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            height: '100%',
            width: '100%',
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
            marginHorizontal: '5%',
            justifyContent: 'center',
            backgroundColor: theme.background+'40',
            borderRadius: 50,
            overflow: 'hidden',
            paddingVertical: 15
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
            width: width-(theme.defaultPadding*2),
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
            opacity: theme.type === 'light' ? 0.3 : 0.1
        }
    })
    
    if (isLoading) return null
    
    else return(
        <View style={styles.container}>
            {/* <Nav/> */}
            <AndroidStatusBarGradient/>
            <NavButtons/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                style={styles.imageBg}
                source={movieData.backdrop_path ? 
                       {uri: `${imgPrefixOriginal}${movieData.backdrop_path}`} :
                       require('../assets/images/profile_default.png')}
                // dark theme looks better with more blur
                blurRadius={theme.type === 'light' ? 10 : 25}
                progressiveRenderingEnabled
                />
                {/* Poster */}
                <Header
                imagePath={movieData.backdrop_path}
                fallbackImagePath={movieData.poster_path}
                title={movieData.title}
                subtitle={movieData.tagline}
                />

                {/* Ratings */}
                <View style={{...styles.rating}}>
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

                        {productionCompany ?
                        <Text style={styles.smallText}>
                            {productionCompany ?
                             productionCompany :
                            'Unknown Production Company'
                            }
                        </Text> : null
                        }

                        {movieData.runtime > 0 ?
                        <Text style={styles.smallText}>
                            {movieData.runtime} min
                        </Text> : null
                        }
                </View>
            
                {/* Overview */}
                {movieData.overview ?
                <TextBody title="Overview" text={movieData.overview}/> : null
                }
            
                {/* Images carousel */}
                {movieImages.length > 0 ?
                <ImageCarousel data={movieImages}/> : null
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