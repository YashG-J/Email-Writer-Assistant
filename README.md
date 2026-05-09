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

GEMINI_URL=https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=  
GEMINI_KEY=your_api_key  

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
## Screenshots
<p align="center">
  <img src="screenshots/front.png" width="700"/>
</p>
<p align="center">
  <img src="screenshots/second.png" width="700"/>
</p>
<p align="center">
  <img src="screenshots/email.png" width="700"/>
</p>

