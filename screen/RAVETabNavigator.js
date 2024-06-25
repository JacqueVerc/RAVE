import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AudioListScreen from './AudioListScreen';
import ModelScreen from './ModelScreen';
import DownloadedAudioListScreen from './DownloadedAudioListScreen';
import Ionicons from "react-native-vector-icons/Ionicons"; // Another screen in the nested tabs

const NestedTab = createBottomTabNavigator();

// Sous-tab pour une meilleur mobilité dans les vues de l'app (Si la vue 2 est choisi en passant par le bottomTab et qu'aucun audio n'a été choisie avant, l'app crash)
export default function RAVETabNavigator() {
    return (
        <NestedTab.Navigator>
            <NestedTab.Screen name="Recorded audios" component={AudioListScreen} options={{
                tabBarLabel: 'Liste des audios',
                tabBarIcon: () => (
                    <Ionicons name="list-circle-outline" size={30}></Ionicons>
                ),
            }}/>
            <NestedTab.Screen name="RAVE Screen" component={ModelScreen} options={{
                tabBarLabel: 'RAVE',
                tabBarIcon: () => (
                    <Ionicons name="musical-notes-outline" size={30}></Ionicons>
                ),
            }}/>
            <NestedTab.Screen name="Modified audios" component={DownloadedAudioListScreen} options={{
                tabBarLabel: 'Audios modifiés',
                tabBarIcon: () => (
                    <Ionicons name="list-circle-outline" size={30}></Ionicons>
                ),
            }}/>
        </NestedTab.Navigator>
    );
}
