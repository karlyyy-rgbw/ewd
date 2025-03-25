import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface User {
  user_id: number;
  fullname: string;
  email: string;
  created_at: string;
}

const API_ENDPOINT = 'https://adetbackend.onrender.com/api/user/';

// Helper function to generate random dark colors
const getRandomDarkColor = () => {
  const colors = [
    '#2C3E50', '#34495E', '#16A085', '#27AE60', 
    '#2980B9', '#8E44AD', '#2C3E50', '#D35400'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Format date to readable format
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const AddUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<Record<string, string>>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserName, setCurrentUserName] = useState('');

  useEffect(() => {
    const fetchTokenAndUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          // Fetch current user's name
          const response = await axios.get('https://adetbackend.onrender.com/api/auth/me', {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });
          setCurrentUserName(response.data.fullname);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTokenAndUser();
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
    setLoading(true);
    try {
      const { data } = await axios.get<User[]>(`${API_ENDPOINT}`, { headers });
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmation = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const deleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await axios.delete(`${API_ENDPOINT}${selectedUser.user_id}`, { headers });
      Alert.alert('Success', 'User deleted successfully');
      fetchUsers();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to delete user');
    } finally {
      setShowDeleteModal(false);
    }
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
      Alert.alert('Success', data.message);
      fetchUsers();
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationError(error.response.data.errors);
      } else {
        Alert.alert('Error', error.response?.data?.message || 'Failed to create user');
      }
    }
  };

  const updateUser = async () => {
    if (!selectedUser) return;

    try {
      const { data } = await axios.put(
        `${API_ENDPOINT}${selectedUser.user_id}`,
        { fullname, email, password },
        { headers }
      );
      Alert.alert('Success', data.message);
      fetchUsers();
      setShowUpdateModal(false);
      resetForm();
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationError(error.response.data.errors);
      } else {
        Alert.alert('Error', error.response?.data?.message || 'Failed to update user');
      }
    }
  };

  // Format email with additional @ if not present
  const formatEmailDisplay = (email: string) => {
    if (!email.includes('@')) {
      return `${email}@gmail.com`;
    }
    return email;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Hello, {currentUserName || 'User'}!</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <AntDesign name="adduser" size={20} color="white" />
          <Text style={styles.createButtonText}>Create User</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#90BE6D" />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      ) : (
        <ScrollView style={styles.userList}>
          {users.map((user) => {
            const initials = user.fullname.split(' ').map(n => n[0]).join('').toUpperCase();
            const bgColor = getRandomDarkColor();
            
            return (
              <View key={user.user_id} style={styles.userCard}>
                <View style={[styles.avatar, { backgroundColor: bgColor }]}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.fullname}</Text>
                  <Text style={styles.userEmail}>{formatEmailDisplay(user.email)}</Text>
                  <Text style={styles.joinDate}>
                    <FontAwesome name="calendar" size={12} color="#666" /> Joined: {formatDate(user.created_at)}
                  </Text>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={() => {
                      setSelectedUser(user);
                      setShowViewModal(true);
                    }}
                  >
                    <FontAwesome name="eye" size={16} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => {
                      setSelectedUser(user);
                      setFullname(user.fullname);
                      setEmail(user.email);
                      setShowUpdateModal(true);
                    }}
                  >
                    <AntDesign name="edit" size={16} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteConfirmation(user)}
                  >
                    <MaterialIcons name="delete" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Create User Modal */}
      <Modal visible={showCreateModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.floatingModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New User</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowCreateModal(false)}
              >
                <AntDesign name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollContent}>
              <View style={styles.inputContainer}>
                <FontAwesome name="user" size={20} color="#90BE6D" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#999"
                  value={fullname}
                  onChangeText={setFullname}
                />
              </View>
              {validationError.fullname && <Text style={styles.errorText}>{validationError.fullname}</Text>}

              <View style={styles.inputContainer}>
                <FontAwesome name="envelope" size={20} color="#90BE6D" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {validationError.email && <Text style={styles.errorText}>{validationError.email}</Text>}

              <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={20} color="#90BE6D" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
              {validationError.password && <Text style={styles.errorText}>{validationError.password}</Text>}
            </ScrollView>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={createUser}
            >
              <Text style={styles.submitButtonText}>Create User</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* View User Modal */}
      <Modal visible={showViewModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.floatingModal, { maxHeight: height * 0.6 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>User Details</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowViewModal(false)}
              >
                <AntDesign name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {selectedUser && (
              <ScrollView style={styles.modalScrollContent}>
                <View style={styles.userDetails}>
                  <View style={[styles.detailAvatar, { backgroundColor: getRandomDarkColor() }]}>
                    <Text style={styles.avatarText}>
                      {selectedUser.fullname.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <FontAwesome name="user" size={16} color="#90BE6D" />
                    <Text style={styles.detailText}>{selectedUser.fullname}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <FontAwesome name="envelope" size={16} color="#90BE6D" />
                    <Text style={styles.detailText}>{formatEmailDisplay(selectedUser.email)}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <FontAwesome name="id-card" size={16} color="#90BE6D" />
                    <Text style={styles.detailText}>ID: {selectedUser.user_id}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <FontAwesome name="calendar" size={16} color="#90BE6D" />
                    <Text style={styles.detailText}>Joined: {formatDate(selectedUser.created_at)}</Text>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Update User Modal */}
      <Modal visible={showUpdateModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.floatingModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update User</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setShowUpdateModal(false);
                  resetForm();
                }}
              >
                <AntDesign name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollContent}>
              <View style={styles.inputContainer}>
                <FontAwesome name="user" size={20} color="#90BE6D" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#999"
                  value={fullname}
                  onChangeText={setFullname}
                />
              </View>
              {validationError.fullname && <Text style={styles.errorText}>{validationError.fullname}</Text>}

              <View style={styles.inputContainer}>
                <FontAwesome name="envelope" size={20} color="#90BE6D" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {validationError.email && <Text style={styles.errorText}>{validationError.email}</Text>}

              <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={20} color="#90BE6D" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="New Password (leave blank to keep current)"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
              {validationError.password && <Text style={styles.errorText}>{validationError.password}</Text>}
            </ScrollView>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={updateUser}
            >
              <Text style={styles.submitButtonText}>Update User</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={showDeleteModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.floatingModal, { maxHeight: height * 0.3 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Deletion</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <AntDesign name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.deleteModalContent}>
              <Text style={styles.deleteModalText}>
                Are you sure you want to delete {selectedUser?.fullname}'s account?
              </Text>
              <Text style={styles.deleteModalSubText}>
                This action cannot be undone.
              </Text>

              <View style={styles.deleteButtonContainer}>
                <TouchableOpacity 
                  style={[styles.deleteModalButton, styles.cancelButton]}
                  onPress={() => setShowDeleteModal(false)}
                >
                  <Text style={styles.deleteModalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.deleteModalButton, styles.confirmDeleteButton]}
                  onPress={deleteUser}
                >
                  <Text style={styles.deleteModalButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#90BE6D',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  createButton: {
    backgroundColor: '#2C3E50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  userList: {
    padding: 15,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  joinDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  viewButton: {
    backgroundColor: '#2980B9',
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  editButton: {
    backgroundColor: '#F39C12',
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingModal: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalScrollContent: {
    maxHeight: height * 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 16,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#90BE6D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userDetails: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
  },
  detailAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  // Delete Modal Styles
  deleteModalContent: {
    padding: 10,
  },
  deleteModalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  deleteModalSubText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  deleteButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteModalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  confirmDeleteButton: {
    backgroundColor: '#E74C3C',
  },
  deleteModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddUser;