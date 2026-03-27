// State Management for Guided Assessment
const state = {
  step: 0,
  main: '',
  duration: '',
  severity: '',
  additional: ''
};

// UI Elements
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const resultsView = document.getElementById('results-view');
const micBtn = document.getElementById('mic-btn');

const questions = [
  "What is your main symptom today?",
  "How long have you been experiencing this?",
  "How severe is it? (Mild, Moderate, Severe)",
  "Do you have any other symptoms (like fever, nausea, etc)?"
];

// Dark Mode Toggle
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
  }
  
  // Setup Speech Recognition
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    micBtn.addEventListener('click', () => {
      micBtn.classList.add('animate-pulse', 'bg-red-500');
      recognition.start();
    });
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      chatInput.value = transcript;
      micBtn.classList.remove('animate-pulse', 'bg-red-500');
    };
    
    recognition.onerror = () => micBtn.classList.remove('animate-pulse', 'bg-red-500');
    recognition.onend = () => micBtn.classList.remove('animate-pulse', 'bg-red-500');
  } else {
    micBtn.style.display = 'none'; // Not supported
  }
});

function appendMessage(text, isUser = false) {
  const align = isUser ? 'flex-row-reverse' : 'flex-row';
  const bg = isUser ? 'bg-navy-900 border-navy-900 text-white dark:bg-navy-700 dark:border-navy-700' : 'bg-white border-slate-200 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100';
  const rTail = isUser ? 'rounded-tr-none' : 'rounded-tl-none';
  const icon = isUser 
    ? '<div class="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 bg-navy-900 text-white text-xs font-bold shadow-sm">U</div>'
    : '<div class="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 bg-health-100 text-health-600 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg></div>';
    
  chatMessages.innerHTML += `
    <div class="flex gap-4 ${align} animate-fade-in mt-4">
      ${icon}
      <div class="flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}">
        <div class="px-4 py-3 rounded-2xl border ${bg} ${rTail} shadow-sm">
          <p class="text-sm leading-relaxed">${text}</p>
        </div>
      </div>
    </div>
  `;
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const id = 'typing-' + Date.now();
  chatMessages.innerHTML += `
    <div id="${id}" class="flex gap-4 flex-row animate-fade-in mt-4">
      <div class="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 bg-health-100 text-health-600 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg></div>
      <div class="px-4 py-4 rounded-2xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-tl-none shadow-sm flex items-center gap-1">
        <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
        <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
      </div>
    </div>
  `;
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return id;
}

async function handleLogic(input) {
  if(!input.trim()) return;
  chatInput.value = '';
  document.getElementById('empty-state').style.display = 'none';
  
  appendMessage(input, true);
  
  // Save to state
  if(state.step === 0) state.main = input;
  else if(state.step === 1) state.duration = input;
  else if(state.step === 2) state.severity = input;
  else if(state.step === 3) state.additional = input;
  
  state.step++;
  
  const typingId = showTyping();
  
  setTimeout(async () => {
    const el = document.getElementById(typingId);
    if(el) el.remove();
    
    if (state.step < questions.length) {
      appendMessage(questions[state.step]);
    } else {
      appendMessage("Thank you. Our logic engine is securely processing your intake...");
      const finalTyping = showTyping();
      
      try {
        const response = await fetch('http://localhost:3000/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state)
        });
        
        const data = await response.json();
        document.getElementById(finalTyping).remove();
        showResults(data);
      } catch (err) {
        document.getElementById(finalTyping).remove();
        appendMessage("An error occurred connecting to the backend. Ensure python server.py is running on port 3000!");
      }
    }
  }, 600);
}

function showResults(data) {
  // Update Results Overlay dynamically
  document.getElementById('res-condition').textContent = data.condition;
  document.getElementById('res-reasoning').textContent = data.reasoning;
  document.getElementById('res-advice').textContent = data.advice;
  
  const urgencyEl = document.getElementById('res-urgency');
  urgencyEl.textContent = "Urgency: " + data.urgency;
  urgencyEl.className = "inline-flex items-center gap-2 px-6 py-3 rounded-full shadow-lg border-2 font-bold " + 
    (data.urgency === 'Emergency' ? "bg-red-100 border-red-300 text-red-800" : 
     data.urgency === 'Doctor' ? "bg-yellow-100 border-yellow-300 text-yellow-800" : 
     "bg-green-100 border-green-300 text-green-800");

  const confEl = document.getElementById('res-confidence');
  confEl.style.width = data.confidence + '%';
  document.getElementById('res-confidence-text').textContent = data.confidence + '% match';
  
  // Save Local Storage History
  let history = JSON.parse(localStorage.getItem('ss_history') || '[]');
  history.push({ date: new Date().toLocaleDateString(), condition: data.condition });
  localStorage.setItem('ss_history', JSON.stringify(history));

  // Auto-detect Geolocation for Hospitals
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => { document.getElementById('geo-status').textContent = "Hospitals near your location"; },
      (err) => { document.getElementById('geo-status').textContent = "Showing general hospitals (Location disabled)"; }
    );
  }

  resultsView.classList.remove('hidden');
}

