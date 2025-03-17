import React, { useState, useEffect } from "react";  
import {  
    View,  
    Text,  
    TextInput,  
    Button,  
    Alert,  
    StyleSheet,  
    ImageBackground,  
    Image,  
    TouchableOpacity,  
} from "react-native";  
import AsyncStorage from "@react-native-async-storage/async-storage";  
import axios, { AxiosError } from "axios"; // Import AxiosError  
import { BlurView } from "expo-blur";  
import { useFonts } from "expo-font";  
import * as SplashScreen from 'expo-splash-screen';  

SplashScreen.preventAutoHideAsync();  

// Define a type for the navigation prop  
type RegistrationScreenProps = {  
    navigation: any; // Replace 'any' with a more specific type if possible (e.g., StackNavigationProp)  
};  

// Define a type for the expected response data (if you know the structure)  
type RegistrationResponse = {  
    message: string;  
};  

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ navigation }) => {  
    const [fullname, setFullname] = useState("");  
    const [email, setEmail] = useState("");  
    const [password, setPassword] = useState("");  
    const [confirmPassword, setConfirmPassword] = useState("");  
    const [isRegistering, setIsRegistering] = useState(false); // Track registration state  
    const [registrationSuccessful, setRegistrationSuccessful] = useState(false); //Track successful registration  
    const [appIsReady, setAppIsReady] = useState(false);  

    const [fontsLoaded] = useFonts({  
        "Potta-One": require("../assets/fonts/PottaOne-Regular.ttf"),  
    });  

    useEffect(() => {  
        async function prepare() {  
            try {  
                await SplashScreen.preventAutoHideAsync();  
                await new Promise(resolve => setTimeout(resolve, 2000));  
            } catch (e) {  
                console.warn(e);  
            } finally {  
                setAppIsReady(true);  
                await SplashScreen.hideAsync();  
            }  
        }  

        prepare();  
    }, [fontsLoaded]);  

    const handleRegistration = async () => {  
        if (password !== confirmPassword) {  
            Alert.alert("Registration Failed", "Passwords do not match");  
            return;  
        }  
    
        setIsRegistering(true);  
        try {  
            const response = await axios.post<RegistrationResponse>(  
                "https://adetbackend.onrender.com/api/auth/register",  
                {  
                    fullname,  
                    email,  
                    password,  
                }  
            );  
    
            // Show the success alert and navigate  
            Alert.alert(  
                "Registration Successful",  
                "Please login with your new credentials",  
                [{ text: "OK", onPress: () => navigation.navigate("LoginScreens") }]  
            );  
        } catch (error: any) {  
            if (axios.isAxiosError(error)) {  
                const axiosError = error as AxiosError;  
                Alert.alert(  
                    "Registration Failed",  
                    axiosError.response?.data?.message || "An error occurred"  
                );  
            } else {  
                Alert.alert("Registration Failed", "An unexpected error occurred");  
            }  
        } finally {  
            setIsRegistering(false);  
        }  
    };  

    useEffect(() => {  
        if (registrationSuccessful) {  
            Alert.alert(  
                "Registration Successful",  
                "Please login with your new credentials"  
            );  
            setRegistrationSuccessful(false);  
        }  
    }, [registrationSuccessful]);  

    if (!appIsReady) {  
        return null;  
    }  

    return (  
        <ImageBackground  
            source={require("../assets/images/aes.jpg")}  
            style={styles.backgroundImage}  
        >  
            <View style={styles.blurContainer}>  
                <BlurView intensity={80} style={styles.blurView} tint="dark">  
                    <View style={styles.loginContainer}>  
                        <Text style={[styles.logoTitle, { fontFamily: "Potta-One" }]}>  
                            Register  
                        </Text>  
                        <Image  
                            source={require("../assets/images/pngegg.png")}  
                            style={styles.logo}  
                        />  

                        <Text style={styles.label}>Full Name:</Text>  
                        <TextInput  
                            value={fullname}  
                            onChangeText={setFullname}  
                            style={styles.input}  
                            placeholder="Your Full Name"  
                            placeholderTextColor="#A9A9A9"  
                        />  

                        <Text style={styles.label}>Email:</Text>  
                        <TextInput  
                            value={email}  
                            onChangeText={setEmail}  
                            style={styles.input}  
                            placeholder="Your Email"  
                            placeholderTextColor="#A9A9A9"  
                        />  

                        <Text style={styles.label}>Password:</Text>  
                        <TextInput  
                            value={password}  
                            onChangeText={setPassword}  
                            secureTextEntry  
                            style={styles.input}  
                            placeholder="Your Password"  
                            placeholderTextColor="#A9A9A9"  
                        />  

                        <Text style={styles.label}>Confirm Password:</Text>  
                        <TextInput  
                            value={confirmPassword}  
                            onChangeText={setConfirmPassword}  
                            secureTextEntry  
                            style={styles.input}  
                            placeholder="Confirm Your Password"  
                            placeholderTextColor="#A9A9A9"  
                        />  

                        <Button  
                            title="Register"  
                            onPress={handleRegistration}  
                            color="#90BE6D"  
                            disabled={isRegistering}  
                        />  
                    </View>  
                </BlurView>  
            </View>  
        </ImageBackground>  
    );  
};  

const styles = StyleSheet.create({  
    backgroundImage: {  
        flex: 1,  
        resizeMode: "cover",  
        justifyContent: "center",  
    },  
    blurContainer: {  
        flex: 1,  
        padding: 20,  
        justifyContent: "center",  
    },  
    blurView: {  
        borderRadius: 20,  
        overflow: "hidden",  
    },  
    loginContainer: {  
        padding: 20,  
        borderRadius: 10,  
        alignItems: "center",  
    },  
    logoTitle: {  
        fontSize: 24,  
        fontWeight: "bold",  
        color: "#FFFFFF",  
        marginBottom: 10,  
        textAlign: "center",  
    },  
    logo: {  
        width: 150,  
        height: 150,  
        resizeMode: "contain",  
        marginBottom: 20,  
    },  
    label: {  
        fontSize: 16,  
        fontWeight: "bold",  
        color: "white",  
        marginBottom: 5,  
    },  
    input: {  
        width: "100%",  
        borderWidth: 1,  
        borderColor: "#90BE6D",  
        backgroundColor: "#FFFFFF",  
        borderRadius: 5,  
        marginBottom: 15,  
        padding: 10,  
        color: "#242424",  
    },  
    registerContainer: {  
        flexDirection: "row",  
        justifyContent: "center",  
        marginTop: 10,  
    },  
    registerText: {  
        color: "white",  
    },  
    registerLink: {  
        color: "#FFDA63",  
        fontWeight: "bold",  
    },  
    underline: {  
        textDecorationLine: 'underline',  
    },  
});  

export default RegistrationScreen;  