import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom to handle routing
import PropTypes from 'prop-types';
import Sidebar from '../components/Sidebar.jsx'

const ParentSide = () => {
  return (
    <>
    <div><Sidebar/></div>
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Parent Home</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Button for English Board */}
        <Link to="/englishboard">
          <button className="w-full py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            English Board
          </button>
        </Link>

        {/* Button for Hindi Board */}
        <Link to="/hindiboard">
          <button className="w-full py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Hindi Board
          </button>
        </Link>

        {/* Button for creating a new board */}
        <Link to="/createnewboard">
          <button className="w-full py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
            Create New Board
          </button>
        </Link>

        <Link to="/myboards">
          <button className="w-full py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
            My Boards
          </button>
        </Link>
      </div>
    </div>
    </>
  );
};

ParentSide.propTypes = {
  boards: PropTypes.array,  // This prop can be passed for dynamic board handling
};

export default ParentSide;
