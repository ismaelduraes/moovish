import React, { useEffect } from 'react'
import { useState, createContext } from 'react'
import { View, StyleSheet, TextInput, StatusBar, SafeAreaView } from 'react-native'
import Nav from './Components/Nav'
import { ThemeContext } from './Components/Contexts/ThemeContext'
import { themes } from './Components/Contexts/ThemeContext'
import Main from './Components/Main'
import { BlurView } from '@react-native-community/blur'
import MovieScreen from './Components/MovieScreen'

export const MovieContext = createContext()
export default function App(){
  const [currentTheme, setCurrentTheme] = useState(themes.default)
  const [isOnMovie, setIsOnMovie] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(550)

  return(
    <MovieContext.Provider value={{setSelectedMovie, setIsOnMovie}}>
    <ThemeContext.Provider value={currentTheme}>
    <StatusBar
    backgroundColor={currentTheme.accent}
    />
    <SafeAreaView style={{...styles.container, backgroundColor: currentTheme.background}}>
      <Nav/>
      {!isOnMovie &&
        <Main
        setIsOnMovie={setIsOnMovie}
        setSelectedMovie={setSelectedMovie}/>
      }
      {isOnMovie && <MovieScreen
      id={selectedMovie}
      // selectedMovie={selectedMovie}
      />}
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