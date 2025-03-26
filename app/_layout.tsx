// import React, { ReactNode } from 'react';
// import { View, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';

// // Get screen dimensions
// const { width, height } = Dimensions.get('window');

// // Define the props interface
// interface LayoutProps {
//     children: ReactNode; // Explicitly type children as ReactNode
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <ScrollView 
//                 contentContainerStyle={styles.scrollContainer}
//                 keyboardShouldPersistTaps="handled"
//             >
//                 <View style={styles.container}>
//                     {/* Here you can add a common header or footer if needed */}
//                     {children}
//                 </View>
//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//         backgroundColor: '#f8f9fa', // Match your app's background color
//     },
//     scrollContainer: {
//         flexGrow: 1,
//         minHeight: height, // Ensure it takes at least full screen height
//     },
//     container: {
//         flex: 1,
//         width: '100%',
//         paddingHorizontal: 16, // Add horizontal padding
//         paddingBottom: 20, // Add bottom padding
//     },
// });

// export default Layout;