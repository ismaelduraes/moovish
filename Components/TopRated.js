import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native'
import { ThemeContext } from './Contexts/ThemeContext'
import NewMovie from './NewMovie'
import { TMDB_API_KEY } from '@env'

export default function TopRated(){
    const theme = useContext(ThemeContext)
    const [topRated, setTopRated] = useState([])

    function fetchData(){
        fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&page=1`)
        .then(result => result.json()
        .then(data => setTopRated(data.results))
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
        banner: {
            backgroundColor: theme.accent,
            width: '100%',
            height: 200,
            borderRadius: 15,
            resizeMode: 'cover',
        },
        gradient: {
            position: 'absolute',
            height: 300,
            width: 50,
            left: '86%',
            zIndex: 1,
        },
        scrollView: {
            paddingLeft: '7%'
        }
    })

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>
                Top Rated
            </Text>
            <Text style={styles.caption}>
                The best, according to you
            </Text>
            <ScrollView
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollView}
                horizontal
            >
                {topRated.map((item, index) => {
                    return(
                        <NewMovie
                            movie={item}
                            key={index}
                        />
                    )
                })}
            </ScrollView>
        </View>
    )
}
