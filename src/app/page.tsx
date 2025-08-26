'use client';
import axios from "axios";
import { useState, useEffect } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Fetching users from /api/users...");
      
      const response = await axios.get('/api/users');
      console.log("API Response:", response.data);
      
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Error fetching users. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const response = await axios.post('/api/users', { name, email });
      console.log("Create user response:", response.data);
      
      // Clear the form
      setName("");
      setEmail("");
      
      // Refresh the users list to include the new user
      await fetchUsers();
      
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Error creating user. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {/* Main container for the side-by-side layout */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start">

        {/* Left Column: Form Card (Sticky) */}
        <div className="w-full md:w-2/5 bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Create a User</h1>
            <p className="text-blue-100 mt-2">Add a new user to the database.</p>
          </div>

          {/* Form Section */}
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                <p>{error}</p>
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                required
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-md"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </form>
        </div>

        {/* Right Column: Users List Card */}
        <div className="w-full md:w-3/5 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-center">
            <h2 className="text-2xl font-bold text-white">Users List</h2>
            <p className="text-green-100 mt-2">
              {users.length} user{users.length !== 1 ? 's' : ''} in database
            </p>
          </div>

          <div className="p-6">
            {loading && users.length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users found. Create one to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user._id || user.email}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{user.name}</h3>
                        <p className="text-gray-600 text-sm">{user.email}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Refresh Button */}
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="w-full mt-6 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              {loading ? "Refreshing..." : "Refresh Users"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}