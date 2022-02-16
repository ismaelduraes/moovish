import React from 'react'
import { useState, createContext } from 'react'
import { View, StyleSheet, TextInput, StatusBar, SafeAreaView } from 'react-native'

import { ThemeContext } from './Components/Contexts/ThemeContext'
import { themes } from './Components/Contexts/ThemeContext'

import Nav from './Components/Nav'
import Main from './Components/Main'
import MovieScreen from './Components/MovieScreen'
import Search from './Components/Screens/Search'

export const MovieContext = createContext()
export default function App(){
  const [currentTheme, setCurrentTheme] = useState(themes.default)
  const [isOnMovie, setIsOnMovie] = useState(false)
  const [isOnSearch, setIsOnSearch] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(550)

  return(
    <MovieContext.Provider
      value={{
        setSelectedMovie,
        isOnMovie,
        setIsOnMovie,
        isOnSearch,
        setIsOnSearch}}
    >
    <ThemeContext.Provider value={currentTheme}>
    <StatusBar
    backgroundColor={currentTheme.accent}
    />
    <SafeAreaView
      style={{
        ...styles.container,
        backgroundColor: currentTheme.background}}
    >
      <Nav/>
      {
      !isOnMovie && !isOnSearch &&
        <Main
          setIsOnMovie={setIsOnMovie}
          setSelectedMovie={setSelectedMovie}
        />
      }

      {
      isOnSearch &&
      <Search/>
      }

      {
      isOnMovie &&
      <MovieScreen
        id={selectedMovie}
      />
      }
    </SafeAreaView>
    <View style={styles.bgGradient}/>
    </ThemeContext.Provider>
    </MovieContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
})