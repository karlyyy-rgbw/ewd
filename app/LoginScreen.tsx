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
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BlurView } from "expo-blur";
import * as SplashScreen from 'expo-splash-screen';
import Icon from 'react-native-vector-icons/FontAwesome';

SplashScreen.preventAutoHideAsync();

const LoginScreens = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
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

      // Set the token for future requests globally
      axios.defaults.headers['Authorization'] = `Bearer ${response.data.token}`;

      // Reset the navigation stack to navigate to HomeScreen
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "HomeScreen" }],
        })
      );
    } catch (error) {
      Alert.alert("Login Failed", "Invalid email or password");
    } finally {
      setIsLoading(false);
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
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.loginContainer}
            >
              <Text style={[styles.logoTitle, { fontFamily: "Potta-One" }]}>
                PIPOL
              </Text>
              <Image
                source={require("../assets/images/pngegg.png")}
                style={styles.logo}
              />
              <Text style={styles.label}>Email:</Text>
              <View style={styles.inputContainer}>
                <Icon name="envelope" size={20} color="#A9A9A9" style={styles.inputIcon} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  placeholder="Your Email"
                  placeholderTextColor="#A9A9A9"
                />
              </View>

              <Text style={styles.label}>Password:</Text>
              <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#A9A9A9" style={styles.inputIcon} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.input}
                  placeholder="Your Password"
                  placeholderTextColor="#A9A9A9"
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>

              {/* Link to RegistrationScreen */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>
                  Don't have an account?{" "}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("RegistrationScreen")}>
                  <Text style={[styles.registerLink, styles.underline]}>Register here</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#90BE6D",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
    color: "#242424",
  },
  input: {
    width: "80%",
    height: 20,
    color: "#242424",
    paddingLeft: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  registerText: {
    color: "white",
    marginBottom: 30
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
