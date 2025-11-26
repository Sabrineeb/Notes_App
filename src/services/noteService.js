// services/noteService.js
import { Databases, ID, Query } from "appwrite";
import client from "./appwrite-config";
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_COLLECTION_ID,
} from "@env";

const appwriteDatabase = new Databases(client);

// 🔹 Récupérer toutes les notes pour un utilisateur spécifique
export const getNotes = async (userId) => {
  try {
    const response = await appwriteDatabase.listDocuments(
      APPWRITE_DATABASE_ID,  
      APPWRITE_COLLECTION_ID,
      [Query.equal("userId", userId), Query.orderDesc("$createdAt")]  // ✅ userId au lieu de user_id
    );
    return response.documents;
  } catch (error) {
    console.error("❌ Erreur chargement notes:", error);
    return [];
  }
};

// 🔹 Créer une note pour un utilisateur
export const addNote = async (title, content, userId) => {  // ✅ Séparer title et content
  try {
    const response = await appwriteDatabase.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      ID.unique(),
      {
        title,      // ✅ Attribut attendu par Appwrite
        content,    // ✅ Attribut attendu par Appwrite
        userId,     // ✅ userId au lieu de user_id
      }
    );
    console.log("✅ Note créée:", response);
    return response;
  } catch (error) {
    console.error("❌ Erreur création note:", error);
    throw new Error("Impossible d'ajouter la note.");
  }
};

// 🔹 Supprimer une note
export const deleteNote = async (noteId) => {
  if (!noteId) throw new Error("ID de la note manquant.");

  try {
    await appwriteDatabase.deleteDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      noteId
    );
    console.log("✅ Note supprimée:", noteId);
    return true;
  } catch (error) {
    console.error("❌ Erreur suppression note:", error);
    throw new Error("Impossible de supprimer la note.");
  }
};

// 🔹 Modifier une note
export const updateNote = async (noteId, data) => {
  try {
    const response = await appwriteDatabase.updateDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      noteId,
      data
    );
    console.log("✅ Note mise à jour:", response);
    return response;
  } catch (error) {
    console.error("❌ Erreur mise à jour note:", error);
    throw new Error("Impossible de modifier la note.");
  }
};