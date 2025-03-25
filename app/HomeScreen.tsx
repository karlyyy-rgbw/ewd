import React from "react";
import { CommonActions } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    "Potta-One": require("../assets/fonts/PottaOne-Regular.ttf"),
  });

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "LoginScreens" }],
        })
      );
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={require("../assets/images/j.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <BlurView intensity={80} style={styles.blurView} tint="dark">
          <View style={styles.homeContainer}>
            <Text style={[styles.title, { fontFamily: "Potta-One" }]}>
              VOTERS TRACKER
            </Text>



            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Icon name="users" size={24} color="#90BE6D" />
                <Text style={styles.statText}>Total Users</Text>
                <Text style={styles.statNumber}>1,024</Text>
              </View>
              <View style={styles.statCard}>
                <Icon name="check-circle" size={24} color="#90BE6D" />
                <Text style={styles.statText}>Active Today</Text>
                <Text style={styles.statNumber}>248</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('AddUser')}
            >
              <Icon name="user-plus" size={20} color="white" />
              <Text style={styles.buttonText}>Manage as Admin</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button2} onPress={handleLogout}>
              <Icon name="sign-out" size={20} color="white" />
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  blurView: {
    flex: 1,
    justifyContent: 'center',
  },
  homeContainer: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    alignItems: 'center',
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginVertical: 5,
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: "#90BE6D",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button2: {
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default HomeScreen;