import React, { useEffect, useState } from "react";  
import { Text, View } from "react-native";  
import { createDrawerNavigator } from "@react-navigation/drawer";  
import { NavigationContainer } from "@react-navigation/native";  
import AsyncStorage from "@react-native-async-storage/async-storage";  

import LoginScreen from "./LoginScreen";  
import HomeScreen from "./HomeScreen";  
import RegistrationScreen from "./RegistrationScreen"; // ADD THIS LINE!  
import UserDetail from "./UserDetail";
import EditDetail from "./EditDetail";
import AddUser from "./AddUser";
import DeleteUser from "./DeleteUser";

const Drawer = createDrawerNavigator();  

export default function Index() {  
  const [token, setToken] = useState<string | null>(null);  

  useEffect(() => {  
    const checkToken = async () => {  
      try {  
        const storedToken = await AsyncStorage.getItem("token");  
        console.log("Token from AsyncStorage:", storedToken); // Debugging  
        setToken(storedToken);  
      } catch (error) {  
        console.error("Error getting token from AsyncStorage:", error);  
      }  
    };  
    checkToken();  
  }, []);  

  console.log("Current Token Value:", token); // Debugging  

  return (  
      <Drawer.Navigator>  
        {token ? (  
          <Drawer.Screen name="Home" component={HomeScreen} />  
        ) : (  
          <>  
            <Drawer.Screen  
              name="Login"  
              component={LoginScreen}  
              options={{  
                headerShown: false,  
              }}  
            />  
            <Drawer.Screen  
              name="Register"  
              component={RegistrationScreen}  
              options={{  
                headerShown: false,  
              }}  
            />  
                        <Drawer.Screen  
              name="Home"  
              component={HomeScreen}  
              options={{  
                headerShown: false,  
              }}  
            />  
                                    <Drawer.Screen  
              name="Delete"  
              component={DeleteUser}  
              options={{  
                headerShown: false,  
              }}  
            />  
                                   <Drawer.Screen  
              name="Add"  
              component={AddUser}  
              options={{  
                headerShown: false,  
              }}  
            />  
                                   <Drawer.Screen  
              name="Read"  
              component={UserDetail}  
              options={{  
                headerShown: false,  
              }}  
            />  
                                   <Drawer.Screen  
              name="Edit"  
              component={EditDetail}  
              options={{  
                headerShown: false,  
              }}  
            />  
           
          </>  
        )}  
      </Drawer.Navigator>  
  );  
}  