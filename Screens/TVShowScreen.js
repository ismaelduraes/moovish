import React from 'react';
import {useState, useEffect, useContext} from 'react';
import {View, Text, Pressable, StyleSheet, Dimensions} from 'react-native';
import {ThemeContext} from '../Components/Contexts/ThemeContext';

import ParallaxScrollView from 'react-native-parallax-scroll-view';

import {TMDB_API_KEY} from '@env';

import {sortCast, sortCrew} from '../Components/Utilities/CreditsSort';

import Header from '../Components/Header';
import HorizontalProfileList from '../Components/HorizontalProfileList';
import ImageCarousel from '../Components/ImageCarousel';
import AndroidStatusBarGradient from '../Components/AndroidStatusBarGradient';
import NavButtons from '../Components/NavButtons';
import Loading from '../Components/Loading';
import Comment from '../Components/Comment';
import WatchOn from '../Components/WatchOn';

import {imgPrefixOriginal} from '../Components/Utilities/Utilities';
import {AuthContext} from '../Components/Contexts/AuthContext';

import axios from 'axios';
import FastImage from 'react-native-fast-image';
import {default as MaterialCommunityIcons} from 'react-native-vector-icons/MaterialCommunityIcons';

import {useNavigation} from '@react-navigation/native';
import TextBody from '../Components/TextBody';
import Season from '../Components/Season';

const width = Dimensions.get('window').width;
const height = Dimensions.get('screen').height;

