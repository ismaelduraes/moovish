import React from "react"
import { useState, useContext } from "react"
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableHighlight,
    ActivityIndicator
} from 'react-native'

import { default as MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons'

import Carousel from 'react-native-snap-carousel'
import { ThemeContext } from "./Contexts/ThemeContext"

import { imgPrefix, imgPrefixOriginal } from "./Utilities/Utilities"
import IndexDots from "./IndexDots"

const width = Dimensions.get('window').width

export default function ImageCarousel({ data = [], isSquare = false, canChangeResize = false, originalQuality = true, showsIcon = true }) {
    const theme = useContext(ThemeContext)
    const [resizeMode, setResizeMode] = useState('cover')
    const [isImageLoading, setIsImageLoading] = useState(true)
    const [activeSlide, setActiveSlide] = useState(0)

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
            alignItems: 'center',
            justifyContent: 'center'
        },
        image: {
            height: isSquare ? width - (theme.defaultPadding * 2) : width * 0.5,
            width: width - (theme.defaultPadding * 2),
            resizeMode: canChangeResize ? resizeMode : 'cover',
            zIndex: 1,
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
                sliderWidth={width}
                itemWidth={width - (theme.defaultPadding * 2)}
                layout="stack"
                layoutCardOffset={10}
                onSnapToItem={i => setActiveSlide(i)}
                renderItem={(item) => {
                    return (
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                            key={item.index}
                        >
                            <TouchableHighlight
                                onPress={() => {
                                    if (canChangeResize) setResizeMode(resizeMode === 'cover' ? 'contain' : 'cover')
                                }}
                                style={styles.imageContainer}
                            >
                                <View>
                                    {isImageLoading ?
                                        <ActivityIndicator
                                            style={{
                                                position: 'absolute',
                                                alignSelf: 'center',
                                                zIndex: 1,
                                                height: '100%'
                                            }}
                                            size="large"
                                            color={theme.background}
                                        /> : null
                                    }
                                    <Image
                                        style={styles.image}
                                        source={{ uri: `${originalQuality ? imgPrefixOriginal : imgPrefix}${item.item.file_path}` }}
                                        resizeMode={resizeMode}
                                        onLoad={() => setIsImageLoading(false)}
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
            {data.length > 1 ?
                <IndexDots
                    data={data}
                    active={activeSlide}
                /> : null
            }
        </View>
    ) : null
}