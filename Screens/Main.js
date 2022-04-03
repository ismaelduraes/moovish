import React from 'react';
import {useState, useContext} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import TopRated from '../Components/TopRated';
import Trending from '../Components/Trending';
import New from '../Components/New';
import NowPlaying from '../Components/NowPlaying';
import Nav from '../Components/Nav';
import {ThemeContext} from '../Components/Contexts/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import TrendingTV from '../Components/TrendingTV';
import WorthAWatch from '../Components/WorthAWatch';
import Kids from '../Components/Kids';
import Anime from '../Components/Anime';

export default function Main() {
  const theme = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.background,
    },
    gradient: {
      width: '100%',
      height: '15%',
      position: 'absolute',
    },
  });

  return (
    <View style={{...styles.container}}>
      <Nav />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        <NowPlaying />
        <TrendingTV />
        <New />
        <Anime />
        <WorthAWatch />
        <Trending />
        <Kids />
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
  );
}
