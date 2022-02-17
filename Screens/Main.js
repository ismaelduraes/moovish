import React from "react";
import { useState, useContext } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    Dimensions
} from "react-native";
import TopRated from "../Components/TopRated";
import Trending from "../Components/Trending";
import New from "../Components/New";
import NowPlaying from "../Components/NowPlaying";
import Nav from "../Components/Nav";
import { ThemeContext } from "../Components/Contexts/ThemeContext";

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default function Main({navigation}){
    const [newLoaded, setNewLoaded] = useState(false)
    const theme = useContext(ThemeContext)

    return(
        <View style={{...styles.container, backgroundColor: theme.background}}>
            <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
                backgroundColor: theme.background
            }}
            contentContainerStyle={styles.contentContainer}
            >
                {/* render new images before anything else */}
                <New setNewLoaded={setNewLoaded}/>

                {newLoaded &&
                <View>
                    <Trending/>
                    <NowPlaying/>
                    <TopRated/>
                </View>
                }
            </ScrollView>
            <Nav/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
    },
})