export default function TVShowScreen({route}) {
  const [showData, setShowData] = useState({});
  const [productionCompany, setProductionCompanies] = useState({});
  const [showImages, setShowImages] = useState([]);
  const [watchOn, setWatchOn] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [seasons, setSeasons] = useState([]);

  const navigate = useNavigation();

  const [cast, setCast] = useState({});
  const [crew, setCrew] = useState({});
  // const [isInLibrary, setIsInLibrary] = useState(false)

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const theme = useContext(ThemeContext);

  const {showId} = route.params;

  useEffect(() => {
    // fetchData()
    fetchAllData();

    return () => {
      setShowData({});
      setProductionCompanies('');
      setCast({});
      setCrew({});
    };
  }, []);

  useEffect(() => {
    //remove first image as it's already
    //used by the header (avoids redundancy in images)
    showImages.shift();
  }, [showImages]);

  function fetchAllData() {
    setIsLoading(true);
    axios
      .get(
        `https://api.themoviedb.org/3/tv/${showId}?api_key=${TMDB_API_KEY}&append_to_response=images,videos,credits,similar,reviews`,
      )
      .then(d => {
        //insert data into their own state
        setShowData(d.data);
        setShowImages(d.data.images.backdrops);
        sortCast(d.data.credits.cast, setCast);
        sortCrew(d.data.credits.crew, setCrew);
        setProductionCompanies(d.data.production_companies[0]);
        setSimilar(d.data.similar.results);
        setReviews(d.data.reviews.results.splice(0, 5));
        setSeasons(d.data.seasons);

        axios
          .get(
            `https://api.themoviedb.org/3/tv/${showId}/watch/providers?api_key=${TMDB_API_KEY}`,
          )
          .then(d => {
            setWatchOn(d.data.results);
          });

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
    companyLogo: {
      width: 60,
      height: 20,
      marginHorizontal: 10,
    },
    companyLogoContainer: {
      // backgroundColor: theme.accent,
      padding: 5,
      paddingVertical: 10,
      borderRadius: theme.borderRadius / 2,
    },
    smallText: {
      color: theme.foreground,
      maxWidth: 150,
      textAlign: 'center',
      paddingHorizontal: '3%',
      fontFamily: theme.fontRegular,
      // backgroundColor: 'red'
    },
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: theme.defaultPadding,
      justifyContent: 'space-around',
      borderColor: theme.accent + '4c',
      borderWidth: 3,
      borderRadius: theme.borderRadius,
      overflow: 'hidden',
      paddingVertical: 10,
      marginTop: 20,
    },
    ratingAverage: {
      fontFamily: theme.fontBold,
      color: ratingColor(showData.vote_average),
      maxWidth: 120,
      textAlign: 'center',
      paddingHorizontal: '3%',
      // backgroundColor: 'red'
    },
    text: {
      color: theme.foreground,
      maxWidth: '100%',
      textAlign: 'center',
      paddingHorizontal: '3%',
      fontFamily: theme.fontRegular,
    },
    companies: {
      textAlign: 'center',
      color: theme.accent,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: theme.fontBold,
      color: theme.foreground,
      // marginBottom: 10,
      paddingHorizontal: theme.defaultPadding,
    },
    video: {
      height: 180,
      width: width - theme.defaultPadding * 2,
      borderRadius: theme.borderRadius,
      backgroundColor: theme.background,
      alignSelf: 'center',
      overflow: 'hidden',
    },
    imageBg: {
      height: '100%',
      width: '100%',
      position: 'absolute',
      zIndex: -1,
      //dark theme has less opacity on blurred image
      //to keep theme darker
      opacity: theme.type === 'light' ? 0 : 0.1,
    },
    titleContainer: {
      // alignItems: 'center',
      paddingHorizontal: theme.defaultPadding,
      marginTop: 20,
      zIndex: 2,
      // marginBottom: 20,
    },
    headerTitle: {
      color: theme.accent,
      fontFamily: theme.fontBold,
      fontSize: 24,
      marginBottom: 5,
    },
    subtitle: {
      width: '80%',
      color: theme.foreground,
      fontFamily: theme.fontRegular,
    },
  });

  if (isLoading) return <Loading isError={isError} />;

  return (
    <View style={styles.container}>
      {/* <Nav/> */}
      <AndroidStatusBarGradient />
      <NavButtons
        showId={showId}
        movieRuntime={showData.runtime}
        // isInLibrary={isInLibrary}
        // setIsInLibrary={setIsInLibrary}
      />

      {/* background image */}
      {/* <Image
        style={styles.imageBg}
        source={
          showData.backdrop_path
            ? {uri: `${imgPrefixOriginal}${showData.backdrop_path}`}
            : require('../assets/images/profile_default.png')
        }
        blurRadius={50}
        progressiveRenderingEnabled
      /> */}
      <ParallaxScrollView
        contentContainerStyle={{
          paddingBottom: 30,
          backgroundColor: theme.background,
        }}
        showsVerticalScrollIndicator={false}
        parallaxHeaderHeight={350}
        backgroundScrollSpeed={1.5}
        renderBackground={() => {
          return (
            <Header
              imagePath={showData.backdrop_path}
              fallbackImagePath={showData.poster_path}
            />
          );
        }}>
        {/* title */}
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>{showData.name}</Text>
          {showData.tagline ? (
            <Text style={styles.subtitle}>{showData.tagline}</Text>
          ) : null}
        </View>
        {/* Ratings */}
        <View style={{...styles.rating}}>
          <Pressable
            onPress={() => {
              if (productionCompany) {
                navigate.push('company', {companyId: productionCompany.id});
              }
            }}
            style={styles.companyLogoContainer}>
            {productionCompany && productionCompany.logo_path ? (
              <FastImage
                source={{
                  uri: `${imgPrefixOriginal}${productionCompany.logo_path}`,
                }}
                style={styles.companyLogo}
                resizeMode="contain"
                tintColor={theme.accent}
              />
            ) : (
              <Text style={{...styles.smallText, color: theme.foreground}}>
                {productionCompany
                  ? productionCompany.name
                  : 'Unknown Production Company'}
              </Text>
            )}
          </Pressable>
          {showData.episode_run_time > 0 ? (
            <Text style={styles.smallText}>
              {showData.episode_run_time} min / episode
            </Text>
          ) : null}
          <View>
            <Text style={styles.ratingAverage}>
              {showData.vote_average
                ? showData.vote_average
                : 'This movie has no ratings yet'}
            </Text>
            {showData.vote_average !== 0 ? (
              <Text style={styles.smallText}>Rating</Text>
            ) : null}
          </View>
        </View>

        {/* Overview */}
        {showData.overview ? (
          <TextBody title="Overview" text={showData.overview} />
        ) : null}

        {/* seasons */}
        <Season data={seasons} showId={showId} />
        {/* watch on */}
        {watchOn.US && watchOn.US.flatrate ? (
          <WatchOn
            data={watchOn.US.flatrate.slice(0, 2)}
            tmdbLink={watchOn.hasOwnProperty('US') ? watchOn.US.link : ''}
          />
        ) : null}

        {/* Images carousel */}
        {showImages.length > 0 ? (
          <ImageCarousel
            originalQuality={false}
            showsIcon={false}
            data={showImages.slice(0, 5)}
          />
        ) : null}

        {/* reviews */}
        {reviews.length > 0 ? (
          <View style={{marginTop: 30}}>
            <Text style={styles.sectionTitle}>
              Reviews, thoughts ({reviews.length})
            </Text>
            {reviews.map(item => {
              return <Comment key={item.id} comment={item} />;
            })}
          </View>
        ) : null}

        {/* Cast */}
        {cast.acting ? (
          <HorizontalProfileList data={cast.acting} title="Cast" />
        ) : null}

        <View style={{marginTop: 30}}>
          <Text
            style={{...styles.text, opacity: 0.5, fontFamily: theme.fontBold}}>
            You've reached the end. What a ride!
          </Text>
          <MaterialCommunityIcons
            name="cat"
            style={{marginBottom: 20, opacity: 0.5, alignSelf: 'center'}}
            color={theme.foreground}
            size={30}
          />
        </View>

        {/* Video */}
        {/* {movieVideo ?
                    <View style={{
                        ...styles.section,
                        marginTop: '10%',
                    }}>

                        <Text style={styles.sectionTitle}>
                            Featured Video
                        </Text>
                        <YouTube
                            apiKey={YT_API_KEY}
                            videoId={movieVideo.key}
                            style={styles.video}
                        />

                    </View> : null
                } */}
      </ParallaxScrollView>
    </View>
  );
}
