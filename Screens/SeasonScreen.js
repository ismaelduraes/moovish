import React from 'react';
import {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

import {TMDB_API_KEY} from '@env';
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import AndroidStatusBarGradient from '../Components/AndroidStatusBarGradient';
import NavButtons from '../Components/NavButtons';
import Loading from '../Components/Loading';

import {imgPrefixOriginal} from '../Components/Utilities/Utilities';
import {ThemeContext} from '../Components/Contexts/ThemeContext';
import {AuthContext} from '../Components/Contexts/AuthContext';

import LinearGradient from 'react-native-linear-gradient';

import axios from 'axios';
import {default as MaterialCommunityIcons} from 'react-native-vector-icons/MaterialCommunityIcons';

import {useNavigation} from '@react-navigation/native';
import TextBody from '../Components/TextBody';
import Episodes from '../Components/Episodes';

const width = Dimensions.get('window').width;
const height = Dimensions.get('screen').height;

export default function TVShowScreen({route}) {
  const [seasonData, setSeasonData] = useState({});
  const [showData, setShowData] = useState({});

  const navigate = useNavigation();

  const [cast, setCast] = useState({});
  const [crew, setCrew] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const theme = useContext(ThemeContext);
  const contextAuth = useContext(AuthContext);

  const {showId} = route.params;
  const {seasonNumber} = route.params;

  useEffect(() => {
    // fetchData()
    fetchAllData();

    return () => {};
  }, []);

  function fetchAllData() {
    setIsLoading(true);
    axios
      .get(
        `https://api.themoviedb.org/3/tv/${showId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`,
      )
      .then(d => {
        //insert data into their own state
        setSeasonData(d.data);

        //get overall data for the show (not just the season)
        axios
          .get(
            `https://api.themoviedb.org/3/tv/${showId}?api_key=${TMDB_API_KEY}`,
          )
          .then(d => setShowData(d.data))
          .catch(e => setIsError(true));

        setIsLoading(false);
      })
      .catch(e => setIsError(true));
  }

  function ratingColor(rating) {
    //return appropriate color for rating text
    //(red if low rating, yellow if average, green if good)
    if (rating < 5) return 'red';
    else if (rating < 7) return '#d94f00';
    else return 'green';
  }

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      height,
      width,
      backgroundColor: theme.background,
    },
    poster: {
      height: width * 1.5,
      width,
      backgroundColor: theme.background,
    },
    text: {
      color: theme.foreground,
      paddingHorizontal: theme.defaultPadding,
      fontFamily: theme.fontRegular,
      textAlign: 'center',
      flexWrap: 'wrap',
      flexShrink: 1,
    },
    sectionTitle: {
      paddingTop: 15,
      fontSize: 24,
      fontFamily: theme.fontBold,
      color: theme.accent,
      marginBottom: 5,
      paddingHorizontal: theme.defaultPadding,
    },
  });

  if (isLoading) return <Loading isError={isError} />;

  return (
    <View style={styles.container}>
      {/* <Nav/> */}
      <AndroidStatusBarGradient />
      <NavButtons
        showId={showData.id}
        // isInLibrary={isInLibrary}
        // setIsInLibrary={setIsInLibrary}
      />
      <ParallaxScrollView
        contentContainerStyle={{
          paddingBottom: 30,
          backgroundColor: theme.background,
        }}
        parallaxHeaderHeight={width * 1.5}
        showsVerticalScrollIndicator={false}
        backgroundScrollSpeed={1.5}
        renderBackground={() => {
          return (
            <View style={{backgroundColor: theme.background}}>
              <Image
                source={{uri: `${imgPrefixOriginal}${seasonData.poster_path}`}}
                style={styles.poster}
                resizeMode="cover"
              />
            </View>
          );
        }}>
        <Text style={styles.sectionTitle}>
          {showData.name}, {seasonData.name}
        </Text>

        {/* Overview */}
        <View style={{marginBottom: 15}}>
          <Text style={{...styles.text, textAlign: 'left'}}>
            {seasonData.overview
              ? seasonData.overview
              : `We don't have a description for this season yet.`}
          </Text>
        </View>

        <View>
          <Text style={{...styles.text, textAlign: 'left', opacity: 0.4}}>
            {seasonData.air_date.slice(0, seasonData.air_date.indexOf('-'))}
          </Text>
        </View>

        <Episodes data={seasonData.episodes} />

        <View style={{marginTop: 30}}>
          <Text
            style={{...styles.text, opacity: 0.5, fontFamily: theme.fontBold}}>
            You've reached the end. What a ride!
          </Text>
          <MaterialCommunityIcons
            name="dog"
            style={{marginBottom: 20, opacity: 0.5, alignSelf: 'center'}}
            color={theme.foreground}
            size={30}
          />
        </View>
      </ParallaxScrollView>
    </View>
  );
}
