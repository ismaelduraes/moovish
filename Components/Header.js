import React from "react";
import { useContext, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ActivityIndicator
} from 'react-native'

import { imgPrefixOriginal } from "./Utilities/Utilities";

import FastImage from "react-native-fast-image";

import { ThemeContext } from "./Contexts/ThemeContext";

import LinearGradient from "react-native-linear-gradient";

const width = Dimensions.get('window').width

export default function Header({ imagePath, fallbackImagePath, title, subtitle, resizeMode = "cover", tintColor = null }) {
    const theme = useContext(ThemeContext)
    const [isImageLoading, setIsImageLoading] = useState(true)

    const styles = StyleSheet.create({
        posterContainer: {
            width: '100%',
            height: 350,
            paddingHorizontal: resizeMode === "contain" ? theme.defaultPadding : 0,
            backgroundColor: theme.accent,
            marginBottom: 25,
            alignContent: 'center',
            justifyContent: 'center',
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
            fontFamily: theme.fontRegular
        },
        headerGradient: {
            height: 350,
            width: '100%',
            position: 'absolute',
            left: 0,
            zIndex: 1,
            opacity: 0.5,
        },
    })

    return (
        <View>
            <View
                style={styles.posterContainer}
            >
                {isImageLoading ?
                    <ActivityIndicator
                        style={{
                            position: 'absolute',
                            alignSelf: 'center',
                            zIndex: 1,
                        }}
                        size="large"
                        color={theme.background}
                    /> : null
                }
                <FastImage
                    style={styles.poster}
                    source={imagePath ? {
                        uri:
                            `${imgPrefixOriginal}${imagePath ? imagePath : fallbackImagePath}`
                    } : require('../assets/images/profile_default.png')}
                    resizeMode={resizeMode}
                    tintColor={tintColor}
                    onLoad={() => setIsImageLoading(false)}
                />
            </View>
            <LinearGradient
                style={styles.headerGradient}
                colors={[
                    'rgba(0, 0, 0, 0)',
                    'rgba(0, 0, 0, 0)',
                    'rgba(0, 0, 0, 0)',
                    theme.accent,
                ]}
            />

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