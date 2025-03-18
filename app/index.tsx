import React, { useEffect, useState } from "react";  
import { Alert } from "react-native";  
import { NavigationContainer } from "@react-navigation/native";  
import { createNativeStackNavigator } from '@react-navigation/native-stack';  
import AsyncStorage from "@react-native-async-storage/async-storage";  

import LoginScreens from "./LoginScreen";  
import HomeScreen from "./HomeScreen";  
import RegistrationScreen from "./RegistrationScreen";  
import AddUser from "./AddUser";  
import LoadingScreen from './LoadingScreen';  // Import your LoadingScreen component

const Stack = createNativeStackNavigator();  

export default function App() {  
    const [token, setToken] = useState<string | null>(null);  
    const [isLoading, setIsLoading] = useState(true);  

    useEffect(() => {  
        const checkToken = async () => {  
            try {  
                const storedToken = await AsyncStorage.getItem("token");  
                setToken(storedToken);  
            } catch (error) {  
                Alert.alert("Error", "Could not retrieve user session.");  
            } finally {  
                setIsLoading(false);  
            }  
        };  
        checkToken();  
    }, []);  

    // Display the LoadingScreen while checking for the token
    if (isLoading) {  
        return <LoadingScreen />;  // Show LoadingScreen while loading
    }  

    return (  
            <Stack.Navigator initialRouteName={token ? "HomeScreen" : "LoginScreens"} screenOptions={{ headerShown: false }}>  
                <Stack.Screen name="HomeScreen" component={HomeScreen} />  
                <Stack.Screen name="AddUser" component={AddUser} />  
                <Stack.Screen name="LoginScreens" component={LoginScreens} />  
                <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />  
            </Stack.Navigator>  
    );  
}  
