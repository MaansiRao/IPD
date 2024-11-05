import { Plus } from 'lucide-react';
import PropTypes from 'prop-types';

const BoardSelector = ({ onCreateNew, boards, onSelectBoard }) => {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Boards</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {boards.map(board => (
            <div 
              key={board.id}
              onClick={() => onSelectBoard(board)}
              className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer"
            >
              <h2 className="text-xl font-semibold">{board.name}</h2>
              <p className="text-gray-600">{board.buttons.length} buttons</p>
            </div>
          ))}
          <div 
            onClick={onCreateNew}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer border-2 border-dashed border-gray-300 flex items-center justify-center"
          >
            <Plus className="w-6 h-6 mr-2" />
            <span>Create New Board</span>
          </div>
        </div>
      </div>
    );
  };

  BoardSelector.propTypes = {
    // Required props
    onCreateNew: PropTypes.func.isRequired,
    onSelectBoard: PropTypes.func.isRequired,
    boards: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        buttons: PropTypes.arrayOf(
          PropTypes.shape({
            label: PropTypes.string.isRequired,
            image: PropTypes.string
          })
        ).isRequired
      })
    ).isRequired,
    
    // Optional props
    onBack: PropTypes.func
  };

export default BoardSelector;