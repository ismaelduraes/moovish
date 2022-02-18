import React from 'react'
import { useState, createContext } from 'react'
import {
  StyleSheet,
  StatusBar,
  UIManager,
} from 'react-native'

import { NativeRouter, Route, Routes } from 'react-router-native'

import { ThemeContext } from './Components/Contexts/ThemeContext'
import { themes } from './Components/Contexts/ThemeContext'

import Main from './Screens/Main'
import MovieScreen from './Screens/MovieScreen'
import SearchScreen from './Screens/SearchScreen'
import ProfileScreen from './Screens/ProfileScreen'

export const MovieContext = createContext()
export default function App(){
  const [currentTheme, setCurrentTheme] = useState(themes.light)

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  return(
    <ThemeContext.Provider value={currentTheme}>
    <StatusBar
    backgroundColor={'transparent'}
    barStyle={currentTheme.type == 'light' ? 'dark-content' : 'light-content'}
    translucent
    />
    <NativeRouter>
      <Routes>
        
          <Route path="/" element={<Main/>}/>
          <Route path="/movie/:movieId" element={<MovieScreen/>}/>
          <Route path="/profile/:profileId" element={<ProfileScreen/>}/>
          <Route path="/search" element={<SearchScreen/>}/>

      </Routes>

    </NativeRouter>
    </ThemeContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
})