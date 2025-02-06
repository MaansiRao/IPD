import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MyBoardDetails = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load the selected board from localStorage
    const savedBoards = JSON.parse(localStorage.getItem('boards')) || [];
    const foundBoard = savedBoards.find(board => board.id === parseInt(boardId));
    setBoard(foundBoard);
  }, [boardId]);

  const speak = (phrase) => {
    const utterance = new SpeechSynthesisUtterance(phrase);
    speechSynthesis.speak(utterance);
  };

  if (!board) {
    return <p>Board not found</p>;
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <button
        onClick={() => navigate('/myboards')}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-6"
      >
        Back to Boards
      </button>

      <h1 className="text-2xl font-bold mb-6">{board.name}</h1>
      <p className="text-sm text-gray-600 mb-6">{board.buttons.length} buttons</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {board.buttons.map((button, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow"
          >
            <button
              onClick={() => speak(button.phrase || button.label)} // Speak the phrase or label
              className="flex flex-col items-center justify-center"
            >
              {button.image && <img src={button.image} alt={button.label} className="w-16 h-16 object-cover rounded mb-2" />}
              <h4 className="text-lg font-semibold">{button.label}</h4>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBoardDetails;
