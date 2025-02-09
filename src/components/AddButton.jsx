import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaUpload } from "react-icons/fa";
import axios from "axios";

const AddButton = ({ buttons, setButtons, speak, boardId }) => { // Added boardId back to props
  const [showButtonEditor, setShowButtonEditor] = useState(false);
  const [editingButton, setEditingButton] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (!selectedVoice) {
        setSelectedVoice(availableVoices[0]);
      }
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, [selectedVoice]);

  const handleEditButton = (index) => {
    setEditingButton(index);
    setShowButtonEditor(true);
  };

  const handleDeleteButton = (index) => {
    setButtons(buttons.filter((_, idx) => idx !== index));
  };

  const handleSaveButton = async (data) => {
    if (!data.label || !data.button_label) {
      alert("Button label and phrase are required");
      return;
    }

    if (!boardId) {
      alert("Board ID is required to create a button");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("board", boardId); // Use the boardId prop here
      formData.append("label", data.label);
      formData.append("button_label", data.button_label);
  
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }
  
      const response = await axios.post(
        'http://127.0.0.1:8000/customboard/api/buttons/',formData);
  
      setButtons([...buttons, {
        ...response.data,
        label: data.label,
        phrase: data.button_label,
        image: response.data.image
      }]);
      setShowButtonEditor(false);
    } catch (error) {
      console.error("Error saving button:", error);
      if (error.response?.data) {
        const errorMessages = Object.entries(error.response.data)
          .map(([key, value]) => `${key}: ${value.join(', ')}`)
          .join('\n');
        alert(`Error saving button:\n${errorMessages}`);
      } else {
        alert("Error saving button. Please try again.");
      }
    }
  };
  
  const ButtonEditor = ({ onSave, onCancel, initialData = null }) => {
    const [label, setLabel] = useState(initialData?.label || "");
    const [image, setImage] = useState(initialData?.image || null);
    const [buttonLabel, setButtonLabel] = useState(initialData?.button_label || "");
    const [selectedVoice, setSelectedVoice] = useState(initialData?.voice || null);

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImage(file);
      }
    };

    const handlePreviewVoice = () => {
      if (buttonLabel) {
        const utterance = new SpeechSynthesisUtterance(buttonLabel);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        speechSynthesis.speak(utterance);
      }
    };

    const handleSubmit = () => {
      if (!label.trim()) {
        alert("Button label is required");
        return;
      }
      if (!buttonLabel.trim()) {
        alert("Button phrase is required");
        return;
      }
      onSave({
        label: label.trim(),
        button_label: buttonLabel.trim(),
        image
      });
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
                Button Label <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter button label"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Button Phrase <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={buttonLabel}
                onChange={(e) => setButtonLabel(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter phrase for the button"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Button Image</label>
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
                  <FaUpload className="w-4 h-4 mr-2" /> Upload Image
                </label>
                {image && (
                  <img 
                    src={image instanceof File ? URL.createObjectURL(image) : image} 
                    alt="Button" 
                    className="w-16 h-16 object-cover rounded" 
                  />
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <button 
                onClick={handlePreviewVoice} 
                disabled={!buttonLabel || isPlaying} 
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
              >
                Preview Voice
              </button>
              <select
                value={selectedVoice?.name || ""}
                onChange={(e) => {
                  const newVoice = voices.find((voice) => voice.name === e.target.value);
                  setSelectedVoice(newVoice);
                }}
                className="p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 w-full"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>{voice.name}</option>
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
              onClick={handleSubmit} 
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
    <div className="mb-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {buttons.map((button, index) => (
          <div key={index} className="relative p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all flex flex-col items-center gap-2">
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
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={() => speak(button.button_label || button.label)} 
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
          onClick={() => setShowButtonEditor(true)} 
          className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 flex flex-col items-center justify-center gap-2"
        >
          <FaPlus className="w-8 h-8 text-gray-400" />
          <span className="text-sm text-gray-600">Add Button</span>
        </button>
      </div>
      {showButtonEditor && (
        <ButtonEditor 
          onSave={handleSaveButton} 
          onCancel={() => setShowButtonEditor(false)} 
          initialData={editingButton !== null ? buttons[editingButton] : null}
        />
      )}
    </div>
  );
};

export default AddButton;