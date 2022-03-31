import React, { useState, useContext } from 'react'
import {
    View,
    StyleSheet
} from 'react-native'

import { ThemeContext } from './Contexts/ThemeContext'

export default function IndexDots({ data, active }) {
    const theme = useContext(ThemeContext)

    return (
        <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 15 }}>
            {
                data.map((item, index) => {
                    return (
                        <View
                            key={index}
                            style={{
                                backgroundColor: active === index ? theme.accent : theme.foreground + '4c',
                                borderRadius: 20,
                                height: 5, width: 5,
                                marginRight: 5
                            }}
                        />
                    )
                })
            }
        </View>
    )
}