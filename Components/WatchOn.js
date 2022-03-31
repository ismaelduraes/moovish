import React from 'react'
import { useContext, useEffect } from 'react'
import {
    View,
    Image,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    Linking
} from 'react-native'

import { ThemeContext } from './Contexts/ThemeContext'

import { imgPrefixLow } from './Utilities/Utilities'
import { TMDB_API_KEY } from '@env'

import axios from 'axios'

export default function WatchOn({ data, showCharacter = false, tmdbLink = 'https://tmdb.org' }) {
    const theme = useContext(ThemeContext)

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
        logoImage: {
            height: 30,
            width: 30,
            borderRadius: 100,
            backgroundColor: theme.accent,
        },
        listItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.gray,
            borderRadius: theme.borderRadius,
            padding: 10
        },
        name: {
            color: theme.foreground,
            marginLeft: 10
        },
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
                Watch On
            </Text>

            <FlatList
                data={data}
                showsHorizontalScrollIndicator={false}
                horizontal
                style={{
                    ...styles.section,
                    flexDirection: 'row'
                }}
                contentContainerStyle={{ paddingRight: 30, alignItems: 'center' }}
                extraData={this.props}
                renderItem={
                    (item) => {
                        return (
                            <Pressable
                                onPress={() => openLink()}
                                style={{ marginRight: 7 }}
                            >
                                <View
                                    style={styles.listItem}
                                    key={item.index}
                                >
                                    <Image
                                        style={styles.logoImage}
                                        source={
                                            item.item.logo_path ?
                                                { uri: `${imgPrefixLow}${item.item.logo_path}` } :
                                                require('../assets/images/profile_default.png')}
                                    />

                                    <Text style={{
                                        ...styles.name,
                                        fontFamily: theme.fontRegular,
                                    }}>
                                        {item.item.provider_name ? item.item.provider_name : 'Unknown name'}
                                    </Text>

                                    {item.item.character && showCharacter ?
                                        <Text
                                            style={{
                                                ...styles.name,
                                                color: theme.accentLight,
                                            }}>
                                            {item.item.character ? item.item.character : 'Unknown Character'}
                                        </Text> : null
                                    }
                                </View>
                            </Pressable>
                        )
                    }
                }
            />
        </View>
    )
}