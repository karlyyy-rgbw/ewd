import React, { useEffect, useState } from "react";  
import { ActivityIndicator, Alert } from "react-native";  
import { NavigationContainer } from "@react-navigation/native";  
import { createNativeStackNavigator } from '@react-navigation/native-stack';  
import AsyncStorage from "@react-native-async-storage/async-storage";  

import LoginScreens from "./LoginScreen";  
import HomeScreen from "./HomeScreen";  
import RegistrationScreen from "./RegistrationScreen";  
import AddUser from "./AddUser";  

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

    // Display a loading indicator while checking for token  
    if (isLoading) {  
        return <ActivityIndicator size="large" color="#0000ff" />;  
    }  

    return (  
        // Wrap NavigationContainer around your Stack Navigator  
        <NavigationContainer>  
            <Stack.Navigator initialRouteName={token ? "HomeScreen" : "LoginScreens"} screenOptions={{ headerShown: false }}>  
                <Stack.Screen name="HomeScreen" component={HomeScreen} />  
                <Stack.Screen name="AddUser" component={AddUser} />  
                <Stack.Screen name="LoginScreens" component={LoginScreens} />  
                <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />  
            </Stack.Navigator>  
        </NavigationContainer>  
    );  
}  