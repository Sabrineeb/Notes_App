// screens/NotesScreen.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { getNotes, deleteNote } from "../services/noteService";
import NoteItem from "../components/NoteItem";
import AddNoteModal from "../components/AddNoteModal";
import { AuthContext } from "../contexts/AuthContext";

const NotesScreen = () => {
  const [notes, setNotes] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // 🔹 Fetch notes from Appwrite
  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const fetchedNotes = await getNotes(user.$id);
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("❌ Failed to fetch notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchNotes();
  }, [user]);

  // 🔹 Handle note added
  const handleNoteAdded = (newNote) => {
    setNotes([newNote, ...notes]);
  };

  // 🔹 Handle note deleted
  const handleNoteDeleted = (noteId) => {
    setNotes(notes.filter((note) => note.$id !== noteId));
  };

  // 🔹 Handle note updated
  const handleNoteUpdated = (updatedNote) => {
    setNotes(notes.map((note) => (note.$id === updatedNote.$id ? updatedNote : note)));
  };

  // 🔹 Empty list component
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>You don't have any notes yet.</Text>
      <Text style={styles.emptySubtext}>
        Tap the + button to create your first note!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        renderItem={({ item }) => (
          <NoteItem
            note={item}
            onNoteDeleted={handleNoteDeleted}
            onNoteUpdated={handleNoteUpdated}
          />
        )}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={notes.length === 0 ? { flex: 1 } : {}}
        ListEmptyComponent={!isLoading && renderEmptyComponent()}
      />

      {/* Floating add button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsAddModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Add note modal */}
      <AddNoteModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onNoteAdded={handleNoteAdded}
      />

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#007bff",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 32,
    lineHeight: 32,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
  },
});

export default NotesScreen;