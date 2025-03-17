import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Swal from 'sweetalert2';
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

  useEffect(() => {
    // Fetch token from AsyncStorage
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setToken(token); // Set the token directly as a string
      }
    };
    fetchToken();
  }, []);

  const headers = {
    accept: 'application/json',
    Authorization: token || '', // Use token from state
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
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (id: number) => {
    const isConfirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!isConfirm.isConfirmed) return;

    try {
      await axios.delete(`${API_ENDPOINT}${id}`, { headers });
      Swal.fire({
        icon: 'success',
        text: 'Successfully Deleted',
      });
      fetchUsers();
    } catch (error) {
      Swal.fire({
        text: error.response?.data?.message || 'An error occurred',
        icon: 'error',
      });
    }
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

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${API_ENDPOINT}`, { fullname, email, password }, { headers });
      Swal.fire({
        icon: 'success',
        text: data.message,
      });
      fetchUsers();
      handleClose();
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationError(error.response.data.errors);
      } else {
        Swal.fire({
          text: error.response?.data?.message || 'An unexpected error occurred.',
          icon: 'error',
        });
      }
    }
  };

  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) return;

    try {
      const { data } = await axios.put(`${API_ENDPOINT}${selectedUser.user_id}`, { fullname, email, password }, { headers });
      Swal.fire({
        icon: 'success',
        text: data.message,
      });
      fetchUsers();
      handleUpdateClose();
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationError(error.response.data.errors);
      } else {
        Swal.fire({
          text: error.response?.data?.message || 'An unexpected error occurred.',
          icon: 'error',
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Management</Text>
      <Button title="Create User" onPress={handleShow} />

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
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
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
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
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
});

export default AddUser;