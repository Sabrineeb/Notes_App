// src/screens/NoteEditScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const NoteEditScreen = ({ route, navigation }) => {
  const { note } = route.params || {};
  const [text, setText] = useState(note?.text || "");

  const handleSave = () => {
    // Ici tu peux appeler la fonction updateNote
    console.log("Saving note:", text);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Edit Note:</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        multiline
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 20, height: 100, textAlignVertical: "top" },
});

export default NoteEditScreen;
