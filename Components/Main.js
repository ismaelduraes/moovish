import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import TopRated from "./TopRated";
import Trending from "./Trending";
import New from "./New";
import NowPlaying from "./NowPlaying";

export default function Main(props){
    return(
        <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        >
            <New/>
            <Trending/>
            <NowPlaying/>
            <TopRated/>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: '25%',
        // paddingHorizontal: '7%',
        position: 'absolute',
        top: 0,
        bottom: 0,
        // overflow: 'visible'
        // left: 0,
        // right: 0,
    },
    contentContainer: {
        paddingBottom: '20%',
        overflow: 'visible'
    }
})