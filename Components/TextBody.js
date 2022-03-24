import React from "react";
import { useContext, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    LayoutAnimation
} from 'react-native'
import { ThemeContext } from "./Contexts/ThemeContext";
import { default as MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons'

import Icon from 'react-native-vector-icons/SimpleLineIcons'
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";

export default function TextBody({ title, text, hideIfLong, maxTextHeight = 300, marginBottom = 0, width = '100%', iconName = "" }) {
    const theme = useContext(ThemeContext)

    const [isHidden, setIsHidden] = useState(true)
    const [textHeight, setTextHeight] = useState(0)

    const styles = StyleSheet.create({
        section: {
            // backgroundColor: 'blue',
            width
        },
        sectionTitle: {
            flexDirection: 'row',
            marginBottom: 5,
            paddingHorizontal: theme.defaultPadding,
        },
        titleText: {
            fontSize: 16,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            //add margin if icon is shown (gap)
            marginLeft: iconName ? 10 : 0,
        },
        overviewText: {
            textAlign: 'left',
            color: theme.foreground,
            maxHeight: isHidden && hideIfLong ? maxTextHeight : '100%',
            paddingHorizontal: theme.defaultPadding,
        },
        gradientContainer: {
            width: '100%',
            height: maxTextHeight,
        },
        gradient: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            textAlign: 'center',
            opacity: hideIfLong && isHidden ? 1 : 0,
        },
        expandCollapseText: {
            // marginTop: 15,
            color: theme.foreground,
            marginBottom: 5
        }
    })

    return (
        <Pressable
            style={{ ...styles.section, marginTop: 30 }}
            onPress={() => {
                if (textHeight > 300) {
                    LayoutAnimation.configureNext({
                        duration: 250,
                        update: {
                            type: 'spring',
                            springDamping: 0.7,
                        },
                    })
                    setIsHidden(!isHidden)
                }
            }}
        >
            <View
                onLayout={e => {
                    setTextHeight(e.nativeEvent.layout.height)
                }}
            >
                <View style={styles.sectionTitle}>
                    {iconName ?
                        <MaterialCommunityIcons
                            name={iconName}
                            color={theme.foreground}
                            size={20}
                        /> : null}
                    {title ? <Text style={styles.titleText}>
                        {title}
                    </Text> : null}
                </View>
                <Text style={styles.overviewText}>
                    {text}
                </Text>
            </View>
            {/* {isHidden && hideIfLong ?
            <View style={styles.gradient} pointerEvents="none">
                <LinearGradient
                colors={[
                    'rgba(0, 0, 0, 0)',
                    theme.background,
                ]}
                style={styles.gradient}
                />
            </View> : null
            } */}

            {hideIfLong ? <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    marginTop: marginBottom ? marginBottom : 20,
                    height: textHeight > maxTextHeight ? undefined : 0,
                    flexDirection: isHidden ? 'column' : 'column-reverse'
                }}
            >
                {textHeight > maxTextHeight ?
                    <Text style={{ ...styles.expandCollapseText }}>
                        {isHidden ? 'Expand...' : textHeight > maxTextHeight ? 'Collapse...' : null}
                    </Text> : null
                }
                {textHeight > maxTextHeight && <Icon name={isHidden ? 'arrow-down' : 'arrow-up'} size={12} color={theme.foreground} />}
            </View> : null
            }

        </Pressable>
    )
}