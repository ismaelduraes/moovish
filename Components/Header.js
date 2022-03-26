import React from "react";
import { useContext } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native'

import { imgPrefixOriginal } from "./Utilities/Utilities";

import FastImage from "react-native-fast-image";

import { ThemeContext } from "./Contexts/ThemeContext";

const width = Dimensions.get('window').width

export default function Header({ imagePath, fallbackImagePath, title, subtitle, resizeMode = "cover", tintColor = null }) {
    const theme = useContext(ThemeContext)
    const styles = StyleSheet.create({
        posterContainer: {
            width: '100%',
            height: 350,
            paddingHorizontal: resizeMode === "contain" ? theme.defaultPadding : 0,
            backgroundColor: theme.accent,
            marginBottom: 25,
        },
        poster: {
            width: '100%',
            height: '100%',
        },
        titleContainer: {
            // alignItems: 'center',
            paddingHorizontal: theme.defaultPadding,
            // top: -25,
            zIndex: 2,
            // marginBottom: 20,
        },
        headerTitle: {
            color: theme.accent,
            fontFamily: theme.fontBold,
            fontSize: 24,
            marginBottom: 5
        },
        subtitle: {
            width: '80%',
            color: theme.foreground,
        },
        headerGradient: {
            height: 350,
            width: '100%',
            position: 'absolute',
            left: 0,
            zIndex: 1,
        },
    })

    return (
        <View>
            <View
                style={styles.posterContainer}
            >
                <FastImage
                    style={styles.poster}
                    source={imagePath ? {
                        uri:
                            `${imgPrefixOriginal}${imagePath ? imagePath : fallbackImagePath}`
                    } : require('../assets/images/profile_default.png')}
                    resizeMode={resizeMode}
                    tintColor={tintColor}
                />
            </View>
            {/* <LinearGradient
            style={styles.headerGradient}
            colors={[
                'rgba(0, 0, 0, 0)',

                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)',
                theme.background,
            ]}
            /> */}

            {/* title */}
            <View style={styles.titleContainer}>
                <View>

                </View>
                <Text style={styles.headerTitle}>
                    {title}
                </Text>
                {subtitle ?
                    <Text style={styles.subtitle}>
                        {subtitle}
                    </Text> : null
                }

            </View>
        </View>
    )
}