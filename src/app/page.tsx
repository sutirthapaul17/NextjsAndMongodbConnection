'use client';
import axios from "axios";
import { useState, useEffect } from "react";

// 1. DEFINE THE SHAPE OF A USER OBJECT
interface User {
  _id: string;
  name: string;
  email: string;
  createdAt?: string; // Optional property
}

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // 2. APPLY THE USER TYPE TO YOUR STATE
  const [users, setUsers] = useState<User[]>([]);
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
      const response = await axios.get('/api/users');
      
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await axios.post('/api/users', { name, email });
      
      setName("");
      setEmail("");
      
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
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start">

        {/* Form Card */}
        <div className="w-full md:w-2/5 bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Create a User</h1>
            <p className="text-blue-100 mt-2">Add a new user to the database.</p>
          </div>

          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                <p>{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                placeholder="Enter your full name"
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                placeholder="Enter your email address"
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </form>
        </div>

        {/* Users List Card */}
        <div className="w-full md:w-3/5 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-center">
            <h2 className="text-2xl font-bold text-white">Users List</h2>
            <p className="text-green-100 mt-2">
              {users.length} user{users.length !== 1 ? 's' : ''} in database
            </p>
          </div>

          <div className="p-6">
            {loading && users.length === 0 ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : users.length === 0 ? (
              <p className="text-center text-gray-500">No users found.</p>
            ) : (
              <div className="space-y-4">
                {/* Now, TypeScript knows 'user' is of type 'User' here! */}
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="border border-gray-200 rounded-lg p-4"
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
             <button
              onClick={fetchUsers}
              disabled={loading}
              className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg"
            >
              {loading ? "Refreshing..." : "Refresh Users"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}