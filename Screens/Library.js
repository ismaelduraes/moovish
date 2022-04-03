import axios from 'axios';
import React, {useEffect} from 'react';
import {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  NativeModules,
  Pressable,
} from 'react-native';
import {AuthContext} from '../Components/Contexts/AuthContext';

import {getStatusBarHeight} from 'react-native-status-bar-height';

import {ThemeContext} from '../Components/Contexts/ThemeContext';
import Modal from '../Components/Modal';
import MovieVerticalList from '../Components/MovieVerticalList';
import {useIsFocused} from '@react-navigation/native';

import DropShadow from 'react-native-drop-shadow';
import BottomPopUp from '../Components/BottomPopUp';
import Loading from '../Components/Loading';

import {useNavigation} from '@react-navigation/native';
import RNSecureKeyStore from 'react-native-secure-key-store';

import {default as Feather} from 'react-native-vector-icons/Feather';
import {default as FontAwesome5} from 'react-native-vector-icons/FontAwesome5';
import {default as MaterialIcons} from 'react-native-vector-icons/MaterialIcons';

export default function Library() {
  const theme = useContext(ThemeContext);
  const contextAuth = useContext(AuthContext);

  const navigation = useNavigation();

  const [toWatchMovies, setToWatchMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  //0 is to watch list, 1 is watched
  const [currentScreen, setCurrentScreen] = useState(0);

  //pendingModal being active means a modal is currently open
  //and waiting for user action.
  //this state also gets the movie id to use as argument for the deleteMovie
  //function.
  //state is set by the MovieVerticalList component by passing setPendingModal
  //as props
  const [pendingModal, setPendingModal] = useState({isActive: false});
  //same concept as pending modal
  const [pendingPopUpState, setPendingPopUpState] = useState({isActive: false});

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  //refetch when screen is focused. useful for when the user opens a movie,
  //removes it from library and then navigates back to this screen.
  //this makes it so changes made in other screens will be
  //taken into account when navigating back to this.
  const isFocused = useIsFocused();

  //separate movies into watched and to watch
  function parseMovies(data) {
    let toWatch = [];
    let watched = [];

    //push not watched movies to toWatch list
    data.forEach(item => {
      if (item.watched) watched.push(item);
      else toWatch.push(item);
    });

    setToWatchMovies(toWatch.reverse());
    setWatchedMovies(watched.reverse());
  }

  async function fetchData() {
    setIsLoading(true);
    axios
      .get(`${contextAuth.moovishServer}/profile/library`, {
        headers: {'auth-token': contextAuth.token},
      })
      .then(res => {
        parseMovies(res.data);
        setIsLoading(false);
      })
      .catch(e => setIsError(true));
  }

  function deleteMovie() {
    axios
      .delete(
        `${contextAuth.moovishServer}/profile/library/${pendingModal.movieId}`,
        {headers: {'auth-token': contextAuth.token}},
      )
      .then(() => {
        fetchData();
        setPendingModal({isActive: false});
        setPendingPopUpState({isActive: true, text: 'Removed from library.'});
      })
      .catch(e => setIsError(true));
  }

  function setWatched() {
    //change watched to true
    axios
      .patch(
        `${contextAuth.moovishServer}/profile/library/`,
        {movie_id: pendingModal.movieId, watched: true},
        {headers: {'auth-token': contextAuth.token}},
      )
      .then(() => {
        fetchData();
        setPendingModal({isActive: false});
        setPendingPopUpState({
          isActive: true,
          text: 'Moved to "Watched" list.',
        });
      })
      .catch(e => console.warn('error:', e));
  }

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      width: '100%',
      height: '100%',
      position: 'absolute',
    },
    username: {
      color: theme.accent,
      fontFamily: theme.fontRegular,
    },
    titleContainer: {
      paddingHorizontal: theme.defaultPadding,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: getStatusBarHeight() + 20,
    },
    screenTitle: {
      fontSize: 30,
      fontFamily: theme.fontBold,
      color: theme.foreground,
      // width: '100%',
    },
    navigation: {
      width: '100%',

      flexDirection: 'row',
      alignItems: 'center',
      // justifyContent: 'center','

      marginHorizontal: theme.defaultPadding,

      marginTop: 30,
      marginBottom: 20,
    },
    navigationItem: {
      padding: 10,
      paddingHorizontal: 20,
      borderRadius: 30,
    },
  });

  if (isLoading) return <Loading isError={isError} />;
  else
    return (
      <View style={styles.container}>
        {pendingPopUpState.isActive ? (
          <BottomPopUp
            popUpState={pendingPopUpState}
            setPopUpState={setPendingPopUpState}
          />
        ) : null}

        {pendingModal.isActive ? (
          <Modal
            title={pendingModal.title}
            text={pendingModal.text}
            confirmAction={
              pendingModal.type === 'delete' ? deleteMovie : setWatched
            }
            cancelAction={pendingModal.cancelAction}
          />
        ) : null}

        <View style={styles.titleContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Feather
              onPress={() => navigation.goBack()}
              style={styles.icon}
              name="arrow-left"
              size={30}
              color={theme.foreground}
            />
            <View style={{marginLeft: 15}}>
              <Text style={styles.screenTitle}>Library</Text>
              <Text style={styles.username}>
                Logged in as {contextAuth.loginData.username}
              </Text>
            </View>
          </View>
          <Feather
            onPress={() => {
              RNSecureKeyStore.remove('auth_token')
                .then(() => {
                  //log user out
                  contextAuth.setIsAuth(false);
                  //go back to home
                  navigation.navigate('home');
                })
                .catch(() => navigation.navigate('home'));
            }}
            style={styles.icon}
            name="log-out"
            size={25}
            color={theme.foreground}
          />
        </View>

        <View style={styles.navigation}>
          <DropShadow
            style={{
              shadowColor: theme.accent,
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: currentScreen === 0 ? 0.3 : 0,
              shadowRadius: 20,
            }}>
            <Pressable
              onPress={() => setCurrentScreen(0)}
              style={{
                ...styles.navigationItem,
                marginRight: 15,
                fontFamily:
                  currentScreen === 0 ? theme.fontBold : theme.fontRegular,
                backgroundColor:
                  currentScreen === 0 ? theme.accent : 'transparent',
                color:
                  currentScreen === 0 ? theme.background : theme.foreground,
              }}>
              <Text
                style={{
                  fontFamily: theme.fontBold,
                  color:
                    currentScreen === 0 ? theme.background : theme.foreground,
                }}>
                To Watch
              </Text>
            </Pressable>
          </DropShadow>
          <DropShadow
            style={{
              shadowColor: theme.accent,
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: currentScreen === 0 ? 0 : 0.3,
              shadowRadius: 20,
            }}>
            <Pressable
              onPress={() => setCurrentScreen(1)}
              style={{
                ...styles.navigationItem,
                fontFamily:
                  currentScreen === 1 ? theme.fontBold : theme.fontRegular,
                backgroundColor:
                  currentScreen === 1 ? theme.accent : 'transparent',
              }}>
              <Text
                style={{
                  fontFamily: theme.fontBold,
                  color:
                    currentScreen === 1 ? theme.background : theme.foreground,
                }}>
                Watched
              </Text>
            </Pressable>
          </DropShadow>
        </View>

        {toWatchMovies.length < 1 && watchedMovies.length < 1 ? (
          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              opacity: 0.2,
              marginTop: '50%',
            }}>
            <FontAwesome5 name="crow" color={theme.foreground} size={30} />
            <Text
              style={{
                fontFamily: theme.fontBold,
                color: theme.foreground,
                fontSize: 20,
                textAlign: 'center',
                maxWidth: '70%',
              }}>
              This is your movies library! But... there's nothing here yet!?
            </Text>
          </View>
        ) : null}

        <FlatList
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 20,
          }}
          style={{zIndex: 0}}
          showsVerticalScrollIndicator={false}
          data={currentScreen === 0 ? toWatchMovies : watchedMovies}
          renderItem={item => {
            return (
              <MovieVerticalList
                movieId={item.item.movie_id}
                key={item.item.item_id}
                //pass pendingModal state to component
                //so it can communicate with this through modal
                setPendingModal={setPendingModal}
                //let component know if it should behave as watched or to watch
                isWatched={currentScreen === 1 ? true : false}
              />
            );
          }}></FlatList>
      </View>
    );
}
