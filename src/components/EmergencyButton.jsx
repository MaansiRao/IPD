import React,{ useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const EmergencyButton = ({ onTriggerEmergency }) => {
  const [isEmergency, setEmergency] = useState(false);

  const handleEmergency = async () => {
    setEmergency(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Emergency triggered!', timestamp: new Date().toISOString() }),
      });

      if (!response.ok) {
        throw new Error('Failed to send emergency request');
      }

      const responseData = await response.json();
      console.log('Emergency request sent successfully:', responseData);
    } catch (error) {
      console.error('Error sending emergency request:', error);
    }

    setTimeout(() => setEmergency(false), 5000);
  };

  return (
    <button
      onClick={handleEmergency}
      className={`fixed top-4 right-4 px-6 py-3 rounded-xl flex items-center gap-2 
                  font-semibold text-white shadow-lg transition-all 
                  ${isEmergency ? 'bg-red-800' : 'bg-red-600 hover:bg-red-700 active:scale-95'}`}
    >
      <AlertTriangle className="w-6 h-6" />
      Emergency
    </button>
  );
};

export default EmergencyButton;
