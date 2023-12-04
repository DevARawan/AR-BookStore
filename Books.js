import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Mybooks() {
const[data, setData] = useState(null);

useEffect(()=>{
   //  AsyncStorage.clear();
    AsyncStorage.getItem('itsuser').then((response) =>{
        
        if(response){
            const users = JSON.parse(response);
            console.log("information is : ", users);
            setData(users);
            console.log("if");
        }
        else {
          console.log("else");
          
            axios.get('https://dummyjson.com/products').then((res)=>{
               const userinfo = res.data.products;
             
               const first10 = userinfo.slice(0, 10);
            AsyncStorage.setItem("itsuser", JSON.stringify(first10))
            .then(() =>{
             
                setData(first10);
               
            })
        });
        }
    })
}, [])

  return (
    <View style={styles.container}>
        <View style={{justifyContent: 'center', alignItems: 'center', width: '90%', backgroundColor: 'lightcyan', borderWidth: 1}}>
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>some mobile phones</Text>
      {/* <Text>{JSON.stringify(data)}</Text> */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
       <View style={{marginBottom:20}}>
           <Text>Title: {item.title}</Text>
          <Text>Price: ${item.price}</Text>
          <Text>Category: {item.category}</Text>
          <Text>Description: {item.description}</Text>
          <View style={styles.line} />
       </View>
        )}
      />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    overflow:'auto'
  },
  line : {
borderBottomColor: 'black',
borderBottomWidth:1,
marginVertical: 10,
  },
});
