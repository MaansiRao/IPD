import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Parent',
    language: 'English', // Default language
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const savedData = localStorage.getItem('registerData');
      if (savedData) {
        const registeredUser = JSON.parse(savedData);

        if (
          formData.email === registeredUser.email &&
          formData.password === registeredUser.password
        ) {
          alert('Login successful!');

          if (formData.role === "Parent") {
            navigate('/parentside');
          } else {
            // Navigate based on language selection
            if (formData.language === "English") {
              navigate('/englishboard');
            } else if (formData.language === "Hindi") {
              navigate('/hindiboard');
            } else {
              navigate('/childside'); // Default path for other languages
            }
          }
        } else {
          alert('Invalid email or password. Please try again.');
        }
      } else {
        alert('No registered user found. Please sign up first.');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      alert(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="parent-container flex justify-center items-center min-h-screen">
      <div className="loginsign">
        <div className="w-full max-w-md p-8 space-y-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl border border-indigo-100 m-4">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter Password"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Parent">Parent</option>
                <option value="Child">Child</option>
              </select>
            </div>

            {/* Language Dropdown - only visible for role 'Child' */}
            {formData.role === 'Child' && (
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">Preferred Language</label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Gujarati">Gujarati</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white font-semibold rounded-md transition bg-gradient-to-r ${
                loading 
                  ? 'from-indigo-300 to-purple-300 cursor-not-allowed' 
                  : 'from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