function startOver() {
  state.step = 0;
  state.main = ''; state.duration = ''; state.severity = ''; state.additional = '';
  document.getElementById('chat-messages').innerHTML = document.getElementById('empty-state').outerHTML;
  document.getElementById('empty-state').style.display = 'flex';
  resultsView.classList.add('hidden');
}

window.sendMockMessage = handleLogic; // bridging old buttons

// Mock Data Renderers for Nearby Services
const precautionsData = [
  { title: "Hydration & Rest", desc: "Maintain adequate fluid intake (water, broths) and prioritize 8+ hours of rest.", icon: "💧" },
  { title: "Infection Control", desc: "Wash hands frequently with soap. Use masks if coughing or sneezing near others.", icon: "😷" },
  { title: "Temperature Monitoring", desc: "Track fever trends every 4 hours. Use light clothing and cooling compresses if running hot.", icon: "🌡️" },
  { title: "Air Circulation", desc: "Keep windows slightly open to cycle fresh air and prevent pathogen concentration.", icon: "🌬️" }
];

const nursesData = [
  { name: "Sarah Jenkins", location: "Downtown West", contact: "(555) 123-4567" },
  { name: "Michael Chen", location: "Northside Suburbs", contact: "(555) 234-5678" }
];

const doctorsData = [
  { name: "Dr. James Wilson", spec: "General Physician", cures: "Fever, Cough, General Malaise, Viral Infections", rating: "4.9" },
  { name: "Dr. Olivia Martinez", spec: "Cardiologist", cures: "Chest Pain, Blood Pressure, Heart Palpitations", rating: "4.8" },
  { name: "Dr. Ethan Brown", spec: "Gastroenterologist", cures: "Stomach Pain, Nausea, Digestion Issues, Ulcers", rating: "4.7" },
  { name: "Dr. Sophia Lee", spec: "Neurologist", cures: "Severe Migraines, Vertigo, Nerve Pain, Seizures", rating: "4.9" },
  { name: "Dr. William Taylor", spec: "Pulmonologist", cures: "Breathing Issues, Asthma, COPD, Lung Infections", rating: "4.6" },
  { name: "Dr. Isabella Scott", spec: "Pediatrician", cures: "Children's Fevers, Childhood Vaccinations, Growth Issues", rating: "4.9" },
  { name: "Dr. Lucas King", spec: "Dermatologist", cures: "Rashes, Severe Acne, Skin Infections, Allergies", rating: "4.8" },
  { name: "Dr. Mia Rodriguez", spec: "ENT Specialist", cures: "Sore Throat, Hearing Loss, Sinusitis, Vertigo", rating: "4.7" },
  { name: "Dr. Benjamin Green", spec: "Orthopedist", cures: "Joint Pain, Fractures, Arthritis, Muscle Strains", rating: "4.5" },
  { name: "Dr. Charlotte Harris", spec: "Psychiatrist", cures: "Anxiety, Depression, Insomnia, Panic Attacks", rating: "4.9" },
  { name: "Dr. Henry Clark", spec: "Endocrinologist", cures: "Diabetes Management, Thyroid Issues, Hormones", rating: "4.8" },
  { name: "Dr. Amelia Lewis", spec: "Gynecologist", cures: "Women's Health, Pregnancy Care, Hormonal Imbalance", rating: "4.9" }
];

const foodData = {
  "Fever": ["Rice porridge (kanji)", "Banana (Fruit)", "Watermelon (Fruit)", "Steamed broccoli (Vegetable)", "Carrot soup (Vegetable)", "Coconut water", "Soft idli"],
  "Cough/Sore Throat": ["Warm ginger tea", "Soft pear (Fruit)", "Baked apple (Fruit)", "Steamed sweet potato (Vegetable)", "Boiled spinach (Vegetable)", "Honey and lemon water", "Oatmeal"]
};

