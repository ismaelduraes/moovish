import React from 'react'
import { useContext, useState } from 'react'
import {
    View,
    Image,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
    Modal
} from 'react-native'

import { ThemeContext } from './Contexts/ThemeContext'
import { imgPrefix } from './Utilities/Utilities'

import { useNavigation } from '@react-navigation/native'

import { default as MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons'
const height = Dimensions.get('screen').height

export default function Episodes({ data, showId, }) {
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()

    const styles = StyleSheet.create({
        section: {
            paddingHorizontal: theme.defaultPadding,
            width: '100%',
        },
        sectionTitle: {
            fontSize: 16,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            marginBottom: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        posterImage: {
            height: 200,
            width: '100%',
            borderRadius: theme.borderRadius / 2,
            backgroundColor: theme.accent,
            marginBottom: 15
        },
        listItem: {
            flexDirection: 'column',
            marginHorizontal: theme.defaultPadding,
            marginBottom: 30,
        },
        text: {
            // marginBottom: 10,
        },
        name: {
            color: theme.foreground,
            fontFamily: theme.fontBold
        },
        episodeCount: {
            color: theme.foreground,
            fontFamily: theme.fontRegular,
        },
        overview: {
            color: theme.foreground,
            fontFamily: theme.fontRegular,
            opacity: 0.5,
            marginTop: 5
        },
        modalContainer: {
            height: '100%',
            width: '100%',
            position: 'absolute',
            backgroundColor: '#000000e6',
            zIndex: 1
        },
        modal: {
            width: '80%',
            height: height * 0.9,
            backgroundColor: 'black',
            alignSelf: 'center'
        }
    })

    return (
        <View>

            <Text
                style={{
                    ...styles.sectionTitle,
                    ...styles.section,
                    marginTop: 30,
                }}
            >
                Episodes ({data.length})
            </Text>

            {data.map((item, index) => {
                return (
                    <Pressable
                        key={index}
                    >
                        <View
                            style={styles.listItem}
                        >
                            <Image
                                style={styles.posterImage}
                                source={
                                    item.still_path ?
                                        { uri: `${imgPrefix}${item.still_path}` } :
                                        require('../assets/images/profile_default.png')}
                            />

                            <View style={styles.text}>
                                <Text style={{
                                    ...styles.name,
                                }}>
                                    {index + 1}. {item.name ? item.name : 'Unknown name'}
                                </Text>
                                <View>
                                    <Text style={styles.overview}>
                                        {item.overview ? item.overview : 'No description for this episode yet.'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Pressable>
                )
            })}
        </View >
    )
}