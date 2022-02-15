import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native'
import { ThemeContext } from './Contexts/ThemeContext'
import NewMovie from './NewMovie'
import { MovieContext } from '../App'

export default function New(){
    const theme = useContext(ThemeContext)
    const contextProps = useContext(MovieContext)
    const [newMoviesData, setNewMoviesData] = useState([])

    function fetchData(){
        fetch('https://api.themoviedb.org/3/movie/upcoming?api_key=cd2313ca79ff33e56d832cf18a212b69&page=1')
        .then(result => result.json()
        .then(data => setNewMoviesData(data.results))
        )
    }

    useEffect(() => {
        fetchData()
    }, [])

    const styles = StyleSheet.create({
        container: {
            marginBottom: '15%',
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
            marginBottom: '5%',
            left: 15/3,
            fontFamily: theme.fontRegular,
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
            // backgroundColor: 'blue',
            zIndex: 1,
        },
        scrollView: {
            paddingHorizontal: '7%',
        }
    })

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>
                New and fresh
            </Text>
            <Text style={styles.caption}>
                Just released or upcoming
            </Text>
            {/* <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']} style={styles.gradient}/> */}
            <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView} horizontal>
                {newMoviesData.map((item, index) => {
                    return(
                        <View key={index} onTouchEnd={() => {
                            contextProps.setSelectedMovie(item.id)
                            contextProps.setIsOnMovie(true)
                        }}>
                            <NewMovie
                            movieName={item.title}
                            imageLink={item.poster_path}
                            />
                        </View>
                    )
                })}
            </ScrollView>
        </View>
    )
}
