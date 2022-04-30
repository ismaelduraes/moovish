import React from 'react';
import {useContext, useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  Dimensions,
} from 'react-native';

import {ThemeContext} from './Contexts/ThemeContext';
import Poster from './Poster';

import SlideAnimationFunction from './Utilities/SlideAnimationFuncion';

import {TMDB_API_KEY} from '@env';
import axios from 'axios';

const width = Dimensions.get('window').width;

export default function Anime() {
  const theme = useContext(ThemeContext);
  const [newMoviesData, setNewMoviesData] = useState([]);

  const containerSlideAnim = useRef(new Animated.Value(150)).current;
  const containerOpacityAnim = useRef(new Animated.Value(0)).current;

  function fetchData() {
    axios
      .get(
        `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_keywords=anime&language=en-US&sort_by=popularity.desc&page=1&timezone=America%2FNew_York&with_genres=16&include_null_first_air_dates=false`,
      )
      .then(result => setNewMoviesData(result.data.results));
  }

  useEffect(() => {
    fetchData();
    SlideAnimationFunction(containerSlideAnim, 0, 1000);
    SlideAnimationFunction(containerOpacityAnim, 1, 1000);
  }, []);

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.homeComponentsBottomMargin,
      overflow: 'hidden',
      transform: [{translateY: containerSlideAnim}],
      opacity: containerOpacityAnim,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: theme.fontBold,
      color: theme.foreground,
      paddingHorizontal: theme.defaultPadding,
      marginBottom: 10,
    },
    scrollView: {
      paddingHorizontal: theme.defaultPadding,
    },
  });

  return (
    <Animated.View style={styles.container}>
      <Text style={styles.sectionTitle}>Animes and cartoons</Text>

      <FlatList
        removeClippedSubviews
        contentContainerStyle={styles.scrollView}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={newMoviesData}
        renderItem={item => {
          return (
            <View key={item.index}>
              <Poster
                data={item.item}
                animDelay={item.index * 100}
                width={width * 0.6}
                height={width * 0.6 * 0.6}
                animate={true}
                showText={true}
                useBackdrop
                cutText
              />
            </View>
          );
        }}
      />
    </Animated.View>
  );
}
