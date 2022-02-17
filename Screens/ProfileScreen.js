import React from "react";
import { useState, useEffect, useContext } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
} from 'react-native'
import { useParams } from "react-router-native";
import axios from "axios";

import { TMDB_API_KEY } from '@env'
import Header from "../Components/Header";
import { ThemeContext } from "../Components/Contexts/ThemeContext";
import TextBody from "../Components/TextBody";
import Nav from "../Components/Nav";

export default function ProfileScreen(){
    const profileId = useParams().profileId
    const theme = useContext(ThemeContext)

    const [profileData, setProfileData] = useState({})

    
    function fetchData(){
        axios.get(`https://api.themoviedb.org/3/person/${profileId}?api_key=${TMDB_API_KEY}&append_to_response=images`)
        .then(r => setProfileData(r.data))
    }
    
    useEffect(() => {
        fetchData()
    }, [])
    
    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.background,
            height: '100%',
            width: '100%'
        }
    })

    return(
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            <Nav/>
            <Header
            title={profileData.name}
            imagePath={profileData.profile_path}
            subtitle={`Known for ${profileData.known_for_department}`}
            />
            <TextBody
            style={styles.section}
            title={`About ${profileData.name}`}
            text={profileData.biography ? profileData.biography : 'No biography is available for this person'}
            />
        </ScrollView>
    )
}