function getFoodImage(food) {
  const lc = food.toLowerCase();
  const root = 'http://localhost:3000/food/';
  if (lc.includes('rice') || lc.includes('kanji') || lc.includes('idli')) return root + 'rice.png';
  if (lc.includes('fruit') || lc.includes('banana') || lc.includes('apple') || lc.includes('watermelon') || lc.includes('orange') || lc.includes('berries') || lc.includes('pear')) return root + 'fruit.png';
  if (lc.includes('tea') || lc.includes('water') || lc.includes('coconut')) return root + 'tea.png';
  if (lc.includes('soup') || lc.includes('broth') || lc.includes('dal') || lc.includes('broccoli') || lc.includes('spinach') || lc.includes('carrots') || lc.includes('zucchini') || lc.includes('kale') || lc.includes('peppers') || lc.includes('potato') || lc.includes('squash')) return root + 'soup.png';
  return root + 'toast.png'; 
}

function renderServices() {
  const nursesContainer = document.getElementById('nurses-list-container');
  if(nursesContainer) {
    nursesContainer.innerHTML = nursesData.map(n => `
      <div class="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-sm">
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 bg-health-50 dark:bg-health-900/30 text-health-600 rounded-full flex items-center justify-center font-bold text-lg ring-1 ring-health-100">${n.name.charAt(0)}</div>
          <div>
            <h4 class="font-bold text-navy-900 dark:text-white">${n.name}</h4>
            <p class="text-[11px] text-slate-500 font-bold uppercase">${n.location}</p>
          </div>
        </div>
        <a href="tel:${n.contact}" class="px-5 py-2.5 bg-health-50 text-health-700 font-bold text-sm rounded-full cursor-pointer">${n.contact}</a>
      </div>
    `).join('');
  }

  const foodContainer = document.getElementById('food-list-container');
  if(foodContainer) {
    foodContainer.innerHTML = Object.entries(foodData).map(([symptom, foods]) => `
      <div class="bg-white dark:bg-slate-800 border text-left dark:border-slate-700 rounded-xl shadow-sm p-5 mb-4">
        <h3 class="font-bold text-lg text-navy-900 dark:text-white border-b dark:border-slate-700 pb-2 mb-3 flex items-center gap-2">
          <div class="h-2 w-2 rounded-full bg-health-500"></div>${symptom}
        </h3>
        <ul class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          ${foods.map(food => `
            <li class="bg-white dark:bg-slate-900/50 border dark:border-slate-700 rounded-xl overflow-hidden flex flex-col group transition-all">
              <div class="h-24 w-full bg-slate-100 relative overflow-hidden border-b dark:border-slate-700">
                <img src="${getFoodImage(food)}" class="object-cover w-full h-full opacity-90 group-hover:scale-110 transition-transform duration-[600ms]" loading="lazy" />
              </div>
              <div class="p-3 text-center">
                <p class="text-xs font-semibold text-slate-800 dark:text-slate-200">${food}</p>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('');
  }

  const doctorsContainer = document.getElementById('doctors-list-container');
  if(doctorsContainer) {
    doctorsContainer.innerHTML = doctorsData.map(d => `
      <div class="flex flex-col sm:flex-row items-center justify-between p-5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-sm hover:border-health-400 dark:hover:border-health-500 transition-colors">
        <div class="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
          <div class="h-14 w-14 bg-health-50 dark:bg-health-900/30 text-health-600 rounded-full flex items-center justify-center font-bold text-2xl ring-1 ring-health-100 flex-shrink-0">⚕️</div>
          <div>
            <div class="flex items-center gap-2 mb-0.5">
              <h4 class="font-bold text-lg text-navy-900 dark:text-white">${d.name}</h4>
              <span class="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold flex items-center shadow-sm uppercase tracking-widest whitespace-nowrap">★ ${d.rating}</span>
            </div>
            <p class="text-[13px] font-bold text-health-600 mb-1.5">${d.spec}</p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed tracking-wide"><strong>Cures:</strong> ${d.cures}</p>
          </div>
        </div>
        <button onclick="alert('Securely connecting to calendar API for ${d.name}...')" class="w-full sm:w-auto px-6 py-2.5 bg-health-600 hover:bg-health-700 text-white font-bold text-sm rounded-full shadow-md transition-colors whitespace-nowrap">Book Appointment</button>
      </div>
    `).join('');
  }

  const precautionsContainer = document.getElementById('precautions-list-container');
  if(precautionsContainer) {
    precautionsContainer.innerHTML = precautionsData.map(p => `
      <div class="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-sm p-5 hover:border-health-400 dark:hover:border-health-500 transition-colors">
        <div class="h-12 w-12 bg-health-50 dark:bg-health-900/30 text-health-600 rounded-full flex items-center justify-center text-xl mb-3 ring-1 ring-health-100">${p.icon}</div>
        <h4 class="font-bold text-lg text-navy-900 dark:text-white mb-2">${p.title}</h4>
        <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">${p.desc}</p>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', renderServices);
