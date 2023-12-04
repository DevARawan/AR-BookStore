import React, { useEffect } from 'react';
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,FlatList, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { SliderBox } from "react-native-image-slider-box";
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import app from './components/firebase';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  query,
  getDoc,  where, startAt, endAt
} from "firebase/firestore";

const HomeScreen = () => {
  const navigation = useNavigation();
  const db = getFirestore(app);

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryCollectionRef = collection(db, 'category');
      const querySnapshot = await getDocs(categoryCollectionRef);

      const categories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));

      console.log("categories:", categories);
      setData(categories);
      setLoading(false);
    };

    fetchCategories();
  }, [db]);

  const handleProfilePress = () => {
navigation.navigate('Profile');
  };

  const handleLogoutPress = () => {
    // const auth = getAuth();
    // signOut(auth).then(() => {
    //   // Sign-out successful.
    //   AsyncStorage.removeItem('userData');
    //   navigation.navigate('Login');
    // }).catch((error) => {
    //   // An error happened.
    // });
    navigation.navigate('Login');
  };

  const handleBookPress = (categoryId, subCollectionName) => {
    navigation.navigate('books', { categoryId, subCollectionName });
  };

  const searchBooks = async () => {
    const booksCollectionRef = collection(db, 'category'); // Replace 'books' with your collection name
    const q = query(booksCollectionRef, where('name', '>=', searchQuery), where('name', '<=', searchQuery + '\uf8ff'));
    const querySnapshot = await getDocs(q);

    const books = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      // Add other book details here as needed
    }));

    setData(books);
  };

  const renderListItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleBookPress(item.id, item.subCollection)}>
      <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
      <MaterialCommunityIcons name="book-open-variant" size={45} color="black" style={styles.bookIcon} />
    </View>
    </TouchableOpacity>
  );

  return (
    <View>
    <View style={styles.header}>
    {global.user ? (
    <TouchableOpacity onPress={handleProfilePress}>
        <Text style={styles.button}>Profile</Text>
      </TouchableOpacity>
        ) : ( 
      <TouchableOpacity onPress={handleLogoutPress}>
        <Text style={styles.button}>Login</Text>
      </TouchableOpacity>
       )} 
    </View>
    <ScrollView>
    <View style={styles.container}>
      {/* Header */}
    

      {/* Title and Home Icon */}
      <View style={styles.titleContainer}>
      <FontAwesome name="home" size={40} color="white" style={styles.icon} />
        <Text style={styles.title}>AR bookStore</Text>
        {/* Home Icon */}
      </View>
      <View style={styles.searchBarContainer}>
      <View style={styles.searchBar}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search books"
            onChangeText={(text) => setSearchQuery(text)}
            value={searchQuery}
            onSubmitEditing={searchBooks}
          />
          <TouchableOpacity>
            <MaterialCommunityIcons name="magnify" size={24} color="black" style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
        </View>

      {/* Image Slider */}
      <View style={styles.sliderContainer}>
        <ImageSlider />
      </View>

      {/* Show me books */}
      
        <Text style={styles.booksText}>
          Books of <TouchableOpacity >
            <Text style={styles.booksLink}>Computer Sciences</Text>
            </TouchableOpacity>
        </Text>

        <View style={styles.descriptiveContent}>
        <Text style={styles.descriptionText}>
          Welcome to AR bookStore! Explore our collection of books on computer sciences
          covering various topics such as programming languages, algorithms, and more.
        </Text>
        </View>
        <View style={styles.list}>
        {loading ? ( 
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="green" />
          </View>
        ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderListItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
        )}
      </View>
    </View>
    </ScrollView></View>
  );
        };

const ImageSlider = () => {
  const [images, setImages] = useState([
    require('./components/images/jon.jpg'),
    require('./components/images/lol.jpg'),
    require('./components/images/pol.jpg'),
    require('./components/images/lop.jpg'),
    require('./components/images/bk.jpg'),
  ]);

  return (
    <View>
     <SliderBox
        images={images}
        dotColor="green"
        inactiveDotColor="white"
        activeDotColor="black"
        paginationBoxVerticalPadding={30}
        autoplay
        circleLoop
        ImageComponentStyle={{ borderRadius: 15, width: "97%", marginTop: 5 }}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom:190 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // marginBottom: 20,
    height: 90,
    width: '100%',
    backgroundColor:'lightgrey',
    marginTop:30,
    alignItems:'center', padding:10,
  },
  button: {
    color: 'white',
    fontSize: 16,
    height:40, width:78, borderWidth:1,
    backgroundColor:'darkblue',
    borderRadius:10, paddingHorizontal:10,
    marginLeft:10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
  },
  title: {
    fontWeight: 'bold',
    color: 'brown',
    marginRight: 10,
    fontSize:30,
  },
  sliderContainer: {
    marginBottom: 50,
    marginTop:30,
  },
  booksText: {
    color: 'black',
    fontSize: 25,
    textAlign: 'center',
  },
  booksLink: {
    fontWeight: 'bold',
    color: 'red',
    fontSize:35,
  },
  itemtext: {
 fontSize: 20,
 color: 'black',
 justifyContent:'center',
  },
  list: {
marginTop: 18,
padding: 15,
  },
  descriptiveContent: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  descriptionText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'justify',
  },
  itemContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection:'row', justifyContent:'space-between',
  },
  itemText: {
    fontSize: 20,
    color: 'black',
  },
  separator: {
    height: 1,
    backgroundColor: 'lightgray',
    marginVertical: 10,
  },
  searchBarContainer: {
    paddingHorizontal: 23,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    flex: 1,
  },
  searchIcon: {
    paddingHorizontal: 10,
  },

  // loadingContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginTop: 50,
  // },
  
});

export default HomeScreen;
