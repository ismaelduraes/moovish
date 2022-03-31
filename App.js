import React, { useEffect } from 'react'
import { useState, createContext } from 'react'
import {
  StyleSheet,
  StatusBar,
  UIManager,
} from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
const Stack = createNativeStackNavigator()

import { ThemeContext } from './Components/Contexts/ThemeContext'
import { themes } from './Components/Contexts/ThemeContext'

import Main from './Screens/Main'
import MovieScreen from './Screens/MovieScreen'
import TVShowScreen from './Screens/TVShowScreen'
import SearchScreen from './Screens/SearchScreen'
import ProfileScreen from './Screens/ProfileScreen'
import Library from './Screens/Library'

import RNSecureKeyStore from "react-native-secure-key-store";

import { SafeAreaProvider } from 'react-native-safe-area-context'

import { PropsContext } from './Components/Contexts/PropsContext'
import LoginScreen from './Screens/LoginScreen'
import { AuthContext } from './Components/Contexts/AuthContext'
import axios from 'axios'
import CompanyScreen from './Screens/CompanyScreen'
import VerifyEmail from './Screens/VerifyEmail'

import { RECAPTCHA_CLIENT_KEY, RECAPTCHA_CLIENT_KEY_LOCAL } from '@env'

export const MovieContext = createContext()
export default function App() {
  const [currentTheme, setCurrentTheme] = useState(themes.dark)
  const [authTestDone, setAuthTestDone] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [token, setToken] = useState('')
  const [loginData, setLoginData] = useState({})
  //set production=true to make moovish connect to remote api instead of localhost

  const [moovishServer, setMoovishServer] = useState(process.env.production ? 'https://moovish.durev.net' : 'http://localhost:8080')
  const [captchaKey, setCaptchaKey] = useState(process.env.production ? RECAPTCHA_CLIENT_KEY : RECAPTCHA_CLIENT_KEY_LOCAL)

  console.log('connecting to', moovishServer)

  function checkAuth() {
    RNSecureKeyStore.get('auth_token')
      .then(r => {
        setToken(r)
        //check token with server
        axios.get(`${moovishServer}/profile/data`, { headers: { 'auth-token': r } })
          //if success
          .then(res => {
            setIsAuth(true)
            setLoginData(res.data)
            setAuthTestDone(true)
          })
          //if error
          .catch(error => {
            if (error.code === 401) {
              //conection has been denied by server; log user out
              alert('Something went wrong and you have been logged out. Please log back in again.')
              setIsAuth(false)
            }
            else {
              //has token but couldnt connect to moovish servers
              alert('Something went wrong while trying to connect to moovish. Please check your internet connection.')
              setIsAuth(true)
            }
            setAuthTestDone(true)
          })
      })
      .catch(err => {
        setAuthTestDone(true)
      }
      )
  }

  useEffect(() => {
    checkAuth()
  }, [])

  if (Platform.OS === 'android') {
    //setup for layout animations on android
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
      backgroundColor: currentTheme.background
    },
  })

  return authTestDone ? (
    <AuthContext.Provider value={{
      setToken,
      token,
      setIsAuth,
      isAuth,
      setLoginData,
      loginData,
      moovishServer,
      captchaKey
    }}>
      <ThemeContext.Provider value={currentTheme}>
        <PropsContext.Provider value={{ currentTheme, setCurrentTheme }}>
          <SafeAreaProvider>
            <NavigationContainer>

              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="home" component={Main} />
                <Stack.Screen name="movie" component={MovieScreen} />
                <Stack.Screen name="show" component={TVShowScreen} />
                <Stack.Screen name="profile" component={ProfileScreen} />
                <Stack.Screen name="search" component={SearchScreen} />
                <Stack.Screen name="login" component={LoginScreen} />
                <Stack.Screen name="library" component={Library} />
                <Stack.Screen name="company" component={CompanyScreen} />
                <Stack.Screen name="verify" component={VerifyEmail} />
              </Stack.Navigator>

            </NavigationContainer>
          </SafeAreaProvider>
        </PropsContext.Provider>
        <StatusBar
          backgroundColor='transparent' translucent barStyle={
            currentTheme.type == 'light' ? 'dark-content' : 'light-content'}
        />
      </ThemeContext.Provider>
    </AuthContext.Provider>
  ) : null
}