import React from 'react'
import { useContext } from 'react'
import {
    View,
    Image,
    Text,
    StyleSheet,
    FlatList,
    Touchable
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { ThemeContext } from './Contexts/ThemeContext'

import { imgPrefixLow } from './Utilities/Utilities'
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable'

export default function HorizontalProfileList({ data, title = 'Untitled List', showCharacter = false }) {
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()

    const styles = StyleSheet.create({
        section: {
            paddingHorizontal: theme.defaultPadding,
            // backgroundColor: 'blue',
        },
        sectionTitle: {
            fontSize: 18,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            marginBottom: 10,
        },
        profileImage: {
            height: 70,
            width: 70,
            borderRadius: 100,
            backgroundColor: theme.accent,
        },
        profileItem: {
            alignItems: 'center'
        },
        name: {
            color: theme.foreground,
            width: 70,
            textAlign: 'center',
            fontSize: 12,
            marginRight: 10
        },
    })

    return (
        <View>

            <Text
                style={{
                    ...styles.sectionTitle,
                    ...styles.section,
                    marginTop: 30
                }}
            >
                {title}
            </Text>

            <FlatList
                data={data}
                showsHorizontalScrollIndicator={false}
                horizontal
                style={{
                    ...styles.section,
                    flexDirection: 'row'
                }}
                contentContainerStyle={{ paddingRight: theme.defaultPadding }}
                renderItem={
                    (item) => {
                        return (
                            <Pressable
                                onPress={() => navigation.push('profile', { profileId: item.item.id })}
                                key={item.index}
                            >
                                <View
                                    style={styles.profileItem}
                                >
                                    <Image
                                        style={styles.profileImage}
                                        source={
                                            item.item.profile_path ?
                                                { uri: `${imgPrefixLow}${item.item.profile_path}` } :
                                                require('../assets/images/profile_default.png')}
                                    />

                                    <Text style={{
                                        ...styles.name,
                                        marginTop: 10,
                                        fontFamily: theme.fontRegular,
                                    }}>
                                        {item.item.name ? item.item.name : 'Unknown name'}
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