import React from 'react';
import {useState, useLayoutEffect, useContext} from 'react';
import {Text, StyleSheet, View, Dimensions} from 'react-native';
import axios from 'axios';

import ParallaxScrollView from 'react-native-parallax-scroll-view';

import {TMDB_API_KEY} from '@env';
import Header from '../Components/Header';
import {ThemeContext} from '../Components/Contexts/ThemeContext';
import TextBody from '../Components/TextBody';
import ImageCarousel from '../Components/ImageCarousel';

import NavButtons from '../Components/NavButtons';
import AndroidStatusBarGradient from '../Components/AndroidStatusBarGradient';
import Loading from '../Components/Loading';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function ProfileScreen({route}) {
  const profileId = route.params.profileId;
  const theme = useContext(ThemeContext);

  const [profileData, setProfileData] = useState({});
  const [loading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  function fetchData() {
    axios
      .get(
        `https://api.themoviedb.org/3/person/${profileId}?api_key=${TMDB_API_KEY}&append_to_response=images`,
      )
      .then(r => {
        setProfileData(r.data);
        setIsLoading(true);
      })
      .catch(() => setIsError(true));
  }

  useLayoutEffect(() => {
    fetchData();
  }, []);

  const styles = StyleSheet.create({
    container: {
      height,
      width,
      backgroundColor: theme.background,
    },
    imageBg: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      opacity: theme.type === 'light' ? 0.3 : 0.1,
    },
    titleContainer: {
      // alignItems: 'center',
      paddingHorizontal: theme.defaultPadding,
      zIndex: 2,
      marginTop: 25,
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

  if (!loading) return <Loading isError={isError} />;
  else
    return (
      <View style={styles.container}>
        <AndroidStatusBarGradient />
        <NavButtons personId={profileId} />
        {/* <Image
                style={styles.imageBg}
                source={{ uri: `${imgPrefixOriginal}${profileData.profile_path}` }}
                blurRadius={50}
            /> */}
        <ParallaxScrollView
          contentContainerStyle={{
            paddingBottom: 30,
            backgroundColor: theme.background,
          }}
          parallaxHeaderHeight={350}
          showsVerticalScrollIndicator={false}
          backgroundScrollSpeed={1.5}
          renderBackground={() => {
            return (
              <Header
                imagePath={profileData.profile_path}
                fallbackImagePath={profileData.poster_path}
              />
            );
          }}>
          {/* title */}
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>{profileData.name}</Text>
            {profileData.known_for_department ? (
              <Text style={styles.subtitle}>
                Known for {profileData.known_for_department.toLowerCase()}
              </Text>
            ) : null}
          </View>
          <TextBody
            style={styles.section}
            title="Biography"
            text={
              profileData.biography
                ? profileData.biography
                : 'No biography is available for this person'
            }
            hideIfLong
          />
          <View style={{flexDirection: 'row'}}>
            <TextBody
              style={styles.section}
              title="Born in"
              text={
                profileData.place_of_birth
                  ? profileData.place_of_birth
                  : 'Unknown'
              }
              hideIfLong
              marginBottom={50}
              width="33%"
            />
            <TextBody
              style={styles.section}
              title="Gender"
              text={profileData.gender === 1 ? 'Female' : 'Male'}
              hideIfLong
              width="33%"
            />
            <TextBody
              style={styles.section}
              title="Birthday"
              text={
                profileData.birthday
                  ? profileData.birthday.replaceAll('-', '/')
                  : 'Unknown'
              }
              hideIfLong
              width="33%"
            />
          </View>
          <ImageCarousel
            data={profileData.images.profiles.slice(0, 20)}
            isSquare
            canChangeResize
          />
        </ParallaxScrollView>
      </View>
    );
}
