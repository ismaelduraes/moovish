import React from 'react';
import {useContext} from 'react';
import {View, Image, Text, StyleSheet, Pressable, Linking} from 'react-native';

import {default as MaterialCommunityIcons} from 'react-native-vector-icons/MaterialCommunityIcons';

import {ThemeContext} from './Contexts/ThemeContext';
import {imgPrefixLow} from './Utilities/Utilities';

import axios from 'axios';

export default function WatchOn({
  data,
  showCharacter = false,
  tmdbLink = 'https://tmdb.org',
}) {
  const theme = useContext(ThemeContext);

  const styles = StyleSheet.create({
    section: {
      paddingHorizontal: theme.defaultPadding,
      width: '100%',
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: theme.fontBold,
      color: theme.foreground,
      marginBottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoImage: {
      height: 40,
      width: 40,
      borderRadius: 100,
      backgroundColor: theme.accent,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.gray,
      borderRadius: theme.borderRadius,
      padding: 10,
    },
    name: {
      color: theme.foreground,
      marginLeft: 10,
      fontSize: 14,
    },
  });

  function openLink() {
    Linking.openURL(tmdbLink ? tmdbLink : 'https://tmdb.com');
  }

  return (
    <View>
      <Text
        style={{
          ...styles.sectionTitle,
          ...styles.section,
          marginTop: 30,
        }}>
        Watch On
      </Text>

      {data.map((item, index) => {
        return (
          <Pressable
            onPress={() => openLink()}
            style={{marginHorizontal: theme.defaultPadding, marginBottom: 10}}
            key={index}>
            <View style={styles.listItem}>
              <Image
                style={styles.logoImage}
                source={
                  item.logo_path
                    ? {uri: `${imgPrefixLow}${item.logo_path}`}
                    : require('../assets/images/profile_default.png')
                }
              />

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    ...styles.name,
                    fontFamily: theme.fontBold,
                  }}>
                  {item.provider_name ? item.provider_name : 'Unknown name'}
                </Text>
                <MaterialCommunityIcons
                  name="open-in-new"
                  color={theme.foreground}
                  style={{marginLeft: 5}}
                />
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
