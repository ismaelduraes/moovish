import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from 'react-native'
import { ThemeContext } from './Contexts/ThemeContext'
import Carousel from 'react-native-snap-carousel';

import NewMovie from './NewMovie'

import { TMDB_API_KEY } from '@env'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default function NowPlaying(){
    const theme = useContext(ThemeContext)
    const [nowPlaying, setNowPlaying] = useState([])

    function fetchData(){
        fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&page=1`)
        .then(result => result.json()
        .then(data => setNowPlaying(data.results))
        )
    }

    useEffect(() => {
        fetchData()
    }, [])

    const styles = StyleSheet.create({
        container: {
            marginBottom: '10%',
            overflow: 'hidden'
        },
        sectionTitle: {
            fontSize: 26,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            //third of border radius
            left: 15/3,
            paddingHorizontal: '7%',
        },
        caption: {
            fontFamily: theme.fontRegular,
            marginBottom: '5%',
            left: 15/3,
            paddingHorizontal: '7%',
        },
        gradient: {
            position: 'absolute',
            height: 300,
            width: 50,
            left: '86%',
            zIndex: 1,
        }
    })

    function Banner(item, index){
        return(
            <View style={{alignItems: 'center', backgroundColor: theme.background}}>
                <Image style={{
                    height: width/2,
                    width: width*0.85,
                    borderRadius: 15,
                    resizeMode: 'cover',
                }}
                key={index}
                source={{uri: `https://image.tmdb.org/t/p/w500${item.item.backdrop_path}`}}/>
                <Text style={{
                    textAlign: 'center',
                    fontFamily: theme.fontRegular,
                    color: theme.foreground,
                    marginTop: 10,
                    backgroundColor: theme.background,
                    width: '100%'}}>
                    {item.item.title}
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>
                Now Playing
            </Text>
            <Text style={styles.caption}>
                Movies currently playing in theatres
            </Text>

            <Carousel
                data={nowPlaying}
                horizontal
                renderItem={Banner}
                sliderWidth={width}
                itemWidth={width*0.85}
                layout="default"
                layoutCardOffset={10}
            />
        </View>
    )
}