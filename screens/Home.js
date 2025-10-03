import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";

const PUBLIC_URL = "http://192.168.226.1:8080/Dailyworks";

export default function HomeScreen({ navigation, route }) {
  const { currentUser } = route.params; // user object from login
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState([]);

  // Fetch notes from backend
  const fetchNotes = async () => {
    try {
      const response = await fetch(
        `${PUBLIC_URL}/GetNotesServlet?userId=${currentUser.id}`
      );
      const result = await response.json();
      if (result.response.success) {
        setNotes(result.notes || []);
      } else {
        Alert.alert("Error", result.response.content);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch notes from server");
    }
  };

  useEffect(() => {
    fetchNotes(); // load notes on component mount
  }, []);

  // Add Note
  const addNote = async () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert("Error", "Title and message cannot be empty");
      return;
    }

    // const formData = new FormData();
    // formData.append("userId", currentUser.id); // use currentUser.id
    // formData.append("title", title);
    // formData.append("message", message);

    console.log("Adding note with data:", {
      userId: currentUser.id,
      title,
      message,
    });

    try {
      const response = await fetch(`${PUBLIC_URL}/AddNoteServlet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          title,
          message,
        }),
      });
      const result = await response.json();

      if (result.response.success) {
        fetchNotes(); // reload notes from server
        setTitle("");
        setMessage("");
      } else {
        Alert.alert("Failed", result.response.content);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Server error while adding note");
    }
  };

  // Delete Note
  const deleteNote = async (noteId) => {
    // const formData = new FormData();
    // formData.append("noteId", noteId);

    try {
      const response = await fetch(`${PUBLIC_URL}/DeleteNoteServlet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId }),
      });
      const result = await response.json();

      if (result.response.success) {
        // remove from local state
        setNotes(notes.filter((n) => n.id !== noteId));
        Alert.alert("Success", "Note deleted");
      } else {
        Alert.alert("Failed", result.response.content);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Server error while deleting note");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>📒 My Notes</Text>
        <Text style={{ color: "#666" }}>Welcome, {currentUser.full_name}</Text>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => navigation.replace("Login")}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Enter Note Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Enter Note Message"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <TouchableOpacity style={styles.addBtn} onPress={addNote}>
        <Text style={styles.addBtnText}>Add Note</Text>
      </TouchableOpacity>

      {/* Notes List */}
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.noteCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.noteMessage}>{item.message}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteNote(item.id)}>
              <Text style={styles.deleteText}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#777", marginTop: 20 }}>
            No notes yet.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  heading: { fontSize: 24, fontWeight: "bold" },
  logoutBtn: {
    backgroundColor: "red",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutText: { color: "#fff", fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  addBtn: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  noteCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  noteTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  noteMessage: { fontSize: 15, color: "#555" },
  deleteText: { fontSize: 18, color: "red", marginLeft: 10 },
});
