import React from "react";
import { useState, useContext } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    Dimensions,
    NativeModules
} from "react-native";
import TopRated from "../Components/TopRated";
import Trending from "../Components/Trending";
import New from "../Components/New";
import NowPlaying from "../Components/NowPlaying";
import Nav from "../Components/Nav";
import { ThemeContext } from "../Components/Contexts/ThemeContext";
import Loading from "../Components/Loading";

const { StatusBarManager } = NativeModules;
const statusBarHeight = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

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
            paddingTop: statusBarHeight+100,
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
            removeClippedSubviews
            >
                <NowPlaying/>
                <TopRated/>
                <Trending/>
                <New/>
            </ScrollView>
        </View>
    )
}