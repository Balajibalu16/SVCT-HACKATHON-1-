from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import time

app = Flask(__name__, static_folder='public')
CORS(app)

@app.route('/check', methods=['POST'])
def check():
    data = request.json
    if not data or not data.get('main'):
        return jsonify({"error": "Main symptom is required for analysis."}), 400
        
    text = f"{data.get('main', '')} {data.get('additional', '')}".lower()
    
    result = {
        "condition": 'General Discomfort',
        "confidence": 65,
        "urgency": 'Self-care',
        "advice": 'Rest, hydrate, and monitor your symptoms.',
        "matched_symptoms": [data.get('main')],
        "reasoning": 'Symptoms do not currently match severe acute patterns. Standard observation recommended.'
    }

    if any(word in text for word in ['chest', 'breathe', 'breathing', 'heart']):
        result.update({
            "condition": 'Possible Cardiac or Respiratory Event',
            "confidence": 95,
            "urgency": 'Emergency',
            "advice": 'Seek immediate emergency medical care. Call 911 or go to the nearest ER.',
            "matched_symptoms": ['Chest pain / Respiratory distress'],
            "reasoning": 'Chest pain or breathing difficulty are critically urgent symptoms requiring immediate evaluation.'
        })
    elif any(word in text for word in ['fever', 'hot']) and any(word in text for word in ['cough', 'throat']):
        result.update({
            "condition": 'Viral Infection / Flu',
            "confidence": 85,
            "urgency": 'Doctor',
            "advice": 'Rest and hydrate. If fever persists over 3 days or breathing worsens, consult a clinician.',
            "matched_symptoms": ['Fever', 'Cough/Sore Throat'],
            "reasoning": 'The combination of fever and respiratory symptoms strongly indicates a viral upper respiratory infection.'
        })
    elif 'headache' in text and 'severe' in data.get('severity', '').lower():
        result.update({
            "condition": 'Severe Migraine / Tension Headache',
            "confidence": 75,
            "urgency": 'Doctor',
            "advice": 'Take over-the-counter pain relief and rest in a dark room. Seek care if it is the "worst headache of your life".',
            "matched_symptoms": ['Severe Headache'],
            "reasoning": 'Severe headaches can be debilitating migraines or require evaluation to rule out secondary causes.'
        })
    elif any(word in text for word in ['nausea', 'vomit', 'stomach']):
        result.update({
            "condition": 'Gastroenteritis',
            "confidence": 80,
            "urgency": 'Self-care',
            "advice": 'Focus on clear fluids and the BRAT diet (Bananas, Rice, Applesauce, Toast). Ensure you are urinating normally.',
            "matched_symptoms": ['Gastrointestinal stress'],
            "reasoning": 'Gastroenteritis is typically self-limiting but requires strict hydration management.'
        })
      
    # Simulated Engine Latency  
    time.sleep(1.2)
    return jsonify(result)

@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join('public', path)):
        return send_from_directory('public', path)
    return send_from_directory('public', 'index.html')

if __name__ == '__main__':
    print("[READY] SymptomSense AI Python Backend is running!")
    print("[URL] Access it at http://localhost:3000")
    app.run(port=3000, debug=False)
