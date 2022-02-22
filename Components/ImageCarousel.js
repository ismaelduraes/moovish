import React from "react"
import { useState, useContext } from "react"
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native'

import FastImage from "react-native-fast-image"

import Carousel from 'react-native-snap-carousel'
import { ThemeContext } from "./Contexts/ThemeContext"

import { imgPrefixOriginal } from "./Utilities/Utilities"

const width = Dimensions.get('window').width

export default function ImageCarousel({data = [], isSquare = false, canChangeResize = false}){
    const theme = useContext(ThemeContext)
    const [resizeMode, setResizeMode] = useState('cover')

    const styles = StyleSheet.create({
        section: {
            // backgroundColor: 'blue',
        },
        sectionTitle: {
            fontSize: 18,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            marginBottom: 15,
        },
        imageContainer: {
            borderRadius: theme.borderRadius,
            backgroundColor: theme.accent,
            alignSelf: 'center',
            overflow: 'hidden',
        },
        image: {
            height: isSquare ? width-(theme.defaultPadding*2) : 190,
            width: width-(theme.defaultPadding*2),
            resizeMode: canChangeResize ? resizeMode : 'cover',
            zIndex: 1
        },
        imageBackground: {
            height: isSquare ? width-(theme.defaultPadding*2) : 190,
            width: width-(theme.defaultPadding*2),
            position: 'absolute'
        },
    })
    return data.length > 0 ? (
        <View style={{...styles.section, marginTop: '10%'}}>
            <Text
            style={{
                ...styles.sectionTitle,
                paddingHorizontal: theme.defaultPadding
            }}
            >
                Images
            </Text>
            <Carousel
            data={data}
            removeClippedSubviews
            sliderWidth={width}
            itemWidth={width-(theme.defaultPadding*2)}
            layout="stack"
            layoutCardOffset={10}
            renderItem={ (item) =>
            {
                return(
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
                key={item.index}
                removeClippedSubviews
                >
                    <View
                    onTouchEnd={() => {
                        if (canChangeResize) setResizeMode(resizeMode === 'cover' ? 'contain' : 'cover')
                    }}
                    style={styles.imageContainer}
                    >
                    <Image
                    style={styles.image}
                    source={{
                        uri: `${imgPrefixOriginal}${item.item.file_path}`,
                        priority: FastImage.priority.low,
                    }}
                    resizeMode={resizeMode}
                    />
                    {resizeMode === 'contain' && <Image
                    style={styles.imageBackground}
                    source={{
                        uri:
                        `${imgPrefixOriginal}${item.item.file_path}`
                    }}
                    blurRadius={20}
                    />}
                    </View>
                </View>
            )}}
            />
        </View>
    ) : null
}