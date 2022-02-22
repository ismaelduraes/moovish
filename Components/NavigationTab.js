import { BlurView } from "@react-native-community/blur";
import React, { useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeContext } from "./Contexts/ThemeContext";
import Main from "../Screens/Main";
import SearchScreen from "../Screens/SearchScreen";

import { default as MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons'
import { default as AntDesign } from 'react-native-vector-icons/AntDesign'


const Tab = createBottomTabNavigator()


height = Dimensions.get('window').height

export default function NavigationTab({selectedScreen = 'home'}){
    const theme = useContext(ThemeContext)

    const styles = StyleSheet.create({
        container: {
            height: height,
            width: '100%',
            position: 'absolute',
            overflow: 'hidden',
        },
        tabsContainer: {
            height: 70,
            top: height - 70,
            overflow: 'hidden',
        },
        blur: {
            width: '100%',
            height: 1000,
            position: 'absolute',
        },
        navigation: {
            height: '100%',
            width: '85%',
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'space-around',
            zIndex: 1
        },
        icon: {
            alignSelf: 'center'
        },
        text: {
            color: theme.foreground,
            fontFamily: theme.fontRegular,
            fontSize: 12
        }
    })
    
    return(
        <Tab.Navigator
        initialRouteName="home"
        screenOptions={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarStyle: {
                backgroundColor: theme.background,
                borderTopWidth: 0,
                elevation: 0,
                zIndex: 10
            },
            tabBarActiveTintColor: theme.accent,
            tabBarInactiveTintColor: theme.foreground,
        }}
        >
            <Tab.Screen
            name="Home"
            component={Main}
            options={{
                tabBarIcon: ({focused, color}) => {
                    return <MaterialCommunityIcons
                            name={`${focused ? 'movie-open' : 'movie-open-outline'}`}
                            size={20}
                            color={color}
                            />},
            }}
            />
            <Tab.Screen
            name="Search"
            component={SearchScreen}
            options={{
                tabBarIcon: ({focused, color}) => {
                    return <AntDesign
                            name='search1'
                            size={20}
                            color={color}
                            />
                }
            }}
            />
            <Tab.Screen
            name="Library"
            component={Main}
            options={{
                tabBarIcon: ({focused, color}) => {
                    return <MaterialCommunityIcons
                            name='bookshelf'
                            size={20}
                            color={color}
                            />},
            }}
            />
        </Tab.Navigator>
    )
}