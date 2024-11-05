import React, { useState, useCallback, useEffect } from 'react';
import {
  Sun, Moon, Coffee, Utensils, Heart, Home, Music, Book, Volume2, VolumeX,
  Settings, User, Car, Phone, Mail, Tv, Star, Gift, Sparkles, Smile
} from 'lucide-react';

const AACBoard = () => {
  const [message, setMessage] = useState('');
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  // API-based translation function
  const translateToHindi = async (text) => {
    // Make sure to replace `YOUR_TRANSLATION_API_URL` and `YOUR_API_KEY` with the actual API details.
    const response = await fetch(`YOUR_TRANSLATION_API_URL`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer YOUR_API_KEY` },
      body: JSON.stringify({ q: text, target: 'hi' })
    });
    const data = await response.json();
    return data.translatedText || text;
  };

  // Categories and their buttons with associated phrases
  const categories = {
    "Basic Needs": [
      { icon: Coffee, label: "पानी चाहिए (Need Water)", color: "text-blue-500" },
      { icon: Utensils, label: "भूख लगी है (I'm Hungry)", color: "text-green-600" },
      { icon: Home, label: "घर जाना है (Want to go home)", color: "text-purple-600" },
      { icon: Smile, label: "दवा चाहिए (Need Medicine)", color: "text-red-500" }
    ],
    "Indian Festivals": [
      { icon: Star, label: "दीपावली की शुभकामनाएं (Happy Diwali)", color: "text-yellow-500" },
      { icon: Gift, label: "होली की शुभकामनाएं (Happy Holi)", color: "text-pink-500" },
      { icon: Sparkles, label: "शुभ नवरात्रि (Happy Navratri)", color: "text-orange-500" },
      { icon: Star, label: "पोंगल की शुभकामनाएं (Happy Pongal)", color: "text-green-500" }
    ],
    "Indian Food": [
      { icon: Utensils, label: "रोटी चाहिए (Want Roti)", color: "text-amber-600" },
      { icon: Coffee, label: "चाय पीनी है (Want Tea)", color: "text-brown-600" },
      { icon: Utensils, label: "दाल चाहिए (Want Dal)", color: "text-yellow-600" },
      { icon: Utensils, label: "सब्जी चाहिए (Want Sabzi)", color: "text-green-600" }
    ],
    "Family & Relations": [
      { icon: User, label: "माता जी को बुलाओ (Call Mother)", color: "text-pink-600" },
      { icon: User, label: "पिता जी को बुलाओ (Call Father)", color: "text-blue-600" },
      { icon: User, label: "दादी को बुलाओ (Call Grandmother)", color: "text-purple-600" },
      { icon: User, label: "भैया को बुलाओ (Call Brother)", color: "text-green-600" }
    ],
    "Daily Activities": [
      { icon: Smile, label: "पूजा करनी है (Want to pray)", color: "text-orange-500" },
      { icon: Music, label: "भजन सुनना है (Listen to Bhajans)", color: "text-purple-500" },
      { icon: Tv, label: "सीरियल देखना है (Watch Serial)", color: "text-blue-500" },
      { icon: User, label: "बाहर जाना है (Want to go out)", color: "text-green-500" }
    ],
    "Common Courtesies": [
      { icon: Smile, label: "नमस्ते (Namaste)", color: "text-orange-500" },
      { icon: Smile, label: "धन्यवाद (Thank you)", color: "text-green-500" },
      { icon: Smile, label: "क्षमा करें (Sorry)", color: "text-red-500" },
      { icon: Smile, label: "आशीर्वाद (Blessings)", color: "text-purple-500" }
    ],
    "Weather & Comfort": [
      { icon: Sun, label: "बहुत गरमी है (Too hot)", color: "text-red-500" },
      { icon: Moon, label: "ठंड लग रही है (Feeling cold)", color: "text-blue-500" },
      { icon: Sun, label: "पंखा चालू करो (Turn on fan)", color: "text-gray-500" },
      { icon: Sun, label: "एसी चालू करो (Turn on AC)", color: "text-blue-600" }
    ],
    "Transport": [
      { icon: Car, label: "रिक्शा बुलाओ (Call Rickshaw)", color: "text-yellow-500" },
      { icon: Car, label: "ऑटो बुलाओ (Call Auto)", color: "text-green-500" },
      { icon: Car, label: "कार बुलाओ (Call Car)", color: "text-blue-500" },
      { icon: Phone, label: "ओला/उबर बुलाओ (Call Ola/Uber)", color: "text-black" }
    ],
    "Religious Activities": [
      { icon: Smile, label: "मंदिर जाना है (Want to visit temple)", color: "text-orange-500" },
      { icon: Star, label: "आरती करनी है (Want to do aarti)", color: "text-yellow-500" },
      { icon: Smile, label: "प्रसाद चाहिए (Want prasad)", color: "text-purple-500" },
      { icon: Music, label: "मंत्र सुनना है (Listen to mantras)", color: "text-red-500" }
    ]
  };

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const hindiVoice = availableVoices.find(voice => voice.lang.startsWith('hi'));
      setVoices(availableVoices);
      setSelectedVoice(hindiVoice || availableVoices[0]);
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const speak = useCallback(async (text) => {
    if (!isSpeechEnabled) return;
    
    const hindiText = await translateToHindi(text);
    const utterance = new SpeechSynthesisUtterance(hindiText);
    utterance.voice = selectedVoice;
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    utterance.volume = 1;
    
    utterance.onend = () => setIsPlaying(false);
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  }, [isSpeechEnabled, selectedVoice, speechRate, speechPitch]);

  const handleButtonClick = (label) => {
    setMessage(label);
    speak(label);
  };

  const toggleSpeech = () => {
    setIsSpeechEnabled(!isSpeechEnabled);
    window.speechSynthesis.cancel();
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header with controls */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">संवाद पट्ट (Communication Board)</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
          <button 
            onClick={toggleSpeech}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            {isSpeechEnabled ? 
              <Volume2 className="w-6 h-6 text-blue-500" /> : 
              <VolumeX className="w-6 h-6 text-gray-500" />
            }
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Speech Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Voice</label>
              <select 
                className="w-full p-2 border rounded"
                value={selectedVoice?.name}
                onChange={(e) => setSelectedVoice(voices.find(v => v.name === e.target.value))}
              >
                {voices.map(voice => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Speed: {speechRate}x</label>
              <input 
                type="range" 
                min="0.5" 
                max="2" 
                step="0.1" 
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pitch: {speechPitch}</label>
              <input 
                type="range" 
                min="0.5" 
                max="2" 
                step="0.1" 
                value={speechPitch}
                onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Message Display */}
      <div 
        className={`h-24 mb-4 p-4 bg-white rounded-lg shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-transform ${isPlaying ? 'scale-105' : ''}`}
        onClick={() => message && speak(message)}
      >
        <p className="text-xl font-semibold text-center">{message || 'Click a button to communicate'}</p>
      </div>

      {/* Categories and Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(categories).map(([category, buttons]) => (
          <div key={category} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">{category}</h2>
            <div className="grid grid-cols-2 gap-3">
              {buttons.map((button, index) => (
                <button
                  key={index}
                  onClick={() => handleButtonClick(button.label)}
                  className={`p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all flex flex-col items-center gap-2 ${
                    isPlaying && message === button.label ? 'scale-105 bg-blue-50' : ''
                  }`}
                >
                  <button.icon className={`w-8 h-8 ${button.color}`} />
                  <span className="text-sm text-center">{button.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AACBoard;
