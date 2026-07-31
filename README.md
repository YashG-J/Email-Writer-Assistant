# Email Writer Assistant

AI-powered Chrome extension to generate email replies using React, Spring Boot, and Gemini API.

---

## Project Structure

Email-Writer-Assistant/
- backend/
- frontend/
- extension/

---

## Backend Setup

cd backend  
mvn spring-boot:run  

Runs on: http://localhost:8080  

---

## ⚠️ Important

Backend **must be running** for the extension and frontend to work properly.

---

## Environment Variables (IntelliJ)

Run → Edit Configurations → Environment Variables

Add:

GEMINI_URL=https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent  
GEMINI_KEY=your_api_key  
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://mail.google.com  

The API key is sent in the `x-goog-api-key` header, so `GEMINI_URL` must **not** include `?key=`.
Copy `backend/email-ai-reply/src/main/resources/application.properties.example` to
`application.properties` (git-ignored) to run outside IntelliJ.

---

## API Testing (Postman)

POST http://localhost:8080/api/email/generate  

Body (JSON):

{
  "emailContent": "I am not available tomorrow",
  "tone": "professional"
}

---

## Frontend Setup

cd frontend  
npm install  
npm run dev  

Runs on: http://localhost:5173  

---

## Chrome Extension Setup

1. chrome://extensions/ open  
2. Developer mode ON  
3. Load unpacked → select extension folder  

---
