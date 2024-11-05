import { ArrowLeft } from 'lucide-react';
import PropTypes from 'prop-types';

const AACBoard = ({ boardData, onBack }) => {
  const handleButtonClick = (button) => {
    // Optional: Add text-to-speech or other functionality when button is clicked
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(button.label);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 mr-4"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">{boardData.name}</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {boardData.buttons.map((button, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(button)}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all flex flex-col items-center gap-2"
          >
            {button.image && (
              <img
                src={button.image}
                alt={button.label}
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <span className="text-lg font-medium">{button.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

AACBoard.propTypes = {
  boardData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    buttons: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        image: PropTypes.string
      })
    ).isRequired
  }).isRequired,
  onBack: PropTypes.func.isRequired
};

export default AACBoard;