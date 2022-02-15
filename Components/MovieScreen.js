import React from "react";
import { useState, useLayoutEffect as useEffect, useContext } from "react";
import { View, Text, Image, TextInput, ScrollView, StyleSheet, Dimensions } from "react-native";
import { ThemeContext } from "./Contexts/ThemeContext";

import { default as SimpleLineIcons } from "react-native-vector-icons/SimpleLineIcons";
import { default as AntDesign } from "react-native-vector-icons/AntDesign";

import LinearGradient from "react-native-linear-gradient";
import Carousel from "react-native-snap-carousel";
import YouTube from "react-native-youtube";

import { YT_API_KEY } from '@env'
import { TMDB_API_KEY } from '@env'

import { imgPrefix, imagePrefixOriginal, imagePrefixLow, imgPrefixOriginal } from './Utilities/Utilities'

import { MovieContext } from "../App";

const width = Dimensions.get('window').width

export default function MovieScreen({id}){
    const [movieData, setMovieData] = useState({})
    const [productionCompanies, setProductionCompanies] = useState('Unknown Production Company')
    const [movieImages, setMovieImages] = useState([])
    const [movieVideo, setMovieVideo] = useState([])
    const [cast, setCast] = useState({})
    const [crew, setCrew] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const theme = useContext(ThemeContext)
    const contextProps = useContext(MovieContext)

    function fetchData(){
        //fetch movie data
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`)
        .then(r => r.json()
        .then(d => {
            setMovieData(d); setProductionCompanies(d.production_companies[0].name)
        })).catch(e => console.log(`COULDN'T FETCH: ${e}`))

        //fetch movie images
        fetch(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${TMDB_API_KEY}`)
        .then(r => r.json())
        .then(d => setMovieImages(d.backdrops))
        
        //fetch videos
        fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}`)
        .then(r => r.json())
        .then(d => setMovieVideo(d.results[0]))
        
        //fetch credits
        fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}`)
        .then(r => r.json())
        .then(d => {
            sortCast(d.cast)
            sortCrew(d.crew)
        })
        setIsLoading(false)
    }

    function sortCrew(credits){
        //separates cast and crew by department.
        //makes easier to show only the data that is relevant since
        //tmdb doesnt sort crew and cast by their departments themselves

        console.log('sorting crew')

        const tempCrew = {
            acting: [],
            art: [],
            camera: [],
            costume: [],
            directing: [],
            editing: [],
            sound: [],
            soundEffects: [],
            production: [],
            visualEffects: [],
        }


        credits.forEach(item => {
            switch (item.department.toLowerCase()){
                case 'art':
                    tempCrew.art.push(item)
                    break
                case 'acting':
                    tempCrew.acting.push(item)
                    break
                case 'sound':
                    tempCrew.sound.push(item)
                    break
                case 'production':
                    tempCrew.production.push(item)
                    break
                case 'costume':
                    tempCrew.costume.push(item)
                    break
                case 'visual effects':
                    tempCrew.visualEffects.push(item)
                    break
                case 'sound effects':
                    tempCrew.soundEffects.push(item)
                    break
                case 'editing':
                    tempCrew.editing.push(item)
                    break
                case 'directing':
                    tempCrew.directing.push(item)
                    break
                case 'camera':
                    tempCrew.camera.push(item)
                    break
            }
        })

        setCrew(tempCrew)
    }

    function sortCast(credits){
        console.log('sorting cast')


        const tempCast = {
            acting: [],
            art: [],
            camera: [],
            costume: [],
            directing: [],
            editing: [],
            sound: [],
            soundEffects: [],
            production: [],
            visualEffects: [],
        }

        credits.forEach(item => {
            switch (item.known_for_department.toLowerCase()){
                case 'art':
                    tempCast.art.push(item)
                    break
                case 'acting':
                    tempCast.acting.push(item)
                    console.log(`${item.name} pushed`)
                    break
                case 'sound':
                    tempCast.sound.push(item)
                    break
                case 'production':
                    tempCast.production.push(item)
                    break
                case 'costume':
                    tempCast.costume.push(item)
                    break
                case 'visual effects':
                    tempCast.visualEffects.push(item)
                    break
                case 'sound effects':
                    tempCast.soundEffects.push(item)
                    break
                case 'editing':
                    tempCast.editing.push(item)
                    break
                case 'directing':
                    tempCast.directing.push(item)
                    break
                case 'camera':
                    tempCast.camera.push(item)
                    break
            }
            })
        console.log(tempCast.acting)
        setCast(tempCast)
    }

    function ratingColor(rating){
        //return appropriate color for rating text
        //(red if low rating, yellow if average, green if good)
        if (rating < 5) return 'red'
        else if (rating < 7) return 'yellow'
        else return 'lightgreen'
    }

    useEffect(() => {
        setIsLoading(true)
        fetchData()
    }, [])
    useEffect(() => {
        console.log(cast.acting)
    }, [crew])


    const styles = StyleSheet.create({
        container: {
            height: '100%',
            width: '100%',
            position: 'absolute'
        },
        poster: {
            width: '100%',
            height: 350,
        },
        smallText: {
            color: theme.foreground,
            maxWidth: 150,
            textAlign: 'center',
            paddingHorizontal: '3%',
        },
        titleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: '7%',
            top: -25,
            zIndex: 2
        },
        movieTitle: {
            color: theme.foreground,
            fontFamily: theme.fontBold,
            fontSize: 30,
            maxWidth: width*0.5,
            textAlign: 'center',
            marginBottom: 5
        },
        tagline: {
            width: '100%',
            paddingHorizontal: '7%',
            top: -25,
            textAlign: 'center',
        },
        posterGradient: {
            height: 350,
            width: '100%',
            position: 'absolute',
            left: 0,
            zIndex: 1,
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
            paddingHorizontal: '7%',
            justifyContent: 'space-evenly',
            // marginBottom: 40
        },
        companies: {
            textAlign: 'center',
            color: theme.foreground
        },
        section: {
            paddingHorizontal: '7%',
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
            height: 180,
            width: width*0.85,
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
            width: width*0.85,
            borderRadius: 15,
            backgroundColor: theme.background,
            alignSelf: 'center',
            overflow: 'hidden',
        }
    })

    if (isLoading) return null

    else return(
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>

{/*  */}
{/* POSTER */}
            <LinearGradient style={styles.posterGradient} colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']} />
            <Image style={styles.poster} source={{uri: `${imgPrefixOriginal}${movieData.backdrop_path}`}}/>
            
            {/* title */}
            <View style={styles.titleContainer}>
                <View onTouchEnd={() => contextProps.setIsOnMovie(false)}>
                    <AntDesign name="arrowleft" size={30} color={theme.foreground}/>
                </View>

                <Text style={styles.movieTitle}>
                    {movieData.title}
                </Text>
                <AntDesign
                name="plus" size={30}
                color={theme.foreground}/>
            </View>

            {/* tagline */}
            <Text style={{width: 30, height: 20, ...styles.tagline}}>
                {movieData.tagline}
            </Text>


{/*  */}
{/* RATINGS */}

            <View style={{...styles.section, ...styles.rating}}>
                <View>
                    <Text style={styles.ratingAverage}>
                        {movieData.vote_average ? movieData.vote_average : 'This movie has no ratings yet'}
                    </Text>
                    {movieData.vote_average != 0 &&
                    <Text style={styles.smallText}>Rating</Text>
                    }
                </View>

                <View>
                    <Text style={styles.smallText}>{productionCompanies}</Text>
                </View>

                {movieData.runtime > 0 &&
                <View>
                    <Text style={styles.smallText}>
                        {movieData.runtime} min
                    </Text>
                </View>}
            </View>

{/*  */}
{/* OVERVIEW */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Overview</Text>
                <Text style={styles.overviewText}>
                    {movieData.overview}
                </Text>
            </View>

{/*  */}
{/* IMAGES */}
            {movieImages && <View style={{marginBottom: 35}}>
                <Text style={{...styles.sectionTitle, paddingHorizontal: '7%'}}>
                    Images
                </Text>
                <Carousel
                data={movieImages.slice(0, 4)}
                sliderWidth={width}
                itemWidth={width*0.85}
                layout="stack"
                layoutCardOffset={10}
                renderItem={ (item) =>
                {
                    return(
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image key={item.index} style={styles.image} source={{uri: `${imgPrefixOriginal}${item.item.file_path}`}}/>
                        {item.index === 0 &&
                        <SimpleLineIcons name="arrow-right" color={theme.foreground} size={16}
                        style={{left: 5}}
                        />}
                    </View>
                )}}
                />
            </View>}

{/*  */}
{/* CAST */}
            {cast.acting &&
            <View>
                {console.log(cast.acting)}
            <Text style={{...styles.sectionTitle, ...styles.section}}>Cast</Text>
            <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            style={{...styles.section, flexDirection: 'row'}}
            contentContainerStyle={{paddingRight: '7%'}}
            >
                {cast.acting && cast.acting.map((item, index) => {
                    if (index < 10) return(
                        <View style={styles.cast} key={index}>
                            <Image style={styles.profileImage}
                            source={{uri: `${imgPrefix}${item.profile_path}`}}
                            />
                            <Text style={{...styles.smallText, marginTop: 10, fontFamily: theme.fontBold}}>
                                {item.name}
                            </Text>
                            <Text style={{...styles.smallText, marginTop: 0, opacity: 0.3}}>
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
            {movieVideo.key !== undefined &&
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
    )
}