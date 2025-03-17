import React, { useState } from 'react';  
import {  
  View,  
  Text,  
  TextInput,  
  TouchableOpacity,  
  Alert,  
  StyleSheet,  
  ImageBackground,  
} from 'react-native';  
import { BlurView } from 'expo-blur';  
import { createUser } from './Api'; // Ensure correct import path  

const AddUser: React.FC<{ navigation: any }> = ({ navigation }) => {  
  const [email, setEmail] = useState<string>(''); // Email state  
  const [password, setPassword] = useState<string>(''); // Password state  
  const [fullname, setFullname] = useState<string>(''); // Updated to match API's fullname  

  const handleCreateUser = async () => {  
    try {  
      await createUser(email, password, fullname); // Using fullname for API call  
      Alert.alert('Success', 'User created successfully');  
      navigation.goBack();  
    } catch (error: any) {  
      Alert.alert('Error', error.response?.data?.message || 'Failed to create user');  
    }  
  };  

  return (  
    <ImageBackground  
      source={require("../assets/images/aes.jpg")} // Update with your image path  
      style={styles.backgroundImage}  
    >  
      <View style={styles.container}>  
        <BlurView intensity={80} style={styles.blurView} tint="dark">  
          <View style={styles.formContainer}>  
            <Text style={styles.title}>Add New User</Text>  
            <TextInput  
              style={styles.input}  
              placeholder="Full Name" // Placeholder for Full Name  
              value={fullname}  
              onChangeText={setFullname} // Update fullname state  
            />  
            <TextInput  
              style={styles.input}  
              placeholder="Email" // Placeholder for Email  
              value={email}  
              onChangeText={setEmail}  
              keyboardType="email-address" // Added keyboard type for email  
            />  
            <TextInput  
              style={styles.input}  
              placeholder="Password"  
              secureTextEntry  
              value={password}  
              onChangeText={setPassword}  
            />  
            <TouchableOpacity style={styles.button} onPress={handleCreateUser}>  
              <Text style={styles.buttonText}>Create User</Text>  
            </TouchableOpacity>  
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>  
              <Text style={styles.buttonText}>Cancel</Text>  
            </TouchableOpacity>  
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
  container: {  
    flex: 1,  
    padding: 20,  
    justifyContent: "center",  
  },  
  blurView: {  
    borderRadius: 20,  
    overflow: "hidden",  
    padding: 20,  
  },  
  formContainer: {  
    padding: 20,  
    borderRadius: 10,  
    alignItems: "center",  
  },  
  title: {  
    fontSize: 24,  
    fontWeight: "bold",  
    color: "#FFFFFF",  
    marginBottom: 15,  
    textAlign: "center",  
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

export default AddUser;  