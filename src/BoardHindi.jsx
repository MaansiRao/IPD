import React, { useState, useCallback, useEffect } from "react";
import {
  Coffee,
  Utensils,
  Home,
  Sun,
  Moon,
  Music,
  Book,
  Tv,
  Heart,
  Phone,
  Mail,
  Car,
  Gift,
  Sparkles,
  Cake,
  PartyPopper,
  SmilePlus,
  Flower,
  Drum,
  Soup,
  CandyCane,
  Computer,
  Smartphone,
  Camera,
  Plane,
  Backpack,
  Users,
  Smile,         // HappyFace
  Frown,         // SadFace
  Meh,          // BoredFace
  AlertTriangle, // ScaredFace
  Laugh,         // FunnyFace
  Angry,    // AngryFace
  Gift as Present, // Gift with a different label
  Volleyball,
  ShoppingBag,
  Pizza,
  Trophy,
  Headphones,
  PaintBucket,
  Cookie,
  Calendar,
  Candy,
  Settings,
  Volume2,
  Sunset
} from "lucide-react";
import Sidebar from './components/Sidebar';
const BoardHindi = () => {
  const [message, setMessage] = useState("");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voices, setVoices] = useState([]);

  const defaultPhrases = [
    { icon: Coffee, label: "मुझे चाय चाहिए", color: "text-blue-500" },
    { icon: Utensils, label: "मुझे खाना चाहिए", color: "text-green-600" },
    { icon: Home, label: "मैं घर जाना चाहता हूँ", color: "text-purple-600" },
    { icon: Sun, label: "सुुप्रभात!", color: "text-yellow-500" },
    { icon: Moon, label: "शुभ रात्रि!", color: "text-blue-800" },
    { icon: Smile, label: "आप कैसे हैं?", color: "text-indigo-500" }, // Changed User to Smile
    { icon: Music, label: "क्या हम संगीत चला सकते हैं?", color: "text-pink-500" },
    { icon: Book, label: "मैं पढ़ना चाहता हूँ", color: "text-orange-500" },
    { icon: Tv, label: "चलो टीवी देखते हैं", color: "text-blue-600" },
    { icon: Heart, label: "मैं तुमसे प्यार करता हूँ!", color: "text-red-500" },
    { icon: Smile, label: "मैं खुश हूँ", color: "text-yellow-600" }, // Changed User to Smile
    { icon: Phone, label: "कृपया कॉल करें", color: "text-green-500" },
    { icon: Mail, label: "मेरे पास एक संदेश है", color: "text-blue-500" },
    { icon: Car, label: "मुझे एक सवारी चाहिए", color: "text-gray-600" },
    { icon: Smile, label: "धन्यवाद!", color: "text-teal-500" }, // Changed User to Smile
    { icon: Smile, label: "आपका स्वागत है", color: "text-indigo-500" }, // Changed User to Smile
    { icon: Frown, label: "कृपया मदद करें", color: "text-red-500" }, // Changed User to Frown
    { icon: Meh, label: "मैं समझता हूँ", color: "text-green-500" }, // Changed User to Meh
    { icon: Smile, label: "आपसे मिलकर अच्छा लगा", color: "text-indigo-500" }, // Changed User to Smile
    { icon: Heart, label: "मैं थक गया हूँ", color: "text-purple-500" },
    { icon: Tv, label: "क्या हम कोई फिल्म देख सकते हैं?", color: "text-blue-600" },
    { icon: Sun, label: "चलो बाहर चलते हैं", color: "text-yellow-500" },
    { icon: Frown, label: "मैं उदास हूँ", color: "text-indigo-500" }, // Changed User to Frown
    { icon: Home, label: "मुझे आराम चाहिए", color: "text-purple-600" },
    { icon: Coffee, label: "मुझे ठंडा पेय चाहिए", color: "text-blue-500" },
    { icon: Volleyball, label: "चलो फुटबॉल खेलते हैं", color: "text-green-500" },
    { icon: Frown, label: "मैं बोर हूँ", color: "text-red-500" }, // Changed User to Frown
    { icon: Gift, label: "सरप्राइज?", color: "text-yellow-500" },
    { icon: Angry, label: "मैं गुस्से में हूँ", color: "text-indigo-500" }, // Changed User to Angry
    { icon: ShoppingBag, label: "क्या हम खरीदारी कर सकते हैं?", color: "text-pink-500" },
    { icon: Smile, label: "यह बहुत मजेदार है!", color: "text-purple-600" }, // Changed User to Smile
    { icon: Sparkles, label: "दीवाली मुबारक!", color: "text-yellow-500" },
    { icon: Cake, label: "जन्मदिन मुबारक!", color: "text-pink-500" },
    { icon: Frown, label: "मुझे आपकी याद आ रही है", color: "text-red-600" }, // Changed User to Frown
    { icon: PartyPopper, label: "चलो जश्न मनाते हैं!", color: "text-orange-500" },
    { icon: Flower, label: "रक्षा बंधन मुबारक", color: "text-purple-600" },
    { icon: Drum, label: "चलो नाचते हैं!", color: "text-indigo-500" },
    { icon: Soup, label: "क्या हम बिरयानी ले सकते हैं?", color: "text-green-500" },
    { icon: PartyPopper, label: "पार्टी का समय!", color: "text-blue-500" },
    { icon: Phone, label: "चलो वीडियो कॉल करते हैं", color: "text-yellow-600" },
    { icon: CandyCane, label: "क्रिसमस मुबारक!", color: "text-green-600" },
    { icon: Gift, label: "यहाँ एक उपहार है", color: "text-red-500" },
    { icon: Sunset, label: "चलो आतिशबाजी देखते हैं", color: "text-teal-500" },
    { icon: Pizza, label: "मुझे पिज्जा चाहिए", color: "text-orange-500" },
    { icon: Trophy, label: "मैं जीत गया!", color: "text-purple-500" },
    { icon: Headphones, label: "मुझे हेडफोन चाहिए", color: "text-blue-800" },
    { icon: Frown, label: "मैं डरा हुआ हूँ", color: "text-indigo-500" }, // Changed User to Frown
    { icon: Moon, label: "ईद मुबारक!", color: "text-green-800" },
    { icon: PaintBucket, label: "होली मुबारक!", color: "text-pink-500" },
    { icon: Cookie, label: "क्या मैं एक नाश्ता ले सकता हूँ?", color: "text-yellow-500" },
    { icon: Computer, label: "मुझे अपना टैबलेट चाहिए", color: "text-indigo-500" },
    { icon: Calendar, label: "क्या आज छुट्टी है?", color: "text-gray-600" },
    { icon: Camera, label: "मुझे फोटो लेना है", color: "text-orange-600" },
    { icon: Phone, label: "चलो कॉल करते हैं", color: "text-blue-500" },
    { icon: Cake, label: "खाना कहाँ है?", color: "text-pink-500" },
    { icon: Plane, label: "क्या हम छुट्टी पर जा सकते हैं?", color: "text-purple-600" },
    { icon: Candy, label: "मुझे कुछ मिठाइयाँ चाहिए", color: "text-yellow-600" },
    { icon: Backpack, label: "मुझे अपना बैग चाहिए", color: "text-green-700" },
    { icon: Phone, label: "मेरा फोन कहाँ है?", color: "text-blue-600" },
    { icon: Users, label: "आप कहाँ हैं?", color: "text-teal-500" },
    { icon: Smile, label: "मैं बहुत उत्साहित हूँ!", color: "text-purple-600" }, // Changed User to Smile
];


  // Fetch available voices on component mount
  useEffect(() => {
    const fetchVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const hindiVoices = availableVoices.filter(
        (voice) => voice.lang === "hi-IN" || voice.lang.startsWith("hi")
      );
      setVoices(hindiVoices);
      if (hindiVoices.length > 0) {
        setSelectedVoice(hindiVoices[0]); // Set default voice if available
      }
    };

    fetchVoices();

    // SpeechSynthesis event listener to fetch voices when they are loaded
    window.speechSynthesis.onvoiceschanged = fetchVoices;
  }, []);

  const speak = useCallback(
    (text) => {
      if (!isSpeechEnabled || !selectedVoice) return;
      setIsPlaying(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hi-IN";
      utterance.rate = speechRate;
      utterance.pitch = speechPitch;
      utterance.voice = selectedVoice; // Use the selected voice

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [isSpeechEnabled, speechRate, speechPitch, selectedVoice]
  );

  const handleButtonClick = (label) => {
    setMessage(label);
    speak(label);
  };

  const toggleSpeech = () => {
    setIsSpeechEnabled(!isSpeechEnabled);
  };

  return (
    <div>
    <div className="flex-1 p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Hindi Board</h1>
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
                onChange={(e) =>
                  setSelectedVoice(
                    voices.find((v) => v.name === e.target.value)
                  )
                }
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Speed: {speechRate}x
              </label>
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
              <label className="block text-sm font-medium mb-1">
                Pitch: {speechPitch}
              </label>
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
        className={`h-24 mb-4 p-4 bg-white rounded-lg shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-transform ${
          isPlaying ? "scale-105" : ""
        }`}
        onClick={() => message && speak(message)}
      >
        <p className="text-xl font-semibold text-center">
          {message || "Tap a button to communicate"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {" "}
        {/* Increased gap for better spacing */}
        {defaultPhrases.map((button, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(button.label)}
            className={`p-6 bg-gray-50 rounded-lg hover:shadow-md transition-all ${
              isPlaying && message === button.label
                ? "scale-105 bg-blue-50"
                : ""
            } flex flex-col items-center justify-center`} // Center content in button
          >
            <button.icon className={`w-10 h-10 ${button.color}`} />{" "}
            {/* Increased icon size */}
          </button>
        ))}
      </div>
    </div>
    </div>
  );
};

export default BoardHindi;
