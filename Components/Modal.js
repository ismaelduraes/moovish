import React, { useContext } from 'react'

import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native'
import { ThemeContext } from './Contexts/ThemeContext'

export default function Modal({
    title = 'Modal title',
    text = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, aut debitis. Quae laudantium numquam dolore molestias minus consectetur eos necessitatibus, sapiente quis error est quia perspiciatis sed ea ab placeat!,`,
    confirmText = 'OK',
    confirmAction,
    cancelAction,
    hasCancelButton = true
}){
    const theme = useContext(ThemeContext)

    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: '#000000e6',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1
        },
        modal: {
            width: '85%',
            backgroundColor: theme.gray,
            borderRadius: theme.borderRadius,
            paddingVertical: 20,
            elevation: 10
        },
        title: {
            fontFamily: theme.fontBold,
            textAlign: 'center',
            fontSize: 20,
            color: theme.accent,
            paddingHorizontal: '10%',
        },
        text: {
            fontFamily: theme.fontRegular,
            textAlign: 'center',
            textAlignVertical: 'center',
            marginTop: 15,
            paddingHorizontal: '10%',
            color: theme.foreground,
        },
        confirmButton: {
            paddingVertical: 5,
            marginTop: 30,
            width: '70%',
            alignSelf: 'center',
            borderRadius: theme.borderRadius,
            backgroundColor: theme.background,
            marginBottom: 15
        },
        cancelButton: {
            borderColor: theme.accent,
            width: '70%',
            alignSelf: 'center',
            borderRadius: theme.borderRadius,
        },
        buttonText: {
            fontFamily: theme.fontRegular,
            textAlign: 'center',
            textAlignVertical: 'center',
            color: theme.accent,
            marginVertical: 5
        }
    })

    return(
        <View style={styles.container}>
            <View style={styles.modal}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        {title}
                    </Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        {text}
                    </Text>
                </View>
                <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => confirmAction()}
                >
                    <Text style={{
                        ...styles.buttonText}}>
                        {confirmText}
                    </Text>
                </TouchableOpacity>
                {hasCancelButton ?
                <TouchableOpacity
                onPress={() => cancelAction()}
                style={styles.cancelButton}>
                    <Text style={{
                        ...styles.buttonText,
                        color: theme.foreground
                    }}
                    >
                        Cancel
                    </Text>
                </TouchableOpacity> : null
                }
            </View>
        </View>
    )
}