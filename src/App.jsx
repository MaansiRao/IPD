import React from 'react';
import {BrowserRouter as Router,Routes,Route, useLocation} from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import BoardEnglish from './pages/BoardEnglish.jsx';
import BoardHindi from './pages/BoardHindi.jsx';
import ParentSide from './pages/ParentSide.jsx'
import CreateNewBoard from "./pages/CreateNewBoard.jsx";
import MyBoards from "./pages/MyBoards.jsx";
import MyBoardDetails from "./pages/MyBoardDetails.jsx";
import TrackMyChild from './pages/TrackMyChild.jsx'
import Reports from './pages/Reports.jsx';

const App = () => {
  return (
    <div>
      <Routes>
      <Route path='/' element={<Register/>}/>  
      <Route path='/login' element={<Login/>}/>
      <Route path="/parentside" element={<ParentSide/>}/>
      <Route path="/englishboard" element={<BoardEnglish/>}/>
      <Route path='/hindiboard' element={<BoardHindi/>}/>
      <Route path = '/createnewboard' element={<CreateNewBoard/>}/>
      <Route path = '/myboards' element={<MyBoards/>}/>
      <Route path="/board/:boardId" element={<MyBoardDetails />} />
      <Route path= '/trackmychild' element={<TrackMyChild/>}/>
      <Route path= '/reports' element={<Reports/>}/>
      </Routes>
    </div>
  );
};

export default App;