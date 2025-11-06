import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AddNoteModal from "../components/AddNoteModal";
import NoteItem from "../components/NoteItem";
import { getNotes } from "../services/note-service";

const NotesScreen = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const notesList = await getNotes();
      setNotes(notesList);
    } catch (error) {
      console.error("Erreur de chargement des notes :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleNoteAdded = (newNote) => {
    setNotes((prev) => [newNote, ...prev]);
    setIsModalVisible(false);
  };

  const handleNoteDeleted = (noteId) => {
    setNotes((prev) => prev.filter((note) => note.$id !== noteId));
  };

  const handleNoteUpdated = (updatedNote) => {
    setNotes((prev) =>
      prev.map((note) => (note.$id === updatedNote.$id ? updatedNote : note))
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Notes</Text>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Ionicons name="add-circle" size={36} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <NoteItem
              note={item}
              onNoteDeleted={handleNoteDeleted}
              onNoteUpdated={handleNoteUpdated}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={fetchNotes}
        />
      )}

      <AddNoteModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onNoteAdded={handleNoteAdded}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  listContent: {
    paddingBottom: 100,
  },
});

export default NotesScreen;
