import React, { useEffect, useState } from "react";  
import {  
  View,  
  Text,  
  StyleSheet,  
  ImageBackground,  
  TextInput,  
  TouchableOpacity,  
  Alert,  
  FlatList,  
} from "react-native";  
import AsyncStorage from "@react-native-async-storage/async-storage";  
import { BlurView } from "expo-blur";  
import { useFonts } from "expo-font";  
import { useNavigation } from "@react-navigation/native";  
import axios from "axios";  

const HomeScreen: React.FC = () => {  
  const navigation = useNavigation();  
  const [fontsLoaded] = useFonts({  
    "Potta-One": require("../assets/fonts/PottaOne-Regular.ttf"),  
  });  

  const [users, setUsers] = useState<any[]>([]);  
  const [fullname, setFullname] = useState("");  
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");  
  const [editingUserId, setEditingUserId] = useState<number | null>(null);  

  // Fetch all users  

  // Add a new user  
  const handleAddUser = async () => {  
    if (!fullname || !email || !password) return;  

    try {  
      const response = await axios.post("https://adetbackend.onrender.com/api/user", {  
        fullname,  
        email,  
        password,  
      });  
      setUsers([...users, response.data]);  
      setFullname("");  
      setEmail("");  
      setPassword("");  
    } catch (error) {  
      console.error("Error adding user:", error);  
      Alert.alert("Error", "Could not add user.");  
    }  
  };  

  // Set state for editing an existing user  
  const handleEditUser = (user: any) => {  
    setFullname(user.fullname);  
    setEmail(user.email);  
    setEditingUserId(user.id);  
  };  

  // Update an existing user  
  const handleUpdateUser = async () => {  
    if (editingUserId === null || !fullname || !email || !password) return;  

    try {  
      await axios.put(`https://adetbackend.onrender.com/api/user/${editingUserId}`, {  
        fullname,  
        email,  
        password,  
      });  
      fetchUsers(); // Refresh users after updating  
      setFullname("");  
      setEmail("");  
      setPassword("");  
      setEditingUserId(null);  
    } catch (error) {  
      console.error("Error updating user:", error);  
      Alert.alert("Error", "Could not update user.");  
    }  
  };  

  // Delete a user  
  const handleDeleteUser = async (id: number) => {  
    try {  
      await axios.delete(`https://adetbackend.onrender.com/api/user/${id}`);  
      setUsers(users.filter(user => user.id !== id));  
    } catch (error) {  
      console.error("Error deleting user:", error);  
      Alert.alert("Error", "Could not delete user.");  
    }  
  };  

  // Logout function  
  const handleLogout = async () => {  
    try {  
      await AsyncStorage.removeItem("token");  
      navigation.replace("LoginScreen");  
    } catch (error) {  
      console.error("Error removing token:", error);  
      Alert.alert("Logout Failed", "Could not remove token.");  
    }  
  };  

  if (!fontsLoaded) {  
    return null; // Optionally, add a splash screen or loading indicator here.  
}  

return (  
    <ImageBackground  
        source={require("../assets/images/aes.jpg")}  
        style={styles.backgroundImage}  
    >  
        <View style={styles.blurContainer}>  
            <BlurView intensity={80} style={styles.blurView} tint="dark">  
                <View style={styles.homeContainer}>  
                    <Text style={[styles.title, { fontFamily: "Potta-One" }]}>  
                        Pips Management  
                    </Text>  

                    <TouchableOpacity   
                style={styles.button3}   
                onPress={() => navigation.navigate('AddUser')} // Navigate to AddUser screen  
            >  
                <Text style={styles.buttonText}>Create User</Text>  
            </TouchableOpacity>  

            <TouchableOpacity   
                style={styles.button}   
                onPress={() => navigation.navigate('UserDetail')} // Navigate to UserDetail screen  
            >  
                <Text style={styles.buttonText}>Read User</Text>  
            </TouchableOpacity>  

            <TouchableOpacity   
                style={styles.button4}   
                onPress={() => navigation.navigate('EditUser')} // Navigate to EditUser screen  
            >  
                <Text style={styles.buttonText}>Update User</Text>  
            </TouchableOpacity>  

            <TouchableOpacity   
                style={styles.button}   
                onPress={() => navigation.navigate('DeleteUser')} // Navigate to DeleteUser screen  
            >  
                <Text style={styles.buttonText}>Delete User</Text>  
            </TouchableOpacity>  

                        <TouchableOpacity style={styles.button2} onPress={handleLogout}>  
                            <Text style={styles.buttonText}>Log Out</Text>  
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
blurContainer: {  
    flex: 1,  
    padding: 20,  
    justifyContent: "center",  
},  
blurView: {  
    borderRadius: 20,  
    overflow: "hidden",  
},  
homeContainer: {  
    padding: 20,  
    borderRadius: 10,  
    alignItems: "center",  
},  
title: {  
    fontSize: 24,  
    fontWeight: "bold",  
    color: "#FFFFFF",  
    marginBottom: 10,  
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
button2: {  
  backgroundColor: "#FF6B6B", 
  padding: 10,  
  borderRadius: 5,  
  alignItems: "center",  
  width: "50%",  
  marginBottom: 10,  
  marginTop: 3
},  
button3: {  
  backgroundColor: "#6B6BFF", 
  padding: 10,  
  borderRadius: 5,  
  alignItems: "center",  
  width: "100%",  
  marginBottom: 10,  
},  
button4: {  
  backgroundColor: "#6B6BFF", 
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
userItem: {  
    flexDirection: "row",  
    justifyContent: "space-between",  
    alignItems: "center",  
    padding: 10,  
    borderBottomWidth: 1,  
    borderBottomColor: "#A9A9A9",  
    width: "100%",  
},  
userText: {  
    color: "#FFFFFF",  
    fontSize: 16,  
},  
userButtons: {  
    flexDirection: "row",  
},  
userAction: {  
    color: "#FFDA63",  
    marginLeft: 10,  
    fontWeight: "bold",  
},  
logoutButton: {  
    backgroundColor: "#FF6B6B",  
    padding: 10,  
    borderRadius: 5,  
    alignItems: "center",  
    width: "100%",  
    marginTop: 20,  
},  
});  

export default HomeScreen;  