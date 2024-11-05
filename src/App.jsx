import AACBoard from "./AACBoard"
import BoardSelector from "./BoardSelector";
import BoardEditor from "./BoardEditor";
import DefaultBoard from "./DefaultBoard";
import { useState, useEffect } from 'react';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import BoardEnglish from './BoardEnglish';
import BoardHindi from './BoardHindi';
import Button from '@mui/material/Button';
import * as React from 'react';
import TemporaryDrawer from './components/Sidebar';






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
    <div className='flex'>
    <TemporaryDrawer/>
    <div className=" flex-1 min-h-screen bg-gray-100">
      {/* <DefaultBoard/> */}
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
    <div>
      <Router>
      <Routes>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/hindiboard' element={<BoardHindi/>}/>
      <Route path='/englishboard' element={<BoardEnglish/>}/>

      </Routes>
      </Router>
    </div>
    </div>
    </div>
  );
};

export default App;