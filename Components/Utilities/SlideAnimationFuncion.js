import { Animated, Easing } from 'react-native'

export default function SlideAnimationFunction(animRef, to = 0, duration = 1000, useNativeDriver = true, delay = 0){
    Animated.timing(animRef, {
        toValue: to,
        duration,
        useNativeDriver: useNativeDriver,
        delay: delay,
        easing: Easing.out(Easing.exp)
    }).start()
}