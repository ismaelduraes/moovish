import React, {useContext, useRef} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Text,
  Dimensions,
} from 'react-native';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

import {default as MaterialCommunityIcons} from 'react-native-vector-icons/MaterialCommunityIcons';
import {ThemeContext} from './Contexts/ThemeContext';

export default function Loading({
  isError = false,
  rotate = true,
  loadingText = 'Loading...',
  iconName = 'loading',
  errorText = 'Something went wrong.\n\nPlease check your internet connection',
}) {
  const theme = useContext(ThemeContext);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const animTiming = ref =>
    Animated.timing(ref, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.bounce,
    });
  if (rotate) Animated.loop(animTiming(rotateAnim)).start();
  if (!rotate) animTiming(scaleAnim).start();

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      height,
      width,
      backgroundColor: theme.background,
      zIndex: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontFamily: theme.fontBold,
      fontSize: 20,
      color: theme.foreground,
      marginTop: 15,
      textAlign: 'center',
      paddingHorizontal: theme.defaultPadding,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [
            {
              rotateZ: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
              scale: rotate ? 1 : scaleAnim,
            },
          ],
        }}>
        <MaterialCommunityIcons
          name={isError ? 'close' : iconName}
          size={50}
          color={theme.accent}
        />
      </Animated.View>
      <Text style={styles.text}>{isError ? errorText : loadingText}</Text>
    </View>
  );
}
