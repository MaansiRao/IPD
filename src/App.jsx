import AACBoard from "./AACBoard"
import BoardSelector from "./BoardSelector";
import BoardEditor from "./BoardEditor";
import DefaultBoard from "./DefaultBoard";
import { useState, useEffect } from 'react';

// function App() {
//   return (
//     <>
//     <AACBoard/>
//     </>
//   )
// }

// export default App

const App = () => {
  const [view, setView] = useState('selector'); // 'selector', 'editor', 'board'
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);

  useEffect(() => {
    // Load boards from localStorage
    const savedBoards = JSON.parse(localStorage.getItem('aacBoards') || '[]');
    setBoards(savedBoards);
  }, []);

  const handleCreateNew = () => {
    setCurrentBoard(null);
    setView('editor');
  };

  const handleSelectBoard = (board) => {
    setCurrentBoard(board);
    setView('board');
  };

  const handleBackToSelector = () => {
    // Reload boards from localStorage
    const savedBoards = JSON.parse(localStorage.getItem('aacBoards') || '[]');
    setBoards(savedBoards);
    setView('selector');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DefaultBoard/>
      {view === 'selector' && (
        <BoardSelector
          boards={boards}
          onCreateNew={handleCreateNew}
          onSelectBoard={handleSelectBoard}
        />
      )}
      {view === 'editor' && (
        <BoardEditor
          onBack={handleBackToSelector}
          initialBoard={currentBoard}
        />
      )}
      {view === 'board' && currentBoard && (
        <AACBoard
          boardData={currentBoard}
          onBack={handleBackToSelector}
        />
      )}
    </div>
  );
};

export default App;