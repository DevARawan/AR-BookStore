import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import app from './components/firebase';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [userDetails, setuserDetails] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (!global.user) return;

    setuserDetails(global.user || { username: 'hero', email: '' });
  }, []);

  useEffect(() => {
    if (userDetails === null) {
      return;
    }

    // Log userDetails after it's set
    console.log("userDetails", userDetails);
  }, [userDetails]);

  useEffect(() => {
    async function fetchData() {
      try {
        const auth = getAuth(app);
        const currentUser = auth.currentUser;
        if (currentUser) {
          setUserData(currentUser);
          const userDocRef = doc(getFirestore(app), 'users', currentUser.uid);
          const userDoc = await userDocRef.get();
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setuserDetails(userData);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchData();
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = async () => {
    try {
      const userDocRef = doc(getFirestore(app), 'users', userData.uid);

      const updatedData = {};

      if (userDetails.username !== global.user.username) {
        updatedData.username = userDetails.username;
      }

      if (userDetails.email !== global.user.email) {
        updatedData.email = userDetails.email;
      }

      if (password !== '') {
        updatedData.password = password;
      }

      if (Object.keys(updatedData).length > 0) {
        await setDoc(userDocRef, updatedData, { merge: true });
      }

      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      await AsyncStorage.removeItem('userdata');
      global.user = null;
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return userDetails !== null ? (
    <View style={styles.container}>
      <View style={{ width: '100%' }}>
        <View style={styles.profileHeader}>
          <Image source={require('./components/images/user.png')} style={styles.userIcon} />
          <Text style={styles.title}>User Profile {global.user && global.user.username}</Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.label}>Username:</Text>
          <TextInput
            style={styles.input}
            value={userDetails.username}
            onChangeText={(text) => setuserDetails((prevUserDetails) => ({
              ...prevUserDetails,
              username: text,
            }))}
            editable={isEditMode}
          />

          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={userDetails.email}
            onChangeText={(text) => setuserDetails({ ...userDetails, email: text })}
            editable={isEditMode}
          />

          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder={passwordVisible ? 'Enter new password' : 'xxxxxx'}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            editable={isEditMode}
          />
          <View style={styles.passwordRow}>
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Text style={{ color: 'blue',marginTop: 20 }}>
                {passwordVisible ? 'Hide Password' : 'Show Password'}
              </Text>
            </TouchableOpacity>

            {!isEditMode ? (
              <TouchableOpacity style={styles.updateButton} onPress={handleEdit}>
                <Text style={{ fontSize: 15, color: 'blue' }}>Update</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={{ fontSize: 15, color: 'blue' }}>Save</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.backButton} onPress={handleLogout}>
            <Text style={{ fontSize: 15, color: 'blue', marginTop:20 }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  userIcon: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    width: '100%',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  backButton: {
    marginTop: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  updateButton: {
    // marginBottom: '40%',
    marginTop:20,
  },
  saveButton: {
    marginTop: 15,
  },
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
});
