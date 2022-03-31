import React from 'react'
import { useContext, useState } from 'react'
import {
    View,
    Image,
    Text,
    StyleSheet,
    Pressable,
    Linking,
    LayoutAnimation
} from 'react-native'

import { ThemeContext } from './Contexts/ThemeContext'
import { imgPrefixLow } from './Utilities/Utilities'


import { default as MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons'

export default function Season({ data, showCharacter = false, tmdbLink = 'https://tmdb.org' }) {
    const theme = useContext(ThemeContext)
    const [showAll, setShowAll] = useState(false)

    const styles = StyleSheet.create({
        section: {
            paddingHorizontal: theme.defaultPadding,
            width: '100%',
        },
        sectionTitle: {
            fontSize: 16,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            marginBottom: 10,
            alignItems: 'center',
            justifyContent: 'center',
        },
        posterImage: {
            height: 50 * 1.4,
            width: 50,
            borderRadius: theme.borderRadius / 2,
            backgroundColor: theme.accent,
        },
        listItem: {
            flexDirection: 'row',
            backgroundColor: theme.gray,
            borderRadius: theme.borderRadius,
            padding: 10,
            marginHorizontal: theme.defaultPadding,
            marginTop: 10
        },
        text: {
            marginLeft: 10,
            justifyContent: 'center',
        },
        name: {
            color: theme.foreground,
            fontFamily: theme.fontBold
        },
        episodeCount: {
            color: theme.foreground,
            fontFamily: theme.fontRegular,
        },
        airDate: {
            color: theme.foreground,
            fontFamily: theme.fontRegular,
            opacity: 0.3
        },
        showMore: {
            justifyContent: 'center',
            marginTop: 15,
            width: 130,
            alignSelf: 'center',
            borderRadius: theme.borderRadius * 2,
            backgroundColor: theme.accent,
            padding: 10
        }
    })

    function openLink() {
        Linking.openURL(tmdbLink ? tmdbLink : 'https://tmdb.com')
    }

    return (
        <View>

            <Text
                style={{
                    ...styles.sectionTitle,
                    ...styles.section,
                    marginTop: 30,
                }}
            >
                Seasons ({data.length})
            </Text>

            {data.slice(0, showAll ? data.length : 3).map((item, index) => {
                return (
                    <Pressable
                        onPress={() => openLink()}
                        style={{ marginRight: 7 }}
                        key={index}
                    >
                        <View
                            style={styles.listItem}
                        >
                            <Image
                                style={styles.posterImage}
                                source={
                                    item.poster_path ?
                                        { uri: `${imgPrefixLow}${item.poster_path}` } :
                                        require('../assets/images/profile_default.png')}
                            />

                            <View style={styles.text}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{
                                        ...styles.name,
                                    }}>
                                        {item.name ? item.name : 'Unknown name'}
                                    </Text>
                                    <MaterialCommunityIcons
                                        name="chevron-right"
                                        color={theme.foreground}
                                        size={16}
                                        style={{ marginRight: 15 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.episodeCount}>
                                        {item.episode_count ? item.episode_count + ' Episodes' : ''}
                                    </Text>
                                    <Text style={styles.airDate}>
                                        {item.air_date ? item.air_date.replaceAll('-', '/') : ''}
                                    </Text>
                                </View>
                            </View>

                            {item.character && showCharacter ?
                                <Text
                                    style={{
                                        ...styles.name,
                                        color: theme.accentLight,
                                    }}>
                                    {item.character ? item.character : 'Unknown Character'}
                                </Text> : null
                            }
                        </View>
                    </Pressable>
                )
            })}
            {data.length > 3 ? <Pressable
                style={styles.showMore}
                onPress={() => {
                    LayoutAnimation.configureNext({
                        duration: 500,
                        update: {
                            type: 'spring',
                            springDamping: 0.7,
                        },
                    })
                    setShowAll(!showAll)
                }}
            >
                <Text style={{ ...styles.name, textAlign: 'center', color: theme.background }}>
                    {showAll ? 'Show less...' : 'Show all...'}
                </Text>
            </Pressable> : null}
        </View >
    )
}