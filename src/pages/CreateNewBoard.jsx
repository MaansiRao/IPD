import React, { useState, useEffect, useCallback } from "react";
import { Plus, Save, ArrowLeft, Upload, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

const CreateNewBoard = () => {
  const [boardName, setBoardName] = useState("");
  const [buttons, setButtons] = useState([]);
  const [showButtonEditor, setShowButtonEditor] = useState(false);
  const [editingButton, setEditingButton] = useState(null);
  const [showSaveBoard, setShowSaveBoard] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [phrase, setPhrase] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (!selectedVoice) {
        setSelectedVoice(availableVoices[0]); // Set only if not already set
      }
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
    setPhrase(label);
    speak(label);
  };

  const toggleSpeech = () => {
    setIsSpeechEnabled(!isSpeechEnabled);
    window.speechSynthesis.cancel();
  };

  const handleSaveBoard = () => {
    console.log("Button clicked - Saving board...");

    const newBoard = { id: Date.now(), name: boardName, buttons };
    const savedBoards = JSON.parse(localStorage.getItem("boards")) || [];
    console.log("Saved boards before update:", savedBoards);

    try {
      const updatedBoards = [...savedBoards, newBoard];
      localStorage.setItem("boards", JSON.stringify(updatedBoards));

      console.log("Board saved:", updatedBoards);

      setTimeout(() => {
        setShowSaveBoard(false); // Close the modal
        navigate("/parentside"); // Navigate after saving
      }, 500); // Ensure save operation is complete before navigating
    } catch (e) {
      if (e.name === "QuotaExceededError") {
        console.log("Storage quota exceeded. Clearing localStorage...");
        localStorage.clear(); // Clear storage if quota exceeded
        handleSaveBoard(); // Retry saving after clearing
      }
    }
  };

  const handleSaveButton = (buttonData) => {
    if (editingButton !== null) {
      setButtons(
        buttons.map((btn, idx) => (idx === editingButton ? buttonData : btn))
      );
    } else {
      setButtons([...buttons, buttonData]);
    }
    setShowButtonEditor(false);
    setEditingButton(null);
  };

  const handleEditButton = (index) => {
    setEditingButton(index);
    setShowButtonEditor(true);
  };

  const handleDeleteButton = (index) => {
    setButtons(buttons.filter((_, idx) => idx !== index));
  };

  const ButtonEditor = ({ onSave, onCancel, initialData = null }) => {
    const [label, setLabel] = useState(initialData?.label || "");
    const [image, setImage] = useState(initialData?.image || null);
    const [inputPhrase, setInputPhrase] = useState(initialData?.phrase || "");
    const [selectedVoice, setSelectedVoice] = useState(
      initialData?.voice || null
    ); // Track selected voice

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const handlePhraseChange = (e) => {
      setInputPhrase(e.target.value);
    };

    useEffect(() => {
      if (editingButton !== null) {
        setInputPhrase(buttons[editingButton]?.phrase || "");
      }
    }, [editingButton, buttons]);

    const handlePreviewVoice = () => {
      if (inputPhrase) {
        const utterance = new SpeechSynthesisUtterance(inputPhrase);
        speechSynthesis.speak(utterance);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">
            {initialData ? "Edit Button" : "Add New Button"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Button Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter button label"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Button Image
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </label>
                {image && (
                  <img
                    src={image}
                    alt="Button"
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Phrase (Voice Preview)
              </label>
              <input
                type="text"
                value={inputPhrase} // Update the phrase here directly
                onChange={handlePhraseChange}
                className="w-full p-2 border rounded"
                placeholder="Enter phrase for the button"
              />
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <button
                onClick={handlePreviewVoice}
                disabled={!inputPhrase || isPlaying}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Preview Voice
              </button>
              <select
                value={selectedVoice?.name || ""}
                onChange={(e) => {
                  const newVoice = voices.find(
                    (voice) => voice.name === e.target.value
                  );
                  setSelectedVoice(newVoice); // Only update the selected voice
                }}
                className="p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 w-full"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave({ label, image, phrase: inputPhrase })}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/parentside")}
          className="p-2 rounded-full hover:bg-gray-100 mr-4"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Create New Board</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Board Name</label>
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter board name"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {buttons.map((button, index) => (
            <div
              key={index}
              className="relative p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all flex flex-col items-center gap-2"
            >
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => handleEditButton(index)}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteButton(index)}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => {
                  const buttonPhrase = button.phrase || button.label; // Use button's phrase or label if phrase is undefined
                  setPhrase(buttonPhrase); // Update phrase in state
                  speak(buttonPhrase); // Speak the phrase associated with the button
                }}
                className="flex flex-col items-center justify-center gap-2 p-2 w-full"
              >
                {button.image && (
                  <img
                    src={button.image}
                    alt={button.label}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <span className="text-sm text-center">{button.label}</span>
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              setShowButtonEditor(true); // Show the button editor for adding a new button
            }}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 flex flex-col items-center justify-center gap-2"
          >
            <Plus className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-600">Add Button</span>
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => {
            console.log("Save button clicked");
            handleSaveBoard();
          }}
          // disabled={!boardName}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Save Board
        </button>
      </div>

      {showButtonEditor && (
        <ButtonEditor
          onSave={handleSaveButton}
          onCancel={() => setShowButtonEditor(false)}
          initialData={editingButton !== null ? buttons[editingButton] : null}
        />
      )}

      {showSaveBoard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Save Your Board</h2>
            <div className="mb-4">
              <p>Do you want to save the board?</p>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowSaveBoard(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveButton}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNewBoard;
