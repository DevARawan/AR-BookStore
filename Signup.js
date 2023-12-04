import { StatusBar } from 'expo-status-bar';
import { setDoc, getFirestore, collection, doc } from 'firebase/firestore';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {getAuth, createUserWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import app from './components/firebase';
import { useState } from 'react';


export default function Register() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const[load, setLoad] = useState(false);

    
        const handleRegister = async () => { 
          setLoad(true);
            // check if the password and confirm password match 
            if (password !== confirmPassword) 
            { Alert.alert("Password mismatch, Please enter the same password in both fields"); 
                return; } 
                // get the firebase auth and firestore instances
                const auth = getAuth(app);
                  const db = getFirestore(app);
                   try { 
                    // create a new user with email and password
                     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                      // get the user object from the credential
                      
                      // console.log(userCredential.user.uid);
                       const user = userCredential.user; 
                      const userRef = collection(db, "users");
                      const userDoc = doc(userRef,user.uid)
                      // add the user’s username and email to the firestore collection 
                      await setDoc(userDoc, { 
                        username: username, 
                        email: email,
                        password:password
                    });
                    navigation.navigate('Login');
             setLoad(false)
                    console.log('User added to Firestore');
                     } catch (error) { 
                        // handle any errors
                         Alert.alert("Registration failed", error.message);
                         setLoad(false)
                         } };
    
const backlogin = () =>{
navigation.navigate('Login');
}

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Register</Text>
    
    <TextInput
        style={styles.input}
        placeholder="Enter username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
      {load? <ActivityIndicator size="small" color="white" />:
        <Text style={styles.buttonText}>Register</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.back} onPress={backlogin}>
       <Text style={{fontSize:15, color:'blue'}}>Already have account ? </Text>
    
   
      </TouchableOpacity>
     
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
  registerButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  back: {
    marginTop: 15,
  },
});
