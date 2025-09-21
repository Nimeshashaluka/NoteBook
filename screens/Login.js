import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // 🔹 Temporary: always go to Home
    if (email && password) {
      navigation.replace("Home"); 
    } else {
      alert("Enter email & password");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🔑 Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Don’t have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", padding:20, backgroundColor:"#fff" },
  heading: { fontSize:28, fontWeight:"bold", marginBottom:30, textAlign:"center" },
  input: { borderWidth:1, borderColor:"#aaa", borderRadius:8, padding:12, marginBottom:15 },
  button: { backgroundColor:"#007bff", padding:15, borderRadius:8, marginTop:10 },
  buttonText: { color:"#fff", textAlign:"center", fontSize:16 },
  link: { marginTop:15, textAlign:"center", color:"#007bff" }
});
