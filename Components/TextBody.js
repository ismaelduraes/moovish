import React from "react";
import { useContext, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    LayoutAnimation
} from 'react-native'
import { ThemeContext } from "./Contexts/ThemeContext";
import LinearGradient from "react-native-linear-gradient";

import Icon from 'react-native-vector-icons/SimpleLineIcons'

export default function TextBody({title, text, hideIfLong, maxTextHeight = 300, marginBottom = 0, width = '100%'}){
    const theme = useContext(ThemeContext)
    
    const [isHidden, setIsHidden] = useState(true)
    const [textHeight, setTextHeight] = useState(0)

    const styles = StyleSheet.create({
        section: {
            // backgroundColor: 'blue',
            width
        },
        sectionTitle: {
            fontSize: 18,
            fontFamily: theme.fontBold,
            color: theme.foreground,
            marginBottom: 5,
            paddingHorizontal: theme.defaultPadding,
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

    return(
        <View
        style={{...styles.section, marginTop: '10%'}}
        onTouchEnd={() => {
            if(textHeight > 300){
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
                <Text style={styles.sectionTitle}>
                        {title}
                </Text>
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
                <Text style={{...styles.expandCollapseText}}>
                    {isHidden ? 'Expand...' : textHeight > maxTextHeight? 'Collapse...' : null}
                </Text> : null
                }
                {textHeight > maxTextHeight && <Icon name={isHidden ? 'arrow-down' : 'arrow-up'} size={12} color={theme.foreground}/>}
            </View> : null
            }

        </View>
    )
}