import React from 'react';  
import { View, Text, Button, Alert } from 'react-native';  
import { deleteUser } from './Api';  // Make sure to import deleteUser from the correct path  

const DeleteUser: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {  
    const { id } = route.params;  

    const handleDeleteUser = async () => {  
        try {  
            await deleteUser(id);  
            Alert.alert('Success', 'User deleted');  
            navigation.goBack();  
        } catch (error: any) {  
            Alert.alert('Error', error.response?.data?.message || 'Failed to delete user');  
        }  
    };  

    return (  
        <View>  
            <Text>Are you sure you want to delete this user?</Text>  
            <Button title="Delete" onPress={handleDeleteUser} />  
        </View>  
    );  
};  

export default DeleteUser;  