import React from "react";
import { CommonActions } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

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
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.homeContainer}>
              <LinearGradient
                colors={['rgba(144, 190, 109, 0.7)', 'rgba(39, 174, 96, 0.7)']}
                style={styles.headerCard}
              >
                <Text style={[styles.title, { fontFamily: "Potta-One" }]}>
                  VOTERS MANAGEMENT SYSTEM
                </Text>
                <Text style={styles.subtitle}>Track and manage voter information efficiently</Text>
              </LinearGradient>

              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <View style={styles.statIconContainer}>
                    <Icon name="users" size={24} color="#90BE6D" />
                  </View>
                  <Text style={styles.statText}>Total Voters</Text>
                  <Text style={styles.statNumber}>1,247</Text>
                  <Text style={styles.statChange}>↑ 5.2% from last month</Text>
                </View>
                
                <View style={styles.statCard}>
                  <View style={styles.statIconContainer}>
                    <Icon name="check-circle" size={24} color="#90BE6D" />
                  </View>
                  <Text style={styles.statText}>Verified</Text>
                  <Text style={styles.statNumber}>1,024</Text>
                  <Text style={styles.statChange}>82% completion</Text>
                </View>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <View style={styles.statIconContainer}>
                    <Icon name="map-marker" size={24} color="#90BE6D" />
                  </View>
                  <Text style={styles.statText}>Districts</Text>
                  <Text style={styles.statNumber}>12</Text>
                  <Text style={styles.statChange}>3 new this year</Text>
                </View>
                
                <View style={styles.statCard}>
                  <View style={styles.statIconContainer}>
                    <Icon name="calendar" size={24} color="#90BE6D" />
                  </View>
                  <Text style={styles.statText}>Last Updated</Text>
                  <Text style={styles.statNumber}>Today</Text>
                  <Text style={styles.statChange}>11:45 AM</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#90BE6D' }]}
                    onPress={() => navigation.navigate('AddUser')}
                  >
                    <Icon name="user-plus" size={20} color="white" />
                    <Text style={styles.actionButtonText}>Add New Voter</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#3498db' }]}
                    onPress={() => navigation.navigate('Reports')}
                  >
                    <Icon name="file-text" size={20} color="white" />
                    <Text style={styles.actionButtonText}>Generate Report</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <View style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Icon name="user" size={16} color="#90BE6D" />
                  </View>
                  <Text style={styles.activityText}>New voter registered in District 4</Text>
                  <Text style={styles.activityTime}>10 mins ago</Text>
                </View>
                <View style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Icon name="check" size={16} color="#90BE6D" />
                  </View>
                  <Text style={styles.activityText}>25 verifications completed</Text>
                  <Text style={styles.activityTime}>1 hour ago</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Icon name="sign-out" size={20} color="white" />
                <Text style={styles.logoutButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  },
  scrollContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  homeContainer: {
    borderRadius: 20,
    alignItems: "center",
  },
  headerCard: {
    width: '100%',
    padding: 25,
    borderRadius: 15,
    marginBottom: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '500',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  statChange: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
  },
  section: {
    width: '100%',
    marginBottom: 25,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    paddingLeft: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  activityIcon: {
    backgroundColor: 'rgba(144, 190, 109, 0.2)',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityText: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 14,
  },
  activityTime: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  logoutButton: {
    backgroundColor: "rgba(255, 107, 107, 0.8)",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default HomeScreen;