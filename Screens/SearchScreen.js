import React from "react"
import {
    useContext,
    useState,
    useEffect,
    useRef
} from "react"

import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    Image,
    Dimensions,
    Pressable
} from 'react-native'

import MasonryList from '@react-native-seoul/masonry-list';
import { useNavigation } from "@react-navigation/native"
import { default as MaterialIcons } from 'react-native-vector-icons/MaterialIcons'
import { default as Feather } from 'react-native-vector-icons/Feather'

import axios from "axios"

import { ThemeContext } from "../Components/Contexts/ThemeContext"
import { TMDB_API_KEY } from '@env'
import { imgPrefix } from "../Components/Utilities/Utilities"
import { SafeAreaView } from "react-native-safe-area-context"
const width = Dimensions.get('window').width

export default function SearchScreen() {
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()
    const searchInput = useRef()

    const [isLoading, setIsLoading] = useState(false)

    const [results, setResults] = useState([])
    const [query, setQuery] = useState('')
    const [input, setInput] = useState('')

    function fetchData() {
        setIsLoading(true)
        axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&page=1`)
            .then(r => {
                setIsLoading(false)
                setResults(r.data.results)
            })
    }

    useEffect(() => {
        if (query) fetchData()
    }, [query])

    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: theme.background,
            paddingTop: 25
        },
        searchBarContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            paddingHorizontal: theme.defaultPadding
        },
        scrollView: {
            marginTop: 40,
            height: '100%',
            width: '100%',
        },
        scrollViewContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        sectionTitleText: {
            paddingHorizontal: theme.defaultPadding,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            fontSize: 30,
            marginBottom: 15,
            marginTop: 50,
        },
        searchBar: {
            paddingHorizontal: 15,
            height: 40,

            flexDirection: 'row',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'space-between',

            width: '80%',
            borderRadius: theme.borderRadius,
            overflow: 'hidden',
            backgroundColor: theme.gray,
        },
        searchBarInput: {
            overflow: 'hidden',
            fontFamily: theme.fontRegular,
            fontSize: 18,
            color: theme.foreground,
            height: '100%',
            width: '90%',
        },
        resultImage: {
            height: '75%',
            borderRadius: theme.borderRadius,
            alignSelf: 'center'
        },
        resultText: {
            fontFamily: theme.fontBold,
            fontSize: 20,
            color: theme.foreground,
            paddingHorizontal: theme.defaultPadding,
            marginTop: 20,
            marginBottom: 20
        },
    })

    function ResultItem({ item, index }) {
        return (
            <Pressable
                style={{
                    width: '90%',
                    alignSelf: 'center'
                }}
                onPress={() => navigation.push('movie', { movieId: item.id })}>
                <View>
                    <Image
                        source={{ uri: `${imgPrefix}${item.popularity > 150 ? item.backdrop_path : item.poster_path}` }}
                        style={{
                            ...styles.resultImage,
                            width: '100%',
                            height: 220
                        }}
                    />
                    <Text style={styles.resultText}>
                        {item.title}
                    </Text>
                </View>
            </Pressable>
        )
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.searchBarContainer}>
                <Feather
                    name="arrow-left"
                    size={25}
                    color={theme.foreground}
                    style={{ width: '10%' }}
                    onTouchEnd={() => navigation.navigate('home')}
                />
                <View style={styles.searchBar}>
                    <MaterialIcons
                        name='search'
                        size={15}
                        color={theme.foreground}
                        style={{ marginRight: 15 }}
                    />
                    <TextInput
                        ref={searchInput}
                        style={styles.searchBarInput}
                        placeholder="Search..."
                        placeholderTextColor={theme.foreground}
                        onChangeText={e => {
                            setInput(e)
                        }}
                        onEndEditing={() => {
                            setQuery(input)
                        }}
                        onLayout={() => { searchInput.current.focus() }}
                    />
                </View>
            </View>
            {/* {console.log(results)} */}
            <MasonryList
                data={results}
                renderItem={ResultItem}
                numColumns={2}
                containerStyle={{ marginTop: 30, paddingHorizontal: theme.defaultPadding }}
                onRefresh={() => fetchData}
                refreshing={isLoading}
            />
        </SafeAreaView>
    )
}