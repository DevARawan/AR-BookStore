import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./LoginScreen";
import Register from "./Signup";
import Mybooks from "./Books";
import HomeScreen from "./Home";
import Profile from "./Profile";
import BookDetails from "./BookDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ShowBooks from "./ShowBook";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 


const Stack = createNativeStackNavigator();

export default function App() {
  const [userExit, setUserExit] = useState(false);
  const retrieveLoginData = async () => {
    try {
      // AsyncStorage.removeItem('userData')
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const userData = JSON.parse(storedData);

        console.log("user informatuon: ", userData);
        global.user = userData;
        setUserExit(true);
      }
    } catch (error) {
      // Handle errors while retrieving data
      console.error("Error retrieving login data:", error);
    }
  };

  useEffect(() => {
    retrieveLoginData();
  }, []);

  return (
    <NavigationContainer>
      
      

      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: true }}
        />

        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="books"
          component={BookDetails}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="ShowBooks"
          component={ShowBooks}
          options={({ route }) => ({
            title: route.params.Title,
            headerBackTitleVisible: false,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
  
}
