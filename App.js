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
import SearchScreen from './Screens/SearchScreen'
import ProfileScreen from './Screens/ProfileScreen'
import Library from './Screens/Library'

import RNSecureKeyStore from "react-native-secure-key-store";

import { SafeAreaProvider } from 'react-native-safe-area-context'

import { PropsContext } from './Components/Contexts/PropsContext'
import LoginScreen from './Screens/LoginScreen'
import { AuthContext } from './Components/Contexts/AuthContext'
import axios from 'axios'

export const MovieContext = createContext()
export default function App() {
  const [currentTheme, setCurrentTheme] = useState(themes.dark)
  const [authTestDone, setAuthTestDone] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [token, setToken] = useState('')
  const [loginData, setLoginData] = useState({})

  function checkAuth() {
    RNSecureKeyStore.get('auth_token')
      .then(r => {
        setToken(r)
        console.log('token:', r)
        //check token with server
        axios.get('http://192.168.15.10:8080/profile/data', { headers: { 'auth-token': r } })
          //if success
          .then(res => {
            console.log('token apparently retrieved')
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
            alert('not authenticated')
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
      loginData
    }}>
      <ThemeContext.Provider value={currentTheme}>
        <PropsContext.Provider value={{ currentTheme, setCurrentTheme }}>
          <SafeAreaProvider>
            <NavigationContainer>

              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="home" component={Main} />
                <Stack.Screen name="movie" component={MovieScreen} />
                <Stack.Screen name="profile" component={ProfileScreen} />
                <Stack.Screen name="search" component={SearchScreen} />
                <Stack.Screen name="login" component={LoginScreen} />
                <Stack.Screen name="library" component={Library} />
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