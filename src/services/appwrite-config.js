import { Client } from "appwrite";
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "@env";

console.log("🧪 ENV TEST:");
console.log("APPWRITE_ENDPOINT =", APPWRITE_ENDPOINT);
console.log("APPWRITE_PROJECT_ID =", APPWRITE_PROJECT_ID);

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export default client;
