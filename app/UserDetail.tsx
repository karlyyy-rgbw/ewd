import React, { useEffect, useState } from 'react';  
import { View, Text } from 'react-native';  
import { getUserById } from './Api';  // Make sure to import getUserById from the correct path  

const UserDetail: React.FC<{ route: any }> = ({ route }) => {  
    const { id } = route.params;  
    const [user, setUser] = useState<any>(null);  

    useEffect(() => {  
        const fetchUser = async () => {  
            const fetchedUser = await getUserById(id);  
            setUser(fetchedUser);  
        };  
        fetchUser();  
    }, [id]);  

    if (!user) return <Text>Loading...</Text>;  

    return (  
        <View>  
            <Text>User Detail</Text>  
            <Text>Username: {user.username}</Text>  
        </View>  
    );  
};  

export default UserDetail;  