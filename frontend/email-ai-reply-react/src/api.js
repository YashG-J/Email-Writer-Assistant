import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Calls the backend and returns the generated reply as a string.
 */
export async function generateEmailReply({ emailContent, tone }) {
  const response = await axios.post(`${API_URL}/api/email/generate`, {
    emailContent,
    tone,
  });

  return typeof response.data === "string"
    ? response.data
    : JSON.stringify(response.data);
}
