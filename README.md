# 💬 SentraChat

A Real-Time Chat Web Application with AI Sentiment Analysis (Final Year Project)

---

## 📌 Project Overview

SentraChat is a full-stack real-time chat application built using **FastAPI (Python)** and **React (Vite)**.  
It uses **WebSocket communication** to enable instant messaging between users.

The system is designed for future integration of **AI-based sentiment analysis** to detect emotional tone in messages.

---

## 🚀 Features

- 🔐 User Authentication (Login/Register - Phase 6)
- 💬 Real-time chat using WebSocket
- 👥 Multi-user chat support (multiple browser tabs)
- ⚡ Instant message broadcasting
- 🟢 Live connection handling
- 📡 FastAPI backend API
- 🎨 React frontend UI

---

## 🛠️ Tech Stack

### Frontend:
- React (Vite)
- JavaScript
- HTML/CSS

### Backend:
- FastAPI
- WebSocket (Starlette)
- Python 3.10+

### Database (future phase):
- MySQL / PostgreSQL (planned)

---

## 📡 System Architecture

Frontend (React)
        ↓ WebSocket
Backend (FastAPI)
        ↓
Connection Manager
        ↓
Broadcast to all clients

---

## ⚙️ How to Run the Project

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd SentraChat