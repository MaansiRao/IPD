import { Plus,AlertTriangle } from 'lucide-react';
import PropTypes from 'prop-types';
import  {useState} from 'react';


const BoardSelector = ({ onCreateNew, boards, onSelectBoard }) => {
  const [isEmergency,setEmergency]=useState(false);
  const handleEmergency = async () => {
    setEmergency(true);

    try {
      
      const response = await fetch('http://127.0.0.1:8000/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        
        },
        body: JSON.stringify({
          message: 'Emergency triggered!',
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send emergency request');
      }

      const responseData = await response.json();
      console.log('Emergency request sent successfully:', responseData);

    } catch (error) {
      console.error('Error sending emergency request:', error);
    }
    setTimeout(()=>{
      setEmergency(false);
    },5000
    );
  };
  


    return (
      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Boards</h1>
        <button 
            onClick={handleEmergency}
            className={`
              fixed top-0 right-1
              ${isEmergency? 'bg-red-800 text-white' : 'bg-red-600 text-white'}
              px-4 py-2 rounded-lg flex items-center 
              hover:bg-red-700 transition-colors
              transform active:scale-95
            `}
          >
            <AlertTriangle className="w-5 h-5 mr-2" />
            Emergency
          </button>
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