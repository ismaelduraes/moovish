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
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const { StatusBarManager } = NativeModules;
const statusBarHeight = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

const height = Dimensions.get('screen').height


export default function Main({ navigation }) {
    const theme = useContext(ThemeContext)

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.background,
        },
        gradient: {
            width: '100%',
            height: '15%',
            position: 'absolute'
        },
    })

    return (
        <View style={{ ...styles.container }}>
            <Nav />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
                removeClippedSubviews
            // stickyHeaderIndices={[0]}
            >
                <NowPlaying />
                <New />
                <Trending />
                <TopRated />
            </ScrollView>
            <LinearGradient
                style={styles.gradient}
                colors={[
                    theme.background,
                    theme.type === 'light' ? 'rgba(255,255,255,0)' : 'rgba(0,0,0,0)',
                ]}
            />
        </View>
    )
}