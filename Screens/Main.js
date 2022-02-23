import React from "react";
import { useState, useContext } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    Dimensions,
} from "react-native";
import TopRated from "../Components/TopRated";
import Trending from "../Components/Trending";
import New from "../Components/New";
import NowPlaying from "../Components/NowPlaying";
import Nav from "../Components/Nav";
import { ThemeContext } from "../Components/Contexts/ThemeContext";

import LinearGradient from "react-native-linear-gradient";

const height = Dimensions.get('screen').height


export default function Main({navigation}){
    const [newLoaded, setNewLoaded] = useState(false)
    const theme = useContext(ThemeContext)

    const styles = StyleSheet.create({
        container: {
            width: '100%',
            height: '100%',
            backgroundColor: theme.background,
            position: 'absolute',
        },
        contentContainer: {
            paddingTop: '38%',
        },
    })
    
    return(
        <View style={{...styles.container}}>
            <Nav/>
            <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
                // backgroundColor: theme.background
            }}
            contentContainerStyle={styles.contentContainer}
            >
                {/* render new images before anything else */}
                <NowPlaying/>
                <New setNewLoaded={setNewLoaded}/>
                <Trending/>
                <TopRated/>
            </ScrollView>
            <LinearGradient
            style={{
                width: '100%', height: '20%',
                position: 'absolute'
            }}
            colors={[
                theme.background,
                theme.background,
                // theme.background,
                'rgba(0, 0, 0, 0)',
            ]}
            />
        </View>
    )
}