import { useState } from 'react';
import { Plus, Save, ArrowLeft, Upload, Trash2 } from 'lucide-react';
import ButtonEditor from './ButtonEditor'
import PropTypes from 'prop-types';

const BoardEditor = ({ onBack, initialBoard = null }) => {
    const [boardName, setBoardName] = useState(initialBoard?.name || '');
    const [buttons, setButtons] = useState(initialBoard?.buttons || []);
    const [showButtonEditor, setShowButtonEditor] = useState(false);
    const [editingButton, setEditingButton] = useState(null);
  
    const handleSaveBoard = () => {
      const board = {
        id: initialBoard?.id || Date.now(),
        name: boardName,
        buttons
      };
      
      // Get existing boards from localStorage
      const existingBoards = JSON.parse(localStorage.getItem('aacBoards') || '[]');
      
      // Update or add the new board
      const updatedBoards = initialBoard
        ? existingBoards.map(b => b.id === board.id ? board : b)
        : [...existingBoards, board];
      
      // Save to localStorage
      localStorage.setItem('aacBoards', JSON.stringify(updatedBoards));
      
      onBack();
    };
  
    const handleSaveButton = (buttonData) => {
      if (editingButton !== null) {
        setButtons(buttons.map((btn, idx) => 
          idx === editingButton ? buttonData : btn
        ));
      } else {
        setButtons([...buttons, buttonData]);
      }
      setShowButtonEditor(false);
      setEditingButton(null);
    };
  
    const handleEditButton = (index) => {
      setEditingButton(index);
      setShowButtonEditor(true);
    };
  
    const handleDeleteButton = (index) => {
      setButtons(buttons.filter((_, idx) => idx !== index));
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
          <h1 className="text-2xl font-bold">
            {initialBoard ? 'Edit Board' : 'Create New Board'}
          </h1>
        </div>
  
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Board Name</label>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter board name"
            />
          </div>
  
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {buttons.map((button, index) => (
              <div
                key={index}
                className="relative p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all flex flex-col items-center gap-2"
              >
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => handleEditButton(index)}
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteButton(index)}
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {button.image && (
                  <img
                    src={button.image}
                    alt={button.label}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <span className="text-sm text-center">{button.label}</span>
              </div>
            ))}
            <button
              onClick={() => setShowButtonEditor(true)}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 flex flex-col items-center justify-center gap-2"
            >
              <Plus className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-600">Add Button</span>
            </button>
          </div>
        </div>
  
        <div className="flex justify-end">
          <button
            onClick={handleSaveBoard}
            disabled={!boardName}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Board
          </button>
        </div>
  
        {showButtonEditor && (
          <ButtonEditor
            onSave={handleSaveButton}
            onCancel={() => {
              setShowButtonEditor(false);
              setEditingButton(null);
            }}
            initialData={editingButton !== null ? buttons[editingButton] : null}
          />
        )}
      </div>
    );
  };

  BoardEditor.propTypes = {
    onBack: PropTypes.func.isRequired,
    initialBoard: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      buttons: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          image: PropTypes.string
        })
      )
    })
};

export default BoardEditor;