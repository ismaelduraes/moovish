import React from 'react';
import {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, LayoutAnimation, Pressable} from 'react-native';
import {ThemeContext} from './Contexts/ThemeContext';

import {default as MaterialCommunityIcons} from 'react-native-vector-icons/MaterialCommunityIcons';

import {default as SimpleLineIcons} from 'react-native-vector-icons/SimpleLineIcons';

export default function TextBody({
  title,
  text,
  hideIfLong,
  maxTextHeight = 300,
  marginBottom = 0,
  marginTop = 30,
  width = '100%',
  iconName = '',
  greyedOut = false,
  bold,
}) {
  const theme = useContext(ThemeContext);

  const [textHeight, setTextHeight] = useState(maxTextHeight);
  const [isHidden, setIsHidden] = useState(true);

  const styles = StyleSheet.create({
    section: {
      // backgroundColor: 'blue',
      marginBottom,
      width,
    },
    sectionTitle: {
      flexDirection: 'row',
      marginBottom: title ? 5 : 0,
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
      paddingHorizontal: theme.defaultPadding,
      maxHeight: hideIfLong && isHidden ? maxTextHeight : undefined,
      fontFamily: bold ? theme.fontBold : theme.fontRegular,
      opacity: greyedOut ? 0.5 : 1,
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
      marginBottom: 5,
      fontSize: 12,
    },
  });

  return (
    <Pressable
      style={{...styles.section, marginTop}}
      onLayout={t => {
        //this gets the height of the text
        setTextHeight(t.nativeEvent.layout.height);
      }}
      onPress={() => {
        LayoutAnimation.configureNext({
          duration: 500,
          update: {
            type: 'spring',
            springDamping: 0.7,
          },
        });
        setIsHidden(!isHidden);
      }}>
      {title ? (
        <View style={styles.sectionTitle}>
          {iconName ? (
            <MaterialCommunityIcons
              name={iconName}
              color={theme.foreground}
              size={20}
            />
          ) : null}
          <Text style={styles.titleText}>{title}</Text>
        </View>
      ) : null}
      <View>
        <Text style={styles.overviewText}>{text}</Text>
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

      {hideIfLong && textHeight >= maxTextHeight ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-around',
            marginTop: marginBottom ? marginBottom : 20,
            //making it reverse puts arrow on top of 'collapse' text
            flexDirection: isHidden ? 'column' : 'column-reverse',
            height: 30,
          }}>
          <Text style={{...styles.expandCollapseText}}>
            {isHidden ? 'Expand' : 'Collapse'}
          </Text>
          <SimpleLineIcons
            name={isHidden ? 'arrow-down' : 'arrow-up'}
            size={12}
            color={theme.foreground}
          />
        </View>
      ) : null}
    </Pressable>
  );
}
