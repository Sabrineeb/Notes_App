import { Databases, ID, Query } from "appwrite";
import client from "./appwrite-config";
import { APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID } from "@env";

// 🧠 Vérification connexion
console.log("🔐 Appwrite DB:", APPWRITE_DATABASE_ID);
console.log("🔗 Endpoint:", client.config.endpoint);

const databases = new Databases(client);

// 🔹 Récupérer toutes les notes
export const getNotes = async () => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      [Query.orderDesc("$createdAt")]
    );
    return response.documents;
  } catch (error) {
    console.error("❌ Erreur chargement notes:", error);
    throw new Error("Impossible de charger les notes.");
  }
};

// 🔹 Créer une note
export const createNote = async (data) => {
  try {
    console.log("📝 Création note:", data);

    const response = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      ID.unique(),
      data
    );

    console.log("✅ Note créée avec succès:", response);
    return response;
  } catch (error) {
    console.error("❌ Erreur création note:", error);
    throw new Error("Impossible d’enregistrer la note.");
  }
};

// 🔹 Supprimer une note
export const deleteNote = async (noteId) => {
  if (!noteId) {
    console.error("❌ ID de la note manquant");
    throw new Error("ID de la note manquant.");
  }

  try {
    console.log("🗑️ Suppression de la note:", noteId);

    await databases.deleteDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      noteId
    );

    console.log("✅ Note supprimée avec succès.");
    return true;
  } catch (error) {
    console.error("❌ Erreur suppression note:", error);

    // Erreur de permission
    if (error?.message?.toLowerCase().includes("permission")) {
      throw new Error("Vérifie les permissions (Delete) dans Appwrite.");
    }

    // Erreur 404 (note inexistante)
    if (error?.code === 404) {
      throw new Error("Note introuvable ou déjà supprimée.");
    }

    // Erreur inconnue
    throw new Error("Impossible de supprimer la note. Réessaie.");
  }
};

// 🔹 Modifier une note
export const updateNote = async (noteId, data) => {
  try {
    console.log("✏️ Mise à jour de la note:", noteId, data);

    const response = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      noteId,
      data
    );

    console.log("✅ Note mise à jour:", response);
    return response;
  } catch (error) {
    console.error("❌ Erreur mise à jour:", error);
    throw new Error("Impossible de modifier la note.");
  }
};
