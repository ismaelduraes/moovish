import axios from 'axios';
import React from 'react';
import {useContext, useState, useRef} from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  LayoutAnimation,
} from 'react-native';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';

import {getStatusBarHeight} from 'react-native-status-bar-height';
import {default as MaterialCommunityIcons} from 'react-native-vector-icons/MaterialCommunityIcons';
import Recaptcha from 'react-native-recaptcha-that-works';

import {ThemeContext} from '../Components/Contexts/ThemeContext';
import {AuthContext} from '../Components/Contexts/AuthContext';
import {useNavigation} from '@react-navigation/native';

import Modal from '../Components/Modal';

import Loading from '../Components/Loading';

export default function LoginScreen() {
  const theme = useContext(ThemeContext);
  const contextAuth = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  //sign up
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  //↓ this is the email input used for signing up. for signing in, the username variable
  //is used (its value can be an email).
  const [email, setEmail] = useState('');
  const [hasAccount, setHasAccount] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const recaptcha = useRef();

  const [pendingModal, setPendingModal] = useState({isActive: false});

  const navigation = useNavigation();

  function verifyLogin() {
    if (
      username.length < 6 &&
      username.length > 12 &&
      password.length < 8 &&
      password.length > 12
    ) {
      setPendingModal({
        isActive: true,
        title: "Couldn't sign you in.",
        text: 'Make sure your username is over 6 characters long (and below 12), and your password is over 8 characters long (and below 20).',
      });
      return;
    }
    login();
  }

  function verifySignup() {
    function validateEmail(email) {
      return !!email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
    }
    function validateUsername(username) {
      const test = /^[a-zA-Z0-9_\.]+$/.test(username);
      return test;
    }
    function validatePassword(password) {
      const test =
        /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/.test(
          password,
        );
      return test;
    }

    if (!validateUsername(username) || !validatePassword(password)) {
      setPendingModal({
        isActive: true,
        title: "Couldn't sign you up.",
        text: 'Make sure your username is over 6 characters long, and your password is over 8 characters long.\n\nYou can only use letters, numbers, underscores (_) and dots (.) on your username.\n\nYou need to have at least 1 uppercase and lowercase letter, 1 number, and 1 symbol on your password.',
      });
      return;
    }
    if (password !== passwordConfirmation) {
      setPendingModal({
        isActive: true,
        title: "Couldn't sign you up.",
        text: "Your password and password confirmation don't match",
      });
      return;
    }
    if (!validateEmail(email)) {
      setPendingModal({
        isActive: true,
        title: "Couldn't sign you up.",
        text: 'You need to input a valid e-mail address.',
      });
      return;
    }
    recaptcha.current.open();
  }

  async function login() {
    //some keyboards add spaces at the end of inputs.
    //this removes any spaces added to the username and password,
    //since they aren't valid anyways.
    const usernameFixed = username.trim();
    const passwordFixed = password.trim();

    setIsLoading(true);
    axios
      .post(`${contextAuth.moovishServer}/login`, {
        username: usernameFixed,
        password: passwordFixed,
      })
      .then(res => {
        setIsLoading(false);
        if (res.data.verified) {
          // set token
          RNSecureKeyStore.set('auth_token', res.data.token, {
            accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK,
          })
            .then(() => {
              alert('logged in successfully');
              contextAuth.setToken(res.data.token);
              contextAuth.setIsAuth(true);
              navigation.navigate('home');
            })
            .catch(e => {
              alert(
                `Something went wrong and moovish couldn't store your user data. ${e}`,
              );
            });
          // get user data (username, email, uuid)
          axios
            .get(`${contextAuth.moovishServer}/profile/data`, {
              headers: {'auth-token': res.data.token},
            })
            .then(res => {
              contextAuth.setLoginData(res.data);
            });
        } else {
          setIsLoading(false);
          navigation.push('verify', {email: res.data.email});
        }
      })
      //handle errors
      .catch(err => {
        setIsLoading(false);
        if (err.response) {
          if (err.response.status === 401) {
            setPendingModal({
              isActive: true,
              title: "Couldn't sign you in.",
              text: 'Incorrect username or password.',
            });
          } else
            setPendingModal({
              isActive: true,
              title: "Couldn't sign you in.",
              text:
                "Something went wrong and you couldn't be signed in." +
                err.response.data,
            });
        } else alert(err);
      });
  }

  async function signup(token) {
    setIsLoading(true);
    axios
      .post(`${contextAuth.moovishServer}/profile`, {
        email,
        username,
        password,
        captcha: token,
      })
      .then(res => {
        setIsLoading(false);
        navigation.push('verify', {email: email});
      })
      //handle errors
      .catch(err => {
        setIsLoading(false);
        switch (err.response.data) {
          case 'email or username exist':
            setPendingModal({
              isActive: true,
              title: "Couldn't sign you in.",
              text: 'The e-mail and username you selected are already in use by another account',
            });
            break;
          case 'captcha failed':
            setPendingModal({
              isActive: true,
              title: "Couldn't sign you in.",
              text: 'Captcha failed.',
            });
            break;
          case 'username exists':
            setPendingModal({
              isActive: true,
              title: "Couldn't sign you in.",
              text: 'The username you selected is already in use by another account',
            });
            break;
          case 'email exists':
            setPendingModal({
              isActive: true,
              title: "Couldn't sign you in.",
              text: 'The e-mail you selected is already in use by another account',
            });
            break;
          default:
            setPendingModal({
              isActive: true,
              title: "Couldn't sign you in.",
              text: "Something went wrong and you couldn't be signed in.",
            });
            break;
        }
      });
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',

      height: '100%',
    },
    closeButtonContainer: {
      // height: '10%',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      paddingHorizontal: theme.defaultPadding,
      marginTop: getStatusBarHeight() + 20,
    },
    title: {
      fontFamily: theme.fontBold,
      fontSize: 30,
      textAlign: 'center',
      marginTop: 25,
      paddingHorizontal: '7%',
      color: theme.foreground,
      marginBottom: 50,
    },
    inputContainer: {
      width: '100%',
      marginBottom: 25,
    },
    input: {
      fontFamily: theme.fontRegular,

      width: '90%',
      maxWidth: '90%',
      alignSelf: 'center',

      color: theme.foreground,

      paddingHorizontal: '5%',
      paddingVertical: 10,

      backgroundColor: theme.gray,
      borderRadius: theme.borderRadius,
    },
    label: {
      fontFamily: theme.fontRegular,

      width: '90%',
      alignSelf: 'center',

      paddingHorizontal: '5%',
      marginBottom: 5,

      color: theme.foreground,
    },
    signIn: {
      backgroundColor: theme.accent,
      padding: '3%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
    },
    signInText: {
      color: theme.background,
      fontFamily: theme.fontBold,
      paddingHorizontal: '5%',
    },
  });

  if (isLoading) return <Loading />;
  else
    return (
      <View style={styles.container}>
        <View style={styles.closeButtonContainer}>
          <Pressable style={styles.closeButton}>
            <MaterialCommunityIcons
              name="arrow-left"
              color={theme.foreground}
              size={20}
              onPress={() => navigation.navigate('home')}
            />
          </Pressable>
        </View>
        <ScrollView
          contentContainerStyle={styles.container}
          pointerEvents="box-none">
          {pendingModal.isActive ? (
            <Modal
              title={pendingModal.title}
              text={pendingModal.text}
              hasCancelButton={false}
              confirmAction={() => setPendingModal({isActive: false})}
            />
          ) : null}

          <MaterialCommunityIcons
            name="movie-open"
            size={90}
            color={theme.accent}
          />
          <Text style={styles.title}>
            Your favorite movies, one button away.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {hasAccount ? 'E-mail/username' : 'E-mail'}
            </Text>
            <TextInput
              placeholder={
                hasAccount
                  ? 'Your moovish username or e-mail'
                  : 'Your e-mail address'
              }
              style={styles.input}
              placeholderTextColor={theme.foreground + '4c'}
              onChangeText={text =>
                hasAccount ? setUsername(text) : setEmail(text)
              }
              maxLength={60}
            />
          </View>

          {!hasAccount ? (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                placeholder="Your new moovish username"
                style={styles.input}
                placeholderTextColor={theme.foreground + '4c'}
                onChangeText={text => setUsername(text)}
                maxLength={12}
              />
            </View>
          ) : null}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Your password"
              style={styles.input}
              placeholderTextColor={theme.foreground + '4c'}
              onChangeText={text => setPassword(text)}
              textContentType={'password'}
              secureTextEntry={true}
              maxLength={20}
            />
          </View>

          {!hasAccount ? (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                placeholder="Your password"
                style={styles.input}
                placeholderTextColor={theme.foreground + '4c'}
                onChangeText={text => setPasswordConfirmation(text)}
                textContentType={'password'}
                secureTextEntry={true}
                maxLength={20}
              />
            </View>
          ) : null}
          <Recaptcha
            siteKey={contextAuth.captchaKey}
            baseUrl={`${contextAuth.moovishServer}`}
            onVerify={token => {
              signup(token);
            }}
            size="normal"
            ref={recaptcha}
            onError={() =>
              setPendingModal({
                isActive: true,
                title: 'Captcha not verified',
                text: 'Sorry, our systems could not verify you are a human.',
              })
            }
          />

          <Pressable
            style={styles.signIn}
            onPress={() => {
              if (!hasAccount) {
                verifySignup();
                return;
              }
              verifyLogin();
            }}>
            <Text style={styles.signInText}>
              {hasAccount ? 'Sign in' : 'Sign Up'}
            </Text>
          </Pressable>

          <Pressable
            style={{
              flexDirection: hasAccount ? 'row-reverse' : 'row',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: 60,
            }}
            onPress={() => {
              setHasAccount(!hasAccount);
              LayoutAnimation.configureNext({
                duration: 500,
                update: {type: 'spring', springDamping: 0.5},
              });
            }}>
            <MaterialCommunityIcons
              name={hasAccount ? 'arrow-right' : 'arrow-left'}
              color={theme.accent}
            />
            <Text
              style={{
                color: theme.accent,
                fontFamily: theme.fontBold,
              }}>
              {hasAccount
                ? "Don't have an account?"
                : 'I already have an account'}
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    );
}
