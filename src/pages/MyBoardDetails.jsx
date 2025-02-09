import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyBoardDetails = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoardDetails = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/customboard/api/buttons/');
        console.log('API Response:', response.data); // For debugging
  
        // Ensure boardId is treated as a number
        const parsedBoardId = Number(boardId);
  
        // Filter buttons based on the 'board' field, ensuring types match
        const boardButtons = response.data.filter(button => button.board === parsedBoardId);
        console.log('Filtered Buttons:', boardButtons); // For debugging
  
        if (boardButtons.length === 0) {
          setError('No buttons found for this board');
          setLoading(false);
          return;
        }
  
        // Get board name from the first button's board_name (or fallback to 'My Board')
        const boardData = {
          board_id: parsedBoardId,
          name: boardButtons[0].board_name || 'My Board',
          buttons: boardButtons
        };
  
        setBoard(boardData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching board details:', err);
        setError('Failed to load board details. Please try again later.');
        setLoading(false);
      }
    };
  
    fetchBoardDetails();
  }, [boardId]);
  
  const speak = (phrase) => {
    const utterance = new SpeechSynthesisUtterance(phrase);
    speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <p>Loading board details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/myboards')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-6"
        >
          Back to Boards
        </button>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/myboards')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-6"
        >
          Back to Boards
        </button>
        <p>Board not found</p>
      </div>
    );
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
        {board.buttons.map((button) => (
          <div
            key={button.id}
            className="p-4 bg-white rounded-lg shadow"
          >
            <button
              onClick={() => speak(button.phrase || button.label)}
              className="flex flex-col items-center justify-center w-full"
            >
              {button.image && (
                <img 
                  src={button.image} 
                  alt={button.label} 
                  className="w-16 h-16 object-cover rounded mb-2" 
                />
              )}
              <h4 className="text-lg font-semibold">{button.label}</h4>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBoardDetails;