// src/services/auth.service.js
import { Account, ID } from "appwrite";
import client from "./appwrite-config";

class AuthService {
  constructor() {
    // Create Account instance from the client
    this.account = new Account(client);
  }

  // Register a new user
  async register(email, password, name) {
    try {
      const response = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      console.log("✅ User registered:", response);
      return response;
    } catch (error) {
      console.error("❌ Registration error:", error);
      throw error;
    }
  }

  // Login user
  async login(email, password) {
    try {
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );
      console.log("✅ User logged in:", session);
      return session;
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const user = await this.account.get();
      console.log("✅ Current user:", user);
      return user;
    } catch (error) {
      console.error("❌ Get user error:", error);
      return null;
    }
  }

  // Logout user
  async logout() {
    try {
      await this.account.deleteSession("current");
      console.log("✅ User logged out");
      return true;
    } catch (error) {
      console.error("❌ Logout error:", error);
      throw error;
    }
  }

  // Check if user is logged in
  async isLoggedIn() {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  }
}

// Export a singleton instance
const authService = new AuthService();
export default authService;