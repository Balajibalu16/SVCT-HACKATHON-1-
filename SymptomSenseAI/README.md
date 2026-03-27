# SymptomSense AI - Hackathon MVP 🏆

SymptomSense AI has been completely refactored from a static prototype into a **production-ready, dynamic healthtech MVC application**. 

## 🚀 What's New?
1. **Real Backend Engine (`server.js`)**: An Express.js backend API built from scratch.
2. **Dynamic Rule-Based Logic (`backend/rulesEngine.js`)**: Completely replaced fake mock replies with an intelligent JSON logic engine that computes exact clinical urgency, risk likelihood, and reasoning logic.
3. **Voice Intake (Speech Recognition)**: Added the HTML5 Web Speech API! Users can now tap the microphone on the chat bar to physically speak their symptoms to the AI.
4. **Geolocation Awareness**: Added real browser location hooks requesting user coordinates to map to local hospitals on the results view.
5. **Session History Memory**: Connected `localStorage` to securely store all previous checks locally for the patient.
6. **Dark Mode Integration**: Beautiful, full-contrast Dark Mode classes automatically connected via Tailwind and a responsive toggle button in the navigation.
7. **Offline AI Image Architecture**: Successfully downloaded and mapped 5 unique, stunning AI-generated food placeholder assets into the `/public/food` directory so the app doesn't break if rate-limited!

## ⚙️ How to Run

Because this is now a unified Full-Stack Application relying on an API backend, it cannot simply be double-clicked as an HTML file anymore.

### Prerequisites
* You must have **[Node.js](https://nodejs.org/en/download/)** installed on your system.

### Startup Commands
1. Open your terminal in this `SymptomSenseAI` folder.
2. Install the Node modules:
   ```bash
   npm install express cors
   ```
3. Start the Backend API and the Static Server:
   ```bash
   node server.js
   ```
4. Click the link the server outputs, or visit **http://localhost:3000** in your browser!

Good luck pitching the project! The UI architecture is incredibly clean, strictly decoupling the View (DOM IDs), the Controller (`app.js`), and the Logic (`rulesEngine.js`).
