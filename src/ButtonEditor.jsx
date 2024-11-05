import { useState } from 'react';
import { Upload } from 'lucide-react';
import PropTypes from 'prop-types'; 

const ButtonEditor = ({ onSave, onCancel, initialData = null }) => {
  const [label, setLabel] = useState(initialData?.label || '');
  const [image, setImage] = useState(initialData?.image || null);
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? 'Edit Button' : 'Add New Button'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Button Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter button label"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Button Image</label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </label>
              {image && (
                <img src={image} alt="Button" className="w-16 h-16 object-cover rounded" />
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ label, image })}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

ButtonEditor.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    label: PropTypes.string,
    image: PropTypes.string
  })
};

export default ButtonEditor;