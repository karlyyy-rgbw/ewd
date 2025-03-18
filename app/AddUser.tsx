import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  user_id: number;
  fullname: string;
  email: string;
}

const API_ENDPOINT = 'https://adetbackend.onrender.com/api/user/';

const AddUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [updateShow, setUpdateShow] = useState(false);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<Record<string, string>>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
      setLoading(false);
    };
    fetchToken();
  }, []);

  const headers = {
    accept: 'application/json',
    Authorization: token || '',
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get<User[]>(`${API_ENDPOINT}`, { headers });
      setUsers(data);
      setLoading(false);  // Hide loading spinner once users are fetched
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);  // Hide loading spinner even if there's an error
    }
  };

  const deleteUser = async (id: number) => {
    Alert.alert(
      'Are you sure?',
      "You won't be able to revert this!",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, delete it!',
          onPress: async () => {
            try {
              const response = await axios.delete(`${API_ENDPOINT}${id}`, { headers });
              Alert.alert('Success', 'Successfully Deleted', [{ text: 'OK' }]);
              fetchUsers();
            } catch (error) {
              Alert.alert('Error', error.response?.data?.message || 'An error occurred while deleting the user.', [{ text: 'OK' }]);
              console.log(error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClose1 = () => setShow1(false);
  const handleShow1 = (user: User) => {
    setSelectedUser(user);
    setShow1(true);
  };

  const handleUpdateClose = () => {
    setUpdateShow(false);
    resetForm();
  };

  const handleUpdateShow = (user: User) => {
    setSelectedUser(user);
    setFullname(user.fullname);
    setEmail(user.email);
    setPassword('');
    setUpdateShow(true);
  };

  const resetForm = () => {
    setFullname('');
    setEmail('');
    setPassword('');
    setValidationError({});
  };

  const createUser = async () => {
    try {
      const { data } = await axios.post(`${API_ENDPOINT}`, { fullname, email, password }, { headers });
      Alert.alert('Success', data.message, [{ text: 'OK' }]);
      fetchUsers();
      handleClose();
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationError(error.response.data.errors);
      } else {
        Alert.alert(
          'Error',
          error.response?.data?.message || 'An unexpected error occurred.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const updateUser = async () => {
    if (!selectedUser) return;

    try {
      const { data } = await axios.put(`${API_ENDPOINT}${selectedUser.user_id}`, { fullname, email, password }, { headers });
      Alert.alert('Success', data.message, [{ text: 'OK' }]);
      fetchUsers();
      handleUpdateClose();
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationError(error.response.data.errors);
      } else {
        Alert.alert(
          'Error',
          error.response?.data?.message || 'An unexpected error occurred.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Button title="Create User" onPress={handleShow} />

      {/* Show loading spinner while data is being fetched */}
      {loading ? (
        <ActivityIndicator size="large" color="#90BE6D" />
      ) : (
        <ScrollView>
          {users.map((user) => (
            <View key={user.user_id} style={styles.userItem}>
              <Text style={styles.userText}>ID: {user.user_id}</Text>
              <Text style={styles.userText}>Fullname: {user.fullname}</Text>
              <Text style={styles.userText}>Email: {user.email}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => handleShow1(user)}>
                  <Text style={styles.buttonText}>Read</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleUpdateShow(user)}>
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => deleteUser(user.user_id)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Create User Modal */}
      <Modal visible={show} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create User</Text>
            <TextInput
              style={styles.input}
              placeholder="Fullname"
              value={fullname}
              onChangeText={setFullname}
            />
            {validationError.fullname && <Text style={styles.errorText}>{validationError.fullname}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            {validationError.email && <Text style={styles.errorText}>{validationError.email}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {validationError.password && <Text style={styles.errorText}>{validationError.password}</Text>}

            <Button title="Save" onPress={createUser} />
            <Button title="Close" onPress={handleClose} />
          </View>
        </View>
      </Modal>

      {/* Read User Modal */}
      <Modal visible={show1} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>User Details</Text>
            {selectedUser ? (
              <View>
                <Text>ID: {selectedUser.user_id}</Text>
                <Text>Fullname: {selectedUser.fullname}</Text>
                <Text>Email: {selectedUser.email}</Text>
              </View>
            ) : (
              <Text>No data available</Text>
            )}
            <Button title="Close" onPress={handleClose1} />
          </View>
        </View>
      </Modal>

      {/* Update User Modal */}
      <Modal visible={updateShow} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update User</Text>
            <TextInput
              style={styles.input}
              placeholder="Fullname"
              value={fullname}
              onChangeText={setFullname}
            />
            {validationError.fullname && <Text style={styles.errorText}>{validationError.fullname}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            {validationError.email && <Text style={styles.errorText}>{validationError.email}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {validationError.password && <Text style={styles.errorText}>{validationError.password}</Text>}

            <Button title="Update" onPress={updateUser} />
            <Button title="Close" onPress={handleUpdateClose} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  userItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  userText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#90BE6D',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default AddUser;
