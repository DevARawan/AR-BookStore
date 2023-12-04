import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "./components/firebase";
import * as FileSystem from "expo-file-system";


const BookDetails = ({ route }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadStatus, setDownloadStatus] = useState({}); // State to track individual download status
  const db = getFirestore(app);
  const { categoryId, subCollectionName } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const getBookDetails = async () => {
      try {
        const categoryRef = collection(db, "category", categoryId, "books");
        const booksSnapshot = await getDocs(categoryRef);

        const booksData = booksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBooks(booksData);
        setLoading(false);
        initializeDownloadStatus(booksData); // Initialize download status for each book
      } catch (error) {
        console.error("Error fetching documents:", error);
        setLoading(false);
      }
    };

    getBookDetails();
  }, [db, categoryId, subCollectionName]);

  // Function to initialize download status for each book
  const initializeDownloadStatus = (booksData) => {
    const initialStatus = {};
    booksData.forEach((book) => {
      initialStatus[book.id] = false;
    });
    setDownloadStatus(initialStatus);
  };

  const handleBookPress = (item) => {
    navigation.navigate("ShowBooks", item);
  };

  const handleDownload = async (item) => {
    setDownloadStatus({ ...downloadStatus, [item.id]: true }); // Set loading for the specific book download
    const booksDirectory = `${FileSystem.documentDirectory}books/`;

    try {
      const directoryInfo = await FileSystem.getInfoAsync(booksDirectory);
      if (!directoryInfo.exists) {
        await FileSystem.makeDirectoryAsync(booksDirectory, {
          intermediates: true,
        });
      }

      const fileUri = `${booksDirectory}${item.Title}.pdf`;
      const downloadResumable = FileSystem.createDownloadResumable(
        item.url,
        fileUri
      );
      const { uri } = await downloadResumable.downloadAsync();

      setDownloadStatus({ ...downloadStatus, [item.id]: false }); // Reset loading for the specific book download

      console.log("Downloaded to:", uri);
    } catch (err) {
      setDownloadStatus({ ...downloadStatus, [item.id]: false });

      console.error("Download error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Details</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="green" />
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bookContainer}>
              <Text style={styles.bookTitle}>Title: {item.Title}</Text>
              <Text style={styles.bookInfo}>Author: {item.Author}</Text>
              <Text style={styles.bookInfo}>Edition: {item.Edition}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleBookPress(item)}>
                  <View style={styles.readButton}>
                    <Text style={styles.readButtonText}>Read Here</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDownload(item)}>
                  <View style={styles.downloadButton}>
                    {downloadStatus[item.id] ? ( // Show loading based on downloadStatus state
                      <ActivityIndicator size="large" color="pink" />
                    ) : (
                      <Text style={styles.downloadButtonText}>Download</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgrey",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  bookContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bookInfo: {
    fontSize: 16,
    marginBottom: 3,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  readButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  readButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  downloadButton: {
    backgroundColor: "brown",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  downloadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookDetails;
