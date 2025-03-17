import { Stack } from 'expo-router';  

export default function RootLayout() {  
  return (  
    <Stack>  
      <Stack.Screen name="index" options={{ headerShown: false }} />  
      <Stack.Screen name="HomeScreen" options={{ headerShown: false }} />  
      <Stack.Screen name="LoginScreen" options={{  headerShown: false }} /> 
      <Stack.Screen name="RegistrationScreen" options={{  headerShown: false }} /> 
      <Stack.Screen name="EditDetail" options={{ headerShown: false }} />  
      <Stack.Screen name="AddUser" options={{ headerShown: false }} />  
      <Stack.Screen name="DeleteUser" options={{  headerShown: false }} /> 
      <Stack.Screen name="UserDetail" options={{  headerShown: false }} /> 
    </Stack>
  );  
} 