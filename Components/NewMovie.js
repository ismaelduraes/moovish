import React from "react";
import { useContext } from "react";
import { View, Image, Text, StyleSheet } from 'react-native'

import { ThemeContext } from "./Contexts/ThemeContext";

export default function NewMovie({fullRes = false, bannerHeight = 180, bannerWidth = 120, imageLink, movieName}){
    const theme = useContext(ThemeContext)
    const styles = StyleSheet.create({
        container: {
            marginRight: 15
        },
        title: {
            marginTop: 5,
            textAlign: 'center',
            width: bannerWidth,
            color: theme.foreground,
            fontFamily: theme.fontRegular,
        },
        banner: {
            height: bannerHeight,
            width: bannerWidth,
            borderRadius: 15,
            resizeMode: 'cover'
        }
    })
    
    return(
        <View style={styles.container}>
            <Image style={styles.banner} source={{uri: `https://image.tmdb.org/t/p/${fullRes ? 'original' : 'w500'}/${imageLink}`}}/>
            <Text style={styles.title}>
                {movieName}
            </Text>
        </View>
    )
}