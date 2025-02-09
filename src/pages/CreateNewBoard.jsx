import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddButton from "../components/AddButton.jsx";

const CreateNewBoard = () => {
  const [boardName, setBoardName] = useState("");
  const [buttons, setButtons] = useState([]);
  const [showSaveBoard, setShowSaveBoard] = useState(false);
  const [boardCreated, setBoardCreated] = useState(false);
  const [currentBoardId, setCurrentBoardId] = useState(null);
  const navigate = useNavigate();

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const handleCreateBoard = async () => {
    if (!boardName.trim()) {
      alert("Please enter a board name");
      return;
    }

    const newBoard = {
      name: boardName,
      language: "en",
      buttons: [],
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/customboard/api/boards/", newBoard);
      console.log("Board created successfully:", response.data);
      
      if (response.status === 201 && response.data.board_id) {
        setCurrentBoardId(response.data.board_id);
        setBoardCreated(true);
        console.log("Set board ID to:", response.data.board_id);
      } else {
        console.error("Invalid response from server");
        alert("Error creating board. Please try again.");
      }
    } catch (error) {
      console.error("Error creating board:", error);
      alert("Failed to create board. Please try again.");
    }
  };

  const handleSaveBoard = async () => {
    if (!buttons.length) {
      alert("Please add at least one button to the board");
      return;
    }

    try {
      // Just save to localStorage and navigate - no API call needed
      const boards = JSON.parse(localStorage.getItem("boards")) || [];
      const newBoard = {
        id: currentBoardId,
        name: boardName,
        language: "en",
        buttons: buttons
      };
      const updatedBoards = boards.filter(b => b.id !== currentBoardId);
      localStorage.setItem("boards", JSON.stringify([...updatedBoards, newBoard]));
      setShowSaveBoard(false);
      navigate("/parentside");
    } catch (error) {
      console.error("Error saving board:", error);
      alert("Failed to save board. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/parentside");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Create a New Board
      </h2>

      {!boardCreated ? (
        // Step 1: Create Board
        <div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Board Name
            </label>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter board name..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleCreateBoard}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
            >
              Create Board
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // Step 2: Add Buttons
        <div>
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-700">Board Name: {boardName}</p>
          </div>

          <AddButton 
            buttons={buttons} 
            setButtons={setButtons} 
            speak={speak} 
            boardId={currentBoardId} 
          />

          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={() => setShowSaveBoard(true)}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
            >
              Save Board
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
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
                onClick={handleSaveBoard}
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