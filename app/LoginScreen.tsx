import React, { useState } from "react";
import { CommonActions } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
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
  StatusBar,
  Modal,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BlurView } from "expo-blur";
import * as SplashScreen from 'expo-splash-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from "react-native-safe-area-context";
SplashScreen.preventAutoHideAsync();

const LoginScreens = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  // Registration form states
  const [fullname, setFullname] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

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

      await AsyncStorage.setItem("token", response.data.token);
      axios.defaults.headers['Authorization'] = `Bearer ${response.data.token}`;

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

  const handleRegistration = async () => {
    if (regPassword !== confirmPassword) {
      Alert.alert("Registration Failed", "Passwords do not match");
      return;
    }
    
    setIsRegistering(true);
    try {
      const response = await axios.post(
        "https://adetbackend.onrender.com/api/auth/register",
        {
          fullname,
          email: regEmail,
          password: regPassword,
        }
      );

      Alert.alert(
        "Registration Successful",
        "Please login with your new credentials",
        [
          { 
            text: "OK", 
            onPress: () => {
              setShowRegisterModal(false);
              setEmail(regEmail);
              setPassword("");
            } 
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        "Registration Failed", 
        error.response?.data?.message || "An error occurred"
      );
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" /> 
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ImageBackground
            source={require("../assets/images/j.jpg")}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <BlurView intensity={30} style={styles.blurView} tint="dark">
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
              >
                <View style={styles.loginContainer}>
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
                      keyboardType="email-address"
                      autoCapitalize="none"
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

                  <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>
                      Don't have an account?{" "}
                    </Text>
                    <TouchableOpacity onPress={() => setShowRegisterModal(true)}>
                      <Text style={[styles.registerLink, styles.underline]}>Register here</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </BlurView>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>

      {/* Registration Modal */}
      <Modal
        visible={showRegisterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRegisterModal(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <BlurView intensity={100} style={styles.modalBlurView} tint="dark">
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContent}
              >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                  <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={() => setShowRegisterModal(false)}
                  >
                    <Icon name="times" size={24} color="white" />
                  </TouchableOpacity>
                  
                  <Text style={[styles.logoTitle, { fontFamily: "Potta-One" }]}>
                    Register
                  </Text>
                  <Image
                    source={require("../assets/images/pngegg.png")}
                    style={styles.logo}
                  />

                  <Text style={styles.label}>Full Name:</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="user" size={20} color="#A9A9A9" style={styles.inputIcon} />
                    <TextInput
                      value={fullname}
                      onChangeText={setFullname}
                      style={styles.input}
                      placeholder="Your Full Name"
                      placeholderTextColor="#A9A9A9"
                    />
                  </View>

                  <Text style={styles.label}>Email:</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="envelope" size={20} color="#A9A9A9" style={styles.inputIcon} />
                    <TextInput
                      value={regEmail}
                      onChangeText={setRegEmail}
                      style={styles.input}
                      placeholder="Your Email"
                      placeholderTextColor="#A9A9A9"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <Text style={styles.label}>Password:</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="lock" size={20} color="#A9A9A9" style={styles.inputIcon} />
                    <TextInput
                      value={regPassword}
                      onChangeText={setRegPassword}
                      secureTextEntry
                      style={styles.input}
                      placeholder="Your Password"
                      placeholderTextColor="#A9A9A9"
                    />
                  </View>

                  <Text style={styles.label}>Confirm Password:</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="lock" size={20} color="#A9A9A9" style={styles.inputIcon} />
                    <TextInput
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                      style={styles.input}
                      placeholder="Confirm Your Password"
                      placeholderTextColor="#A9A9A9"
                    />
                  </View>

                  <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleRegistration} 
                    disabled={isRegistering}
                  >
                    {isRegistering ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Register</Text>
                    )}
                  </TouchableOpacity>
                </ScrollView>
              </KeyboardAvoidingView>
            </BlurView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  blurView: {
      flex: 1,
      justifyContent: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
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
    alignSelf: 'flex-start',
    marginLeft: 10,
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
    width: '100%',
  },
  input: {
    flex: 1,
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
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBlurView: {
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  scrollContainer: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
});

export default LoginScreens;