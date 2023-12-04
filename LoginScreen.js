import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Alert, ActivityIndicator,Modal,Pressable } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, collection, getDoc,doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


import app from './components/firebase';


export default function Login() {
    const [email, setEmail] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [load, setLoad] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const navigation = useNavigation();

  const retrieveLoginData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData !== null) {
        const { email: storedEmail, password: storedPassword } = JSON.parse(storedData);
        // Use storedEmail and storedPassword as needed (e.g., auto-login)
        setEmail(storedEmail);
        // setPassword(storedPassword);
      }
    } catch (error) {
      // Handle errors while retrieving data
      console.error('Error retrieving login data:', error);
    }
  };

  useEffect(() => {
    retrieveLoginData();
  }, []);

  const handleLogin = async () => {
    setLoad(true);
    try {
      const auth = getAuth(app);
      let userData;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    
      console.log('User logged in:', userCredential.user.uid);
  
      const database = getFirestore(app);
      const userRef = doc(database, 'users', userCredential.user.uid);
  
      const snapshot = await getDoc(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.data();
        
        const dataToStore = JSON.stringify(userData);
        await AsyncStorage.setItem('userData', dataToStore);
        global.user = dataToStore;
        console.log("loghggggggg",global.user);
        console.log("user",global.user);
      } else {
        console.error('User data not found');
       
      }
     
      setLoad(false);
      navigation.navigate('Home');
    } catch (error) {
      // Handle unsuccessful login
      Alert.alert('Login Failed', error.message);
      setLoad(false);
    }
  };

  const handleRegister = () =>{
    navigation.navigate('Register');
  }


  const handleforget = async (email) => {
    if (!email) {
      Alert.alert('Error', 'Please enter your registered email.');
      return;
    }
    try {
      const auth = getAuth(app);
      await sendPasswordResetEmail(auth, email);
  
      Alert.alert('Reset Email Sent', 'Check your email to reset your password.');
      setForgotPasswordEmail(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Login</Text>
     <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={[styles.input, { marginBottom: 5 }]}
        placeholder="Enter password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
      {load? <ActivityIndicator size="small" color="white" />:
        <Text style={styles.buttonText}>Login</Text> }
      </TouchableOpacity>

      {/* <TouchableOpacity onPress={handleforget} style={{ marginTop: 15 }}>
        <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
      </TouchableOpacity> */}

      {/* {forgotPasswordAlert && (
        <View style={styles.forgotPasswordAlert}>
          <TextInput
            style={styles.input}
            placeholder="Enter registered email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendResetPasswordEmail}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      )} */}

      <TouchableOpacity onPress={handleRegister} style={{marginTop: 25}}>
        <Text style={styles.redirectText}>Register here</Text>
      </TouchableOpacity>
      <Pressable
        style={{}}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.forgotPasswordText}>Forget Password</Text>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      
        
           <View style={{flexDirection:"row",justifyContent:"space-between"}}>
           <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handleforget}>
              <Text style={styles.textStyle}>submit</Text>
            </Pressable> 
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>cancel</Text>
            </Pressable>
           </View>
          </View>
        </View>
      </Modal>
      <StatusBar style="auto" />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'lightgrey',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop:15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  forgotPasswordText: {
    color: 'blue',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  forgotPasswordAlert: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  sendButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    // marginTop: 5,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  redirectText: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
});
