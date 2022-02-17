import React from "react";
import { useState, useContext } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    Dimensions
} from "react-native";
import TopRated from "./TopRated";
import Trending from "./Trending";
import New from "./New";
import NowPlaying from "./NowPlaying";
import Nav from "./Nav";
import { ThemeContext } from "./Contexts/ThemeContext";

const width = Dimensions.get('window').width

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
    },
    contentContainer: {
        paddingBottom: '20%',
        overflow: 'visible'
    }
})