import React, { useState, useEffect } from "react";  
import { CommonActions } from '@react-navigation/native';  
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
  TouchableWithoutFeedback,  
  Keyboard  
} from "react-native";  
import AsyncStorage from "@react-native-async-storage/async-storage";  
import axios from "axios";  
import { BlurView } from "expo-blur";  
import { useFonts } from "expo-font";  
import * as SplashScreen from 'expo-splash-screen';  
import { useNavigation } from '@react-navigation/native';   

SplashScreen.preventAutoHideAsync();  

const LoginScreens = ({ navigation }) => {  
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');  

  const handleLogin = async () => {  
      try {  
          const response = await axios.post(  
              "https://adetbackend.onrender.com/api/auth/login",  
              {  
                  email,  
                  password,  
              }  
          );  

          // Store the token in AsyncStorage  
          await AsyncStorage.setItem("token", response.data.token);  
          
          // Reset the navigation stack to navigate to HomeScreen  
          navigation.dispatch(  
              CommonActions.reset({  
                  index: 0,  
                  routes: [{ name: "HomeScreen" }], // Navigate to HomeScreen  
              })  
          );  
      } catch (error) {  
          Alert.alert("Login Failed", "Invalid email or password");  
      }  
  };  


  return (  
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>  
      <ImageBackground  
        source={require("../assets/images/aes.jpg")}  
        style={styles.backgroundImage}  
      >  
        <View style={styles.blurContainer}>  
          <BlurView intensity={80} style={styles.blurView} tint="dark">  
            <View style={styles.loginContainer}>  
              <Text style={[styles.logoTitle, { fontFamily: "Potta-One" }]}>  
                BAKUNAWA  
              </Text>  
              <Image  
                source={require("../assets/images/pngegg.png")}  
                style={styles.logo}  
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
              
              <Button title="Login" onPress={handleLogin} color="#90BE6D" />  
  
              {/* Link to RegistrationScreen */ }  
              <View style={styles.registerContainer}>  
                <Text style={styles.registerText}>  
                  Don't have an account?{" "}  
                </Text>  
                <TouchableOpacity onPress={() => navigation.navigate("RegistrationScreen")}>  
                  <Text style={[styles.registerLink, styles.underline]}>Register here</Text>  
                </TouchableOpacity>  
              </View>  
            </View>  
          </BlurView>  
        </View>  
      </ImageBackground>  
    </TouchableWithoutFeedback>  
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
    color: "white",  
    fontWeight: "bold",  
  },  
  underline: {  
    textDecorationLine: 'underline',  
  },  
  button: {  
    backgroundColor: "#90BE6D",  
    padding: 10,  
    borderRadius: 5,  
    alignItems: "center",  
    width: "100%",  
    marginBottom: 10,  
  },  
  buttonText: {  
    color: "#FFFFFF",  
    fontWeight: "bold",  
  },  
});  

export default LoginScreens;  