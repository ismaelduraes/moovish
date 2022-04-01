import React, { useState, useContext, useEffect } from 'react'
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    ActivityIndicator
} from 'react-native'

const width = Dimensions.get('window').width

import FastImage from 'react-native-fast-image'

import { ThemeContext } from './Contexts/ThemeContext'
import { TMDB_API_KEY } from '@env'

import axios from 'axios'
import { imgPrefixOriginal } from './Utilities/Utilities'
import Poster from './Poster'

export default function WorthAWatch() {
    const theme = useContext(ThemeContext)
    const [data, setData] = useState()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => fetchData(), [])

    function fetchData() {
        setIsLoading(true)
        const rand = Math.round((Math.random() * 10))
        axios.get(`https://api.themoviedb.org/3/trending/tv/day?api_key=${TMDB_API_KEY}&page=1`)
            .then(r => {
                setData(r.data.results[rand])
                console.log(data)
                setIsLoading(false)
            })
            .catch(e => console.log(e))
    }

    const styles = StyleSheet.create({
        image: {
            width: width,
            height: width * 0.4,
        },
        sectionTitle: {
            fontFamily: theme.fontBold,
            fontSize: 16,
            color: theme.foreground,
            marginBottom: 10,
            paddingHorizontal: theme.defaultPadding
        },
        title: {
            fontFamily: theme.fontRegular,
            fontSize: 14,
            color: theme.foreground,
            marginBottom: 5,
            paddingHorizontal: theme.defaultPadding,
            marginBottom: 30,
            alignSelf: 'center'
        }
    })

    return !isLoading ? (
        <View>
            <Text style={styles.sectionTitle}>
                Worth a watch
            </Text>
            <View style={{ alignSelf: 'center' }}>
                <Poster
                    data={data}
                    width={width - theme.defaultPadding * 2}
                    useBackdrop
                    originalQuality
                    // showText={false}
                    showGradient
                    marginRight={0}
                    marginBottom={40}
                />
            </View>
        </View>
    ) : <ActivityIndicator style={{ alignSelf: 'center' }} color={theme.foreground} />
}