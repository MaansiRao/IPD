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

const BoardEnglish = () => {
  const [message, setMessage] = useState("");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  const defaultPhrases = [
    {
      icon: Coffee,
      label: "I need some chai",
      buttonLabel: "Chai",
      color: "text-blue-500",
    },
    {
      icon: Utensils,
      label: "I want to eat",
      buttonLabel: "Eat",
      color: "text-green-600",
    },
    {
      icon: Home,
      label: "I want to go home",
      buttonLabel: "Home",
      color: "text-purple-600",
    },
    {
      icon: Sun,
      label: "Good morning!",
      buttonLabel: "Morning",
      color: "text-yellow-500",
    },
    {
      icon: Moon,
      label: "Good night!",
      buttonLabel: "Night",
      color: "text-blue-800",
    },
    {
      icon: Smile,
      label: "How are you?",
      buttonLabel: "How",
      color: "text-indigo-500",
    },
    {
      icon: Music,
      label: "Can we play music?",
      buttonLabel: "Music",
      color: "text-pink-500",
    },
    {
      icon: Book,
      label: "I want to read",
      buttonLabel: "Read",
      color: "text-orange-500",
    },
    {
      icon: Tv,
      label: "Let's watch TV",
      buttonLabel: "TV",
      color: "text-blue-600",
    },
    {
      icon: Heart,
      label: "I love you!",
      buttonLabel: "Love",
      color: "text-red-500",
    },
    {
      icon: Smile,
      label: "I'm happy",
      buttonLabel: "Happy",
      color: "text-yellow-600",
    },
    {
      icon: Phone,
      label: "Please call",
      buttonLabel: "Call",
      color: "text-green-500",
    },
    {
      icon: Mail,
      label: "I have a message",
      buttonLabel: "Message",
      color: "text-blue-500",
    },
    {
      icon: Car,
      label: "I need a ride",
      buttonLabel: "Ride",
      color: "text-gray-600",
    },
    {
      icon: Gift,
      label: "Thank you!",
      buttonLabel: "Thanks",
      color: "text-teal-500",
    },
    {
      icon: Smile,
      label: "You're welcome",
      buttonLabel: "Welcome",
      color: "text-indigo-500",
    },
    {
      icon: AlertTriangle,
      label: "Please help",
      buttonLabel: "Help",
      color: "text-red-500",
    },
    {
      icon: Smile,
      label: "I understand",
      buttonLabel: "Understand",
      color: "text-green-500",
    },
    {
      icon: Smile,
      label: "Nice to meet you",
      buttonLabel: "Meet",
      color: "text-indigo-500",
    },
    {
      icon: Moon,
      label: "I'm tired",
      buttonLabel: "Tired",
      color: "text-purple-500",
    },
    {
      icon: Tv,
      label: "Can we watch a movie?",
      buttonLabel: "Movie",
      color: "text-blue-600",
    },
    {
      icon: Frown,
      label: "I'm sad",
      buttonLabel: "Sad",
      color: "text-indigo-500",
    },
    {
      icon: Home,
      label: "I need rest",
      buttonLabel: "Rest",
      color: "text-purple-600",
    },
    {
      icon: Coffee,
      label: "I want cold drink",
      buttonLabel: "Drink",
      color: "text-blue-500",
    },
    {
      icon: Volleyball,
      label: "Let's play football",
      buttonLabel: "Football",
      color: "text-green-500",
    },
    {
      icon: Meh,
      label: "I'm bored",
      buttonLabel: "Bored",
      color: "text-red-500",
    },
    {
      icon: Gift,
      label: "Surprise?",
      buttonLabel: "Surprise",
      color: "text-yellow-500",
    },
    {
      icon: Angry,
      label: "I'm angry",
      buttonLabel: "Angry",
      color: "text-indigo-500",
    },
    {
      icon: ShoppingBag,
      label: "Can we go shopping?",
      buttonLabel: "Shopping",
      color: "text-pink-500",
    },
    {
      icon: Laugh,
      label: "That's so funny!",
      buttonLabel: "Funny",
      color: "text-purple-600",
    },
    {
      icon: Sparkles,
      label: "Happy Diwali!",
      buttonLabel: "Diwali",
      color: "text-yellow-500",
    },
    {
      icon: Cake,
      label: "Happy birthday!",
      buttonLabel: "Birthday",
      color: "text-pink-500",
    },
    {
      icon: Frown,
      label: "I miss you",
      buttonLabel: "Miss",
      color: "text-red-600",
    },
    {
      icon: PartyPopper,
      label: "Let's celebrate!",
      buttonLabel: "Celebrate",
      color: "text-orange-500",
    },
    {
      icon: Flower,
      label: "Happy Raksha Bandhan",
      buttonLabel: "Rakhi",
      color: "text-purple-600",
    },
    {
      icon: Drum,
      label: "Let's dance!",
      buttonLabel: "Dance",
      color: "text-indigo-500",
    },
    {
      icon: Soup,
      label: "Can we have biryani?",
      buttonLabel: "Biryani",
      color: "text-green-500",
    },
    {
      icon: PartyPopper,
      label: "Party time!",
      buttonLabel: "Party",
      color: "text-blue-500",
    },
    {
      icon: Phone,
      label: "Let's video call",
      buttonLabel: "Video",
      color: "text-yellow-600",
    },
    {
      icon: CandyCane,
      label: "Happy Christmas!",
      buttonLabel: "Christmas",
      color: "text-green-600",
    },
    {
      icon: Present,
      label: "Here is a gift",
      buttonLabel: "Gift",
      color: "text-red-500",
    },
    {
      icon: SmilePlus,
      label: "Let's see fireworks",
      buttonLabel: "Fireworks",
      color: "text-teal-500",
    },
    {
      icon: Pizza,
      label: "I want pizza",
      buttonLabel: "Pizza",
      color: "text-orange-500",
    },
    {
      icon: Trophy,
      label: "I won!",
      buttonLabel: "Won",
      color: "text-purple-500",
    },
    {
      icon: Headphones,
      label: "I need headphones",
      buttonLabel: "Headphones",
      color: "text-blue-800",
    },
    {
      icon: AlertTriangle,
      label: "I'm scared",
      buttonLabel: "Scared",
      color: "text-indigo-500",
    },
    {
      icon: Moon,
      label: "Happy Eid!",
      buttonLabel: "Eid",
      color: "text-green-800",
    },
    {
      icon: PaintBucket,
      label: "Happy Holi!",
      buttonLabel: "Holi",
      color: "text-pink-500",
    },
    {
      icon: Cookie,
      label: "Can I get a snack?",
      buttonLabel: "Snack",
      color: "text-yellow-500",
    },
    {
      icon: Computer,
      label: "I need my tablet",
      buttonLabel: "Tablet",
      color: "text-indigo-500",
    },
    {
      icon: Calendar,
      label: "Is today a holiday?",
      buttonLabel: "Holiday",
      color: "text-gray-600",
    },
    {
      icon: Smartphone,
      label: "Take a selfie!",
      buttonLabel: "Selfie",
      color: "text-red-600",
    },
    {
      icon: Camera,
      label: "I want to take photos",
      buttonLabel: "Photos",
      color: "text-orange-600",
    },
    {
      icon: Phone,
      label: "Let's call",
      buttonLabel: "Call",
      color: "text-blue-500",
    },
    {
      icon: Cake,
      label: "Where's the food?",
      buttonLabel: "Food",
      color: "text-pink-500",
    },
    {
      icon: Plane,
      label: "Can we go on vacation?",
      buttonLabel: "Vacation",
      color: "text-purple-600",
    },
    {
      icon: Candy,
      label: "I want some sweets",
      buttonLabel: "Sweets",
      color: "text-yellow-600",
    },
    {
      icon: Backpack,
      label: "I need my bag",
      buttonLabel: "Bag",
      color: "text-green-700",
    },
    {
      icon: Phone,
      label: "Where's my phone?",
      buttonLabel: "Phone",
      color: "text-blue-600",
    },
    {
      icon: Users,
      label: "Where are you?",
      buttonLabel: "Where",
      color: "text-teal-500",
    },
    {
      icon: SmilePlus,
      label: "I'm so excited!",
      buttonLabel: "Excited",
      color: "text-purple-600",
    },
  ];

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      setSelectedVoice(availableVoices[0]);
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const speak = useCallback(
    (text) => {
      if (!isSpeechEnabled) return;
      window.speechSynthesis.cancel();
      setIsPlaying(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      utterance.rate = speechRate;
      utterance.pitch = speechPitch;
      utterance.volume = 1;

      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    },
    [isSpeechEnabled, selectedVoice, speechRate, speechPitch]
  );

  const handleButtonClick = (label) => {
    setMessage(label);
    speak(label);
  };

  const toggleSpeech = () => {
    setIsSpeechEnabled(!isSpeechEnabled);
    window.speechSynthesis.cancel();
  };

  return (
    <div>
      <duv>
        <EmergencyButton/>
      </duv>
      <div className="flex-1 p-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">English Board</h1>
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

export default BoardEnglish;
