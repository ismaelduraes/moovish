import React from 'react'
import { useContext } from 'react'
import {
    View,
    Image,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
} from 'react-native'
import { Link } from 'react-router-native'
import { ThemeContext } from './Contexts/ThemeContext'

import { imgPrefixLow } from './Utilities/Utilities'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default function HorizontalProfileList({data = [], title}){
    const theme = useContext(ThemeContext)
    
    const styles = StyleSheet.create({
        section: {
            paddingHorizontal: theme.defaultPadding,
            marginBottom: 35
        },
        sectionTitle: {
            fontSize: 20,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            marginBottom: 10,
        },
        profileImage: {
            height: 100,
            width: 100,
            borderRadius: 100,
            backgroundColor: theme.accent,
        },
        profileItem: {
            marginRight: 30,
            alignItems: 'center'
        },
        name: {
            color: theme.foreground,
            maxWidth: 150,
            textAlign: 'center',
            paddingHorizontal: '3%',
        },
    })

    return(
        <View>

            <Text
            style={{
                ...styles.sectionTitle,
                ...styles.section
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
            contentContainerStyle={{paddingRight: 30}}
            renderItem={
            (item) => {
                return(
                    <View
                    style={styles.profileItem}
                    key={item.index}
                    >
                        <Link to={`/profile/${item.item.id}`}>
                            <Image
                            style={styles.profileImage}
                            source={item.item.profile_path ?
                                {uri:`${imgPrefixLow}${item.item.profile_path}`}
                                : require('../assets/images/profile_default.png')}
                            />
                        </Link>

                        <Text style={{
                        ...styles.name,
                        marginTop: 10,
                        fontFamily: theme.fontBold,
                        }}>
                            {item.item.name}
                        </Text>
                        
                        {item.item.character &&
                        <Text
                        style={{
                            ...styles.name,
                            marginTop: 0,
                            color: theme.accentLight,
                            opacity: 0.5
                        }}>
                            {item.item.character}
                        </Text>
                        }
                    </View>
                )
                }
            }
            />
        </View>
    )
}