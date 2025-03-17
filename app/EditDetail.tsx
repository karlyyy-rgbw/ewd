import React, { useEffect, useState } from 'react';  
import { View, Text, TextInput, Button, Alert } from 'react-native';  
import { getUserById, updateUser } from './Api';  // Make sure to import the necessary functions from the correct path  

const EditDetail: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {  
    const { id } = route.params;  
    const [username, setUsername] = useState<string>('');  

    useEffect(() => {  
        const fetchUser = async () => {  
            const user = await getUserById(id);  
            setUsername(user.username);  
        };  
        fetchUser();  
    }, [id]);  

    const handleUpdateUser = async () => {  
        try {  
            await updateUser(id, username);  
            Alert.alert('Success', 'User updated');  
            navigation.goBack();  
        } catch (error: any) {  
            Alert.alert('Error', error.response?.data?.message || 'Failed to update user');  
        }  
    };  

    return (  
        <View>  
            <Text>Edit User</Text>  
            <TextInput value={username} onChangeText={setUsername} />  
            <Button title="Update User" onPress={handleUpdateUser} />  
        </View>  
    );  
};  

export default EditDetail;  