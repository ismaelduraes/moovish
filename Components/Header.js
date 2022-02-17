import React from "react";
import { useContext } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native'

import { default as AntDesign } from "react-native-vector-icons/AntDesign";
import LinearGradient from "react-native-linear-gradient";
import { imgPrefixOriginal } from "./Utilities/Utilities";

import { Link } from "react-router-native";

import { ThemeContext } from "./Contexts/ThemeContext";

const width = Dimensions.get('window').width

export default function Header({imagePath, title}){
    const theme = useContext(ThemeContext)
    const styles = StyleSheet.create({
        poster: {
            width: '100%',
            height: 350,
        },
        titleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: theme.defaultPadding,
            top: -25,
            zIndex: 2
        },
        headerTitle: {
            color: theme.accentLight,
            fontFamily: theme.fontBold,
            fontSize: 30,
            maxWidth: width*0.5,
            textAlign: 'center',
            marginBottom: 5
        },
        headerGradient: {
            height: 350,
            width: '100%',
            position: 'absolute',
            left: 0,
            zIndex: 1,
        },
    })

    return(
        <View>
            <LinearGradient
            style={styles.headerGradient}
            colors={[
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)',
                theme.background,
            ]}
            />
            <Image
                style={styles.poster}
                source={{uri:
                `${imgPrefixOriginal}${imagePath}`
                }}
            />
                    
            {/* title */}
            <View style={styles.titleContainer}>
                <View>

                <Link to="/" activeOpacity={1}>
                    <AntDesign
                    name="arrowleft"
                    size={30}
                    color={theme.foreground}
                    />
                </Link>

                </View>
                <Text style={styles.headerTitle}>
                    {title}
                </Text>
        
                <AntDesign
                name="plus" size={30}
                color={theme.foreground}
                />
            </View>
        </View>
    )
}