import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Volume2, VolumeX } from 'lucide-react';

const DynamicBoard = () => {
  const [buttons, setButtons] = useState([]);
  const [message, setMessage] = useState('');
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetchCurrentBoard();
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      setSelectedVoice(availableVoices[0]);
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const fetchCurrentBoard = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/customboard/current-dynamic/');
      if (!response.ok) throw new Error('Failed to fetch board');
      const data = await response.json();
      setButtons(data.buttons.map((label, index) => ({ id: index, label })));
    } catch (err) {
      console.error(err);
    }
  };

  const speak = useCallback((text) => {
    if (!isSpeechEnabled) return;
    window.speechSynthesis.cancel();
    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    utterance.onend = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  }, [isSpeechEnabled, selectedVoice, speechRate, speechPitch]);

  const handleButtonClick = (label) => {
    setMessage(label);
    speak(label);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dynamic AAC Board</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            {isSpeechEnabled ? (
              <Volume2 className="w-6 h-6 text-blue-500" />
            ) : (
              <VolumeX className="w-6 h-6 text-gray-500" />
            )}
          </button>
        </div>
      </div>

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
                  <option key={voice.name} value={voice.name}>{voice.name}</option>
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

      <div 
        className={`h-24 mb-4 p-4 bg-white rounded-lg shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-transform ${isPlaying ? 'scale-105' : ''}`}
        onClick={() => message && speak(message)}
      >
        <p className="text-xl font-semibold text-center">
          {message || "Tap a button to communicate"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => handleButtonClick(button.label)}
            className={`p-6 bg-gray-50 rounded-lg hover:shadow-md transition-all $
              {isPlaying && message === button.label ? 'scale-105 bg-blue-50' : ''} flex flex-col items-center justify-center space-y-3`}
          >
            <span className="text-sm font-medium text-gray-600">
              {button.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DynamicBoard;
