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
  Smile, // HappyFace
  Frown, // SadFace
  Meh, // BoredFace
  AlertTriangle, // ScaredFace
  Laugh, // FunnyFace
  Angry, // AngryFace
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
} from "lucide-react";
import EmergencyButton from "../components/EmergencyButton";
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
    {
      icon: Coffee,
      label: "मुझे चाय चाहिए",
      buttonLabel: "चाय",
      color: "text-blue-500",
    },
    {
      icon: Utensils,
      label: "मुझे खाना है",
      buttonLabel: "खाना",
      color: "text-green-600",
    },
    {
      icon: Home,
      label: "मैं घर जाना चाहता हूं",
      buttonLabel: "घर",
      color: "text-purple-600",
    },
    {
      icon: Sun,
      label: "सुप्रभात!",
      buttonLabel: "सुप्रभात",
      color: "text-yellow-500",
    },
    {
      icon: Moon,
      label: "शुभ रात्रि!",
      buttonLabel: "रात्रि",
      color: "text-blue-800",
    },
    {
      icon: Smile,
      label: "कैसे हैं आप?",
      buttonLabel: "कैसे",
      color: "text-indigo-500",
    },
    {
      icon: Music,
      label: "क्या हम संगीत बजा सकते हैं?",
      buttonLabel: "संगीत",
      color: "text-pink-500",
    },
    {
      icon: Book,
      label: "मैं पढ़ना चाहता हूं",
      buttonLabel: "पढ़ना",
      color: "text-orange-500",
    },
    {
      icon: Tv,
      label: "चलो टीवी देखें",
      buttonLabel: "टीवी",
      color: "text-blue-600",
    },
    {
      icon: Heart,
      label: "मैं आपसे प्यार करता हूं!",
      buttonLabel: "प्यार",
      color: "text-red-500",
    },
    {
      icon: Smile,
      label: "मैं खुश हूं",
      buttonLabel: "खुश",
      color: "text-yellow-600",
    },
    {
      icon: Phone,
      label: "कृपया कॉल करें",
      buttonLabel: "कॉल",
      color: "text-green-500",
    },
    {
      icon: Mail,
      label: "मेरे पास एक संदेश है",
      buttonLabel: "संदेश",
      color: "text-blue-500",
    },
    {
      icon: Car,
      label: "मुझे सवारी चाहिए",
      buttonLabel: "सवारी",
      color: "text-gray-600",
    },
    {
      icon: Gift,
      label: "धन्यवाद!",
      buttonLabel: "धन्यवाद",
      color: "text-teal-500",
    },
    {
      icon: Smile,
      label: "स्वागत है",
      buttonLabel: "स्वागत",
      color: "text-indigo-500",
    },
    {
      icon: AlertTriangle,
      label: "कृपया मदद करें",
      buttonLabel: "मदद",
      color: "text-red-500",
    },
    {
      icon: Smile,
      label: "मैं समझता हूं",
      buttonLabel: "समझ",
      color: "text-green-500",
    },
    {
      icon: Smile,
      label: "आपसे मिलकर खुशी हुई",
      buttonLabel: "मिलना",
      color: "text-indigo-500",
    },
    {
      icon: Moon,
      label: "मैं थक गया हूं",
      buttonLabel: "थका",
      color: "text-purple-500",
    },
    {
      icon: Tv,
      label: "क्या हम फिल्म देख सकते हैं?",
      buttonLabel: "फिल्म",
      color: "text-blue-600",
    },
    {
      icon: Frown,
      label: "मैं दुखी हूं",
      buttonLabel: "दुखी",
      color: "text-indigo-500",
    },
    {
      icon: Home,
      label: "मुझे आराम चाहिए",
      buttonLabel: "आराम",
      color: "text-purple-600",
    },
    {
      icon: Coffee,
      label: "मुझे ठंडा पेय चाहिए",
      buttonLabel: "पेय",
      color: "text-blue-500",
    },
    {
      icon: Volleyball,
      label: "चलो फुटबॉल खेलें",
      buttonLabel: "फुटबॉल",
      color: "text-green-500",
    },
    {
      icon: Meh,
      label: "मुझे बोर हो रहा है",
      buttonLabel: "बोर",
      color: "text-red-500",
    },
    {
      icon: Gift,
      label: "सरप्राइज़?",
      buttonLabel: "१",
      color: "text-yellow-500",
    },
    {
      icon: Angry,
      label: "मैं गुस्से में हूं",
      buttonLabel: "गुस्सा",
      color: "text-indigo-500",
    },
    {
      icon: ShoppingBag,
      label: "क्या हम शॉपिंग कर सकते हैं?",
      buttonLabel: "शॉपिंग",
      color: "text-pink-500",
    },
    {
      icon: Laugh,
      label: "यह बहुत मज़ेदार है!",
      buttonLabel: "मज़ेदार",
      color: "text-purple-600",
    },
    {
      icon: Sparkles,
      label: "दीपावली की शुभकामनाएं!",
      buttonLabel: "दीवाली",
      color: "text-yellow-500",
    },
    {
      icon: Cake,
      label: "जन्मदिन मुबारक!",
      buttonLabel: "जन्मदिन",
      color: "text-pink-500",
    },
    {
      icon: Frown,
      label: "मैं आपको याद करता हूं",
      buttonLabel: "याद",
      color: "text-red-600",
    },
    {
      icon: PartyPopper,
      label: "चलो जश्न मनाएं!",
      buttonLabel: "जश्न",
      color: "text-orange-500",
    },
    {
      icon: Flower,
      label: "रक्षा बंधन की शुभकामनाएं",
      buttonLabel: "राखी",
      color: "text-purple-600",
    },
    {
      icon: Drum,
      label: "चलो नाचें!",
      buttonLabel: "नाच",
      color: "text-indigo-500",
    },
    {
      icon: Soup,
      label: "क्या हम बिरयानी खा सकते हैं?",
      buttonLabel: "बिरयानी",
      color: "text-green-500",
    },
    {
      icon: PartyPopper,
      label: "पार्टी का समय!",
      buttonLabel: "पार्टी",
      color: "text-blue-500",
    },
    {
      icon: Phone,
      label: "चलो वीडियो कॉल करें",
      buttonLabel: "वीडियो",
      color: "text-yellow-600",
    },
    {
      icon: CandyCane,
      label: "क्रिसमस की शुभकामनाएं!",
      buttonLabel: "क्रिसमस",
      color: "text-green-600",
    },
    {
      icon: Present,
      label: "यह रहा उपहार",
      buttonLabel: "उपहार",
      color: "text-red-500",
    },
    {
      icon: SmilePlus,
      label: "चलो आतिशबाजी देखें",
      buttonLabel: "आतिशबाजी",
      color: "text-teal-500",
    },
    {
      icon: Pizza,
      label: "मुझे पिज्जा चाहिए",
      buttonLabel: "पिज्जा",
      color: "text-orange-500",
    },
    {
      icon: Trophy,
      label: "मैं जीत गया!",
      buttonLabel: "जीत",
      color: "text-purple-500",
    },
    {
      icon: Headphones,
      label: "मुझे हेडफोन चाहिए",
      buttonLabel: "हेडफोन",
      color: "text-blue-800",
    },
    {
      icon: AlertTriangle,
      label: "मैं डरा हुआ हूं",
      buttonLabel: "डर",
      color: "text-indigo-500",
    },
    {
      icon: Moon,
      label: "ईद मुबारक!",
      buttonLabel: "ईद",
      color: "text-green-800",
    },
    {
      icon: PaintBucket,
      label: "होली की शुभकामनाएं!",
      buttonLabel: "होली",
      color: "text-pink-500",
    },
    {
      icon: Cookie,
      label: "क्या मुझे नाश्ता मिल सकता है?",
      buttonLabel: "नाश्ता",
      color: "text-yellow-500",
    },
    {
      icon: Computer,
      label: "मुझे मेरा टैबलेट चाहिए",
      buttonLabel: "टैबलेट",
      color: "text-indigo-500",
    },
    {
      icon: Calendar,
      label: "क्या आज छुट्टी है?",
      buttonLabel: "छुट्टी",
      color: "text-gray-600",
    },
    {
      icon: Smartphone,
      label: "सेल्फी लो!",
      buttonLabel: "सेल्फी",
      color: "text-red-600",
    },
    {
      icon: Camera,
      label: "मैं फोटो लेना चाहता हूं",
      buttonLabel: "फोटो",
      color: "text-orange-600",
    },
    {
      icon: Phone,
      label: "चलो कॉल करें",
      buttonLabel: "कॉल",
      color: "text-blue-500",
    },
    {
      icon: Cake,
      label: "खाना कहाँ है?",
      buttonLabel: "खाना",
      color: "text-pink-500",
    },
    {
      icon: Plane,
      label: "क्या हम छुट्टी पर जा सकते हैं?",
      buttonLabel: "छुट्टी",
      color: "text-purple-600",
    },
    {
      icon: Candy,
      label: "मुझे मिठाई चाहिए",
      buttonLabel: "मिठाई",
      color: "text-yellow-600",
    },
    {
      icon: Backpack,
      label: "मुझे मेरा बैग चाहिए",
      buttonLabel: "बैग",
      color: "text-green-700",
    },
    {
      icon: Phone,
      label: "मेरा फोन कहाँ है?",
      buttonLabel: "फोन",
      color: "text-blue-600",
    },
    {
      icon: Users,
      label: "आप कहाँ हैं?",
      buttonLabel: "कहाँ",
      color: "text-teal-500",
    },
    {
      icon: SmilePlus,
      label: "मैं बहुत उत्साहित हूं!",
      buttonLabel: "उत्साहित",
      color: "text-purple-600",
    },
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
      <div>
        <EmergencyButton/>
      </div>
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
          {defaultPhrases.map((button, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(button.label)}
              className={`p-6 bg-gray-50 rounded-lg hover:shadow-md transition-all ${
                isPlaying && message === button.label
                  ? "scale-105 bg-blue-50"
                  : ""
              } flex flex-col items-center justify-center space-y-3`} // Added space between icon and label
            >
              <button.icon className={`w-10 h-10 ${button.color}`} />
              <span className="text-sm font-medium text-gray-600">
                {button.buttonLabel}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardHindi;
