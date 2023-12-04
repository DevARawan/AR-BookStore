import React, { useState } from "react";
import { View, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { WebView } from "react-native-webview";

const ShowBook = ({ route }) => {
  const url = route.params.url;
  const [isLoading, setIsLoading] = useState(true);

  const webViewLoaded = () => {
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}
      <WebView
        source={{
          uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
            url
          )}`,
        }}
        style={[styles.webView, { display: isLoading ? "none" : "flex" }]}
        onLoad={webViewLoaded}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  webView: {
    flex: 1,
    width: Dimensions.get("window").width,
  },
});

export default ShowBook;
