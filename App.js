import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from './components/WelcomeScreen.js';
import Tabs from './components/Tabs.js';
import Home from './components/Home.js';
import Settings from './components/Settings.js';
import Logo from './components/Logo.js'

import { initnotify, getToken, notify } from 'expo-push-notification-helper';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerLeft: () => <Logo />}}>
                <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{headerShown: false}}/>
                <Stack.Screen name="Home" 
                    component={Tabs} 
                    options={{title:'Smart Garden', 
                        headerTitleStyle: {
                            color:'#669850', 
                            fontSize: 20, 
                            fontWeight: 'bold'
                        }, 
                        headerTitleAlign: 'left', 
                        headerTitleContainerStyle: {
                            left: 55
                        }}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}