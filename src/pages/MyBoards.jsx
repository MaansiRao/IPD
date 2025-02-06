import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyBoards = () => {
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load boards from localStorage
    const savedBoards = JSON.parse(localStorage.getItem('boards')) || [];
    setBoards(savedBoards);
  }, []);

  const handleBoardClick = (boardId) => {
    // Navigate to the board details page
    navigate(`/board/${boardId}`);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Boards</h1>
      {boards.length === 0 ? (
        <p className="text-gray-600">No boards saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {boards.map((board) => (
            <div
              key={board.id}
              className="p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-100"
              onClick={() => handleBoardClick(board.id)}
            >
              <h3 className="text-lg font-semibold">{board.name}</h3>
              <p className="text-sm text-gray-600">{board.buttons.length} buttons</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBoards;
