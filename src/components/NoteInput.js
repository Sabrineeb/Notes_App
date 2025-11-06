import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { deleteNote } from "../services/note-service";
import EditNoteModal from "./EditNoteModal";

const NoteItem = ({ note, onNoteDeleted, onNoteUpdated }) => {
  const [deleting, setDeleting] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // 🗓️ Format de date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // 🗑️ Suppression de la note avec confirmation
  const handleDelete = () => {
    Alert.alert(
      "Supprimer la note",
      "Es-tu sûr de vouloir supprimer cette note ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteNote(note.$id); // ✅ suppression Appwrite
              if (onNoteDeleted) {
                onNoteDeleted(note.$id); // ✅ mise à jour locale
              }
              Alert.alert("✅ Note supprimée !");
            } catch (error) {
              console.error("Erreur suppression note :", error);
              Alert.alert("❌ Erreur", error.message || "Impossible de supprimer la note.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  // ✏️ Édition
  const handleEdit = () => {
    setEditModalVisible(true);
  };

  // Callback après modification
  const handleNoteUpdated = (updatedNote) => {
    if (onNoteUpdated) {
      onNoteUpdated(updatedNote);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.content} onPress={handleEdit}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.date}>Dernière modification : {formatDate(note.updatedAt)}</Text>
        <Text style={styles.noteContent} numberOfLines={3}>
          {note.content}
        </Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editText}>Modifier</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator size="small" color="red" />
          ) : (
            <Text style={styles.deleteText}>Supprimer</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* ✅ Modal d’édition */}
      <EditNoteModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onNoteUpdated={handleNoteUpdated}
        note={note}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  editButton: {
    marginRight: 16,
  },
  editText: {
    color: "#2196F3",
    fontWeight: "500",
  },
  deleteButton: {},
  deleteText: {
    color: "red",
    fontWeight: "500",
  },
});

export default NoteItem;
