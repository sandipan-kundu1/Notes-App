import React, { useState, useEffect } from 'react';
import NoteList from './NoteList';
import NoteForm from './NoteForm';
import Login from './Login';
import PricingModal from './components/PricingModal';
import Analytics from './components/Analytics';

const API_URL = import.meta.env.VITE_API_URL || 'https://notes-app-7t81.onrender.com';

function App() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingNote, setEditingNote] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [showPricing, setShowPricing] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [error, setError] = useState('');

  // Check authentication status
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      fetch(`${API_URL}/auth/user`, {
        headers: { Authorization: `Bearer ${savedToken}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(user => {
          setUser(user);
          if (user) {
            fetchNotes();
            fetchSubscription();
          }
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (user) => {
    setUser(user);
    fetchNotes();
    fetchSubscription();
  };

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/subscription`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Subscription fetch failed:', error);
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/notes/export`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notes-export.json';
        a.click();
      } else {
        const error = await res.json();
        setError(error.error);
      }
    } catch (error) {
      setError('Export failed');
    }
  };

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const addNote = async (note) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/notes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(note)
      });
      if (res.ok) {
        const newNote = await res.json();
        setNotes([newNote, ...notes]);
        fetchSubscription();
      } else {
        const error = await res.json();
        setError(error.error);
        if (error.error.includes('limit')) {
          setShowPricing(true);
        }
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotes(notes.filter(note => note._id !== id));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const updateNote = async (updatedNote) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/notes/${updatedNote._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedNote)
      });
      if (res.ok) {
        const updated = await res.json();
        setNotes(notes.map(note => note._id === updated._id ? updated : note));
        setEditingNote(null);
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };



  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setNotes([]);
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-red-500">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const categories = ['All', ...new Set(notes.map(note => note.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📝</span>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Notes App
                </h1>
              </div>
              <span className={`hidden sm:inline-flex text-xs px-2 py-1 rounded-full font-medium ${
                subscription?.plan === 'enterprise' ? 'bg-purple-100 text-purple-700' :
                subscription?.plan === 'pro' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {subscription?.plan?.toUpperCase() || 'FREE'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPricing(true)}
                className="hidden sm:flex items-center px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
              >
                Upgrade
              </button>
              
              {subscription?.features?.export && (
                <button
                  onClick={handleExport}
                  className="hidden sm:flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  Export
                </button>
              )}
              
              {subscription?.features?.analytics && (
                <button
                  onClick={() => setShowAnalytics(true)}
                  className="hidden sm:flex items-center px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                >
                  Analytics
                </button>
              )}
              
              <div className="flex items-center space-x-2">
                <span className="hidden md:block text-sm text-gray-600">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
            <span className="text-sm">{error}</span>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700 text-lg">&times;</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <NoteForm 
              addNote={addNote} 
              updateNote={updateNote} 
              editingNote={editingNote} 
              setEditingNote={setEditingNote}
            />
            
            {/* Search & Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Search & Filter</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Mobile Actions */}
            <div className="sm:hidden bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowPricing(true)}
                  className="px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                >
                  Upgrade
                </button>
                {subscription?.features?.analytics && (
                  <button
                    onClick={() => setShowAnalytics(true)}
                    className="px-3 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Analytics
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Notes Grid */}
          <div className="lg:col-span-2">
            <NoteList 
              notes={notes} 
              searchTerm={searchTerm} 
              selectedCategory={selectedCategory} 
              deleteNote={deleteNote} 
              setEditingNote={setEditingNote}
            />
          </div>
        </div>
        
        <PricingModal 
          isOpen={showPricing}
          onClose={() => setShowPricing(false)}
          currentPlan={subscription?.plan}
          onUpgrade={fetchSubscription}
        />
        
        <Analytics 
          isOpen={showAnalytics}
          onClose={() => setShowAnalytics(false)}
        />
      </main>
    </div>
  );
}

export default App;