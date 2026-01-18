/**
 * 홈 화면 - 테스트
 */

import { createRoute } from "@granite-js/react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const Route = createRoute("/", {
  component: HomePage,
});

function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>술렌다</Text>
      <Text style={styles.subtitle}>앱이 정상 작동합니다!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0faf6",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#03b26c",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7684",
    marginTop: 8,
  },
});
