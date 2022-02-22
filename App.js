import React from 'react'
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
import NavigationTab from './Components/NavigationTab'

import { SafeAreaProvider } from 'react-native-safe-area-context'

import { PropsContext } from './Components/Contexts/PropsContext'

export const MovieContext = createContext()
export default function App(){
  const [currentTheme, setCurrentTheme] = useState(themes.dark)

  if (Platform.OS === 'android') {
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

  return(
    <ThemeContext.Provider value={currentTheme}>
    <SafeAreaProvider>
    <PropsContext.Provider value={{currentTheme, setCurrentTheme}}>
      <NavigationContainer>
  
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="navigationTab" component={NavigationTab}/>
          <Stack.Screen name="home" component={Main}/>
          <Stack.Screen name="movie" component={MovieScreen}/>
          <Stack.Screen name="profile" component={ProfileScreen}/>
          <Stack.Screen name="search" component={SearchScreen}/>
          <Stack.Screen name="login" component={SearchScreen}/>
        </Stack.Navigator>

      </NavigationContainer>
    </PropsContext.Provider>
    </SafeAreaProvider>
    <StatusBar
    backgroundColor='transparent' translucent barStyle={
    currentTheme.type == 'light' ? 'dark-content' : 'light-content'}
    />
    </ThemeContext.Provider>
  )
}