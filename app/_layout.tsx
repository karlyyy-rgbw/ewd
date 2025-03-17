// _layout.jsx  
import React from 'react';  
import { View, StyleSheet } from 'react-native';  

const Layout = ({ children }) => {  
    return (  
        <View style={styles.container}>  
            {/* Here you can add a common header or footer if needed */}  
            {children}  
        </View>  
    );  
};  

const styles = StyleSheet.create({  
    container: {  
        flex: 1,  
        padding: 16,  
        backgroundColor: '#fff', // Change to desired background color  
    },  
});  

export default Layout;  