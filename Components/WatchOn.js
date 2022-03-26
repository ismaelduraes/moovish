import React from 'react'
import { useContext } from 'react'
import {
    View,
    Image,
    Text,
    StyleSheet,
    FlatList,
    Pressable
} from 'react-native'

import { ThemeContext } from './Contexts/ThemeContext'

import { imgPrefixLow } from './Utilities/Utilities'

export default function WatchOn({ data, showCharacter = false }) {
    const theme = useContext(ThemeContext)

    console.log(data)

    const styles = StyleSheet.create({
        section: {
            paddingHorizontal: theme.defaultPadding,
            width: '100%',
            // backgroundColor: 'blue',
        },
        sectionTitle: {
            fontSize: 16,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            marginBottom: 5,
            alignItems: 'center',
            justifyContent: 'center',
        },
        logoImage: {
            height: 40,
            width: 40,
            borderRadius: 100,
            backgroundColor: theme.accent,
        },
        listItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.gray,
            borderWidth: 3,
            borderRadius: theme.borderRadius,
            padding: 10
        },
        name: {
            color: theme.foreground,
            marginLeft: 15
        },
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
                renderItem={
                    (item) => {
                        return (
                            <Pressable
                                onPress={() => navigation.push('profile', { profileId: item.item.id })}
                                style={{ marginRight: 7 }}
                            >
                                <View
                                    style={styles.listItem}
                                    key={item.item.id + item.index}
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
                                        marginTop: 10,
                                        fontFamily: theme.fontBold,
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