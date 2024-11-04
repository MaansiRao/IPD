import React, { useState, useCallback, useEffect } from 'react';
import { Sun, Moon, Coffee, Utensils, Heart, Home, Music, Book, Volume2, VolumeX, 
         Settings, User, Car, Phone, Mail, Tv } from 'lucide-react';

const AACBoard = () => {
  const [message, setMessage] = useState('');
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  
  // Categories and their buttons with associated phrases
  const categories = {
    "Basic Needs": [
      { icon: Coffee, label: "I'm thirsty", color: "text-blue-500" },
      { icon: Utensils, label: "I'm hungry", color: "text-green-600" },
      { icon: Home, label: "I want to go home", color: "text-purple-600" }
    ],
    "Time & Greetings": [
      { icon: Sun, label: "Good morning", color: "text-yellow-500" },
      { icon: Moon, label: "Good night", color: "text-blue-800" },
      { icon: User, label: "Nice to meet you", color: "text-indigo-500" }
    ],
    "Activities": [
      { icon: Music, label: "Can we listen to music?", color: "text-pink-500" },
      { icon: Book, label: "I want to read a book", color: "text-orange-500" },
      { icon: Tv, label: "Let's watch TV", color: "text-blue-600" }
    ],
    "Feelings & Emotions": [
      { icon: Heart, label: "I love you", color: "text-red-500" },
      { icon: User, label: "I'm happy", color: "text-yellow-600" },
      { icon: User, label: "I'm tired", color: "text-purple-500" },
      { icon: User, label: "I need help", color: "text-red-600" }
    ],
    "Communication": [
      { icon: Phone, label: "Please call me", color: "text-green-500" },
      { icon: Mail, label: "I have a message", color: "text-blue-500" },
      { icon: Car, label: "I need a ride", color: "text-gray-600" }
    ],
    "Common Phrases": [
      { icon: User, label: "Thank you", color: "text-teal-500" },
      { icon: User, label: "You're welcome", color: "text-indigo-500" },
      { icon: User, label: "Please help", color: "text-red-500" },
      { icon: User, label: "I understand", color: "text-green-500" }
    ]
  };

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      setSelectedVoice(availableVoices[0]);
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const speak = useCallback((text) => {
    if (!isSpeechEnabled) return;
    
    window.speechSynthesis.cancel();
    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    // Play a subtle "pop" sound effect
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1LODgvPkhUY3N5gIWGhYB6cmlgWFBLR0ZFRUVFRUVFRUZGSElKTE5PUVNVV1laW1xcXF1dXV5fYGFiYmNjZGRlZmZnZ2hoaGlpampra2xsbW1ubm9vcHBxcXJyc3N0dHR1dXZ2d3d4eHl5enp7e3x8fX1+fn9/gICBgYGCgoODhISFhYaGh4eIiImJioqLi4yMjY2Ojo+PkJCRkZKSk5OUlJWVlpaXl5iYmZmampubnJydnZ6en5+goKGhoqKjo6SkpaWmpqenqKipqaqqq6usrK2tra6ur6+wsLGxsrKzs7S0tbW2tre3uLi5ubq6u7u8vL29vr6/v8DAwcHCwsPDxMTFxcbGx8fIyMnJysrLy8zMzc3Ozs/P0NDR0dLS09PU1NXV1tbX19jY2dna2tvb3Nzd3d7e39/g4OHh4uLj4+Tk5eXm5ufn6Ojp6erq6+vs7O3t7u7v7/Dw8fHy8vPz9PT19fb29/f4+Pn5+vr7+/z8/f3+/v8AAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufn6Ojp6erq6+vs7O3t7u7v7/Dw8fHy8vPz9PT19fb29/f4+Pn5+vr7+/z8/f3+/v8=');
    audio.play();

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
        <h1 className="text-2xl font-bold">Communication Board</h1>
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