import React from "react"
import { useState, useContext } from "react"
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableHighlight
} from 'react-native'

import FastImage from "react-native-fast-image"

import { default as MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons'

import Carousel from 'react-native-snap-carousel'
import { ThemeContext } from "./Contexts/ThemeContext"

import { imgPrefix, imgPrefixOriginal } from "./Utilities/Utilities"

const width = Dimensions.get('window').width

export default function ImageCarousel({ data = [], isSquare = false, canChangeResize = false, originalQuality = true, showsIcon = true }) {
    const theme = useContext(ThemeContext)
    const [resizeMode, setResizeMode] = useState('cover')

    const styles = StyleSheet.create({
        section: {
            // backgroundColor: 'blue',
        },
        sectionTitle: {
            flexDirection: 'row',
            marginBottom: 10,
        },
        titleText: {
            fontSize: 16,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            marginLeft: showsIcon ? 10 : 0
        },
        imageContainer: {
            borderRadius: theme.borderRadius,
            backgroundColor: theme.accent,
            alignSelf: 'center',
            overflow: 'hidden',
        },
        image: {
            height: isSquare ? width - (theme.defaultPadding * 2) : width * 0.5,
            width: width - (theme.defaultPadding * 2) - 7,
            resizeMode: canChangeResize ? resizeMode : 'cover',
            zIndex: 1
        },
        imageBackground: {
            height: isSquare ? width - (theme.defaultPadding * 2) : 190,
            width: width - (theme.defaultPadding * 2),
            position: 'absolute'
        },
    })
    return data.length > 0 ? (
        <View style={{ ...styles.section, marginTop: 30 }}>
            <View
                style={{
                    ...styles.sectionTitle,
                    paddingHorizontal: theme.defaultPadding
                }}
            >
                {showsIcon ? <MaterialCommunityIcons
                    name="image-area"
                    size={20}
                    color={theme.foreground}
                /> : null}
                <Text
                    style={styles.titleText}
                >
                    Images
                </Text>
            </View>
            <Carousel
                data={data}
                removeClippedSubviews
                sliderWidth={width}
                itemWidth={width - (theme.defaultPadding * 2) - 7}
                layout="default"
                enableMomentum={true}
                decelerationRate={0.9}
                renderItem={(item) => {
                    return (
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                            key={item.index}
                            removeClippedSubviews
                        >
                            <TouchableHighlight
                                onPress={() => {
                                    if (canChangeResize) setResizeMode(resizeMode === 'cover' ? 'contain' : 'cover')
                                }}
                                style={styles.imageContainer}
                            >
                                <View>
                                    <Image
                                        style={styles.image}
                                        source={{ uri: `${originalQuality ? imgPrefixOriginal : imgPrefix}${item.item.file_path}` }}
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
                            </TouchableHighlight>
                        </View>
                    )
                }}
            />
        </View>
    ) : null
}