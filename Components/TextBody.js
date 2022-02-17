import React from "react";
import { useContext } from "react";
import {
    View,
    Text,
    StyleSheet
} from 'react-native'
import { ThemeContext } from "./Contexts/ThemeContext";

export default function TextBody({title, text}){
    const theme = useContext(ThemeContext)

    const styles = StyleSheet.create({
        section: {
            paddingHorizontal: theme.defaultPadding,
            marginTop: '5%'
        },
        sectionTitle: {
            fontSize: 20,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            marginBottom: 10,
        },
        overviewText: {
            textAlign: 'left',
            color: theme.foreground,
        },
    })

    return(
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>
                    {title}
            </Text>
            <Text style={styles.overviewText}>
                {text}
            </Text>
        </View>
    )
}