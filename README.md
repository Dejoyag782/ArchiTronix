# ⚡ ArchiTronix

**Computer Vision-Assisted Electrical Symbol Detection + Auto-Quotation Tool Based on Philippine Electrical Standards**  
Built with **React + Vite + TypeScript**

---

## 🧠 Overview

**ArchiTronix** is a lightweight web application that helps architects, engineers, and estimators detect electrical components in architectural **floor plans** and get **instant price quotations**.

It uses:

- 🧭 **Roboflow**: To detect and label electrical components from the uploaded blueprint.
- 🤖 **Gemini (Google)**: To analyze detected components and generate a quotation (unit prices, quantities, and total) based on **Philippine Electrical Standards**.

---

## ⚙️ Tech Stack

| Tech             | Purpose                           |
| ---------------- | --------------------------------- |
| **React**        | UI components                     |
| **Vite**         | Lightning-fast bundling           |
| **TypeScript**   | Type-safe development             |
| **Roboflow API** | Custom model for symbol detection |
| **Gemini API**   | Quotation generation via prompts  |

---

## 🚀 Features

- 🖼 Upload blueprint or floor plan images
- 🔍 Detects electrical symbols (outlets, switches, lights, etc.)
- 📦 Sends detection result to Gemini for quotation
- 💸 Gets total price, per-unit pricing, and item count
- 📐 Philippine Electrical Code (PEC)-compliant components

---

## 🧩 Project Structure

ArchiTronix/
├── public/ # Static assets
├── src/
│ ├── api/ # API calls to Roboflow and Gemini
│ ├── service/ # Service functions
│ ├── helpers/ # Helper functions
│ ├── types/ # TypeScript types/interfaces  
│ ├── App.tsx # Main app entry
│ └── main.tsx # Vite entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md

---

## 🖥️ Getting Started

### 📦 Install Dependencies

````bash
npm install
# or
yarn install

### 🚀 Run the Application

```bash
npm run dev
# or
yarn dev

````
