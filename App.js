import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from './screen/Home';
import ConnexionScreen from "./screen/ConnexionScreen";
import RecordScreen from "./screen/RecordScreen";
import RAVETabNavigator from "./screen/RAVETabNavigator";
import {createStackNavigator} from "@react-navigation/stack";
import {AppStateProvider} from './AppState';

const Stack = createStackNavigator();

export default function App() {
    return (
        <AppStateProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={HomeScreen}/>
                    <Stack.Screen name="ConnexionScreen" component={ConnexionScreen}/>
                    <Stack.Screen name="RecordScreen" component={RecordScreen}/>
                    <Stack.Screen name="RAVEScreen" component={RAVETabNavigator}/>
                </Stack.Navigator>
            </NavigationContainer>
        </AppStateProvider>
    );
}
