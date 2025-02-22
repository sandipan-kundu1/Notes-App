import React, { useState, useEffect } from 'react';
import NoteList from './NoteList';
import NoteForm from './NoteForm';

function App() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingNote, setEditingNote] = useState(null);

  // Predefined initial notes
  const initialNotes = [
    { 
      id: 1, 
      title: 'Meeting Agenda', 
      content: 'Discuss project timeline and budget.', 
      category: 'Work', 
      date: new Date('2025-02-20T10:00:00').toISOString() 
    },
    { 
      id: 2, 
      title: 'Grocery List', 
      content: 'Milk, Eggs, Bread, Apples.', 
      category: 'Personal', 
      date: new Date('2025-02-21T12:00:00').toISOString() 
    },
    { 
      id: 3, 
      title: 'Workout Plan', 
      content: 'Run 5K, Lift weights, Yoga.', 
      category: 'Fitness', 
      date: new Date('2025-02-19T15:00:00').toISOString() 
    },
  ];

  // Load notes from local storage on mount, or use initial notes if none exist
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes'));
    if (savedNotes && savedNotes.length > 0) {
      setNotes(savedNotes);
    } else {
      // Set initial notes and save to localStorage
      setNotes(initialNotes);
      localStorage.setItem('notes', JSON.stringify(initialNotes));
    }
  }, []);

  // Save notes to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (note) => {
    setNotes([...notes, { ...note, id: Date.now(), date: new Date().toISOString() }]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const updateNote = (updatedNote) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
    setEditingNote(null);
  };

  const categories = ['All', ...new Set(notes.map(note => note.category).filter(Boolean))];

  return (
    <div className="w-screen bg-gradient-to-r pt-10 pb-10 from-purple-500 to-red-500">
      <div className="w-1/2 justify-center mx-auto p-10 bg-white rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">My Notes App</h1>
        <NoteForm 
          addNote={addNote} 
          updateNote={updateNote} 
          editingNote={editingNote} 
          setEditingNote={setEditingNote}
        />
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border rounded-full w-full sm:w-1/2 bg-yellow-100 text-blue-800 placeholder-blue-500 focus:ring-2 focus:ring-purple-400"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 border rounded-full w-full sm:w-1/2 bg-green-100 text-green-800 focus:ring-2 focus:ring-pink-400"
          >
            {categories.map(category => (
              <option key={category} value={category} className="bg-white">{category}</option>
            ))}
          </select>
        </div>
        <NoteList 
          notes={notes} 
          searchTerm={searchTerm} 
          selectedCategory={selectedCategory} 
          deleteNote={deleteNote} 
          setEditingNote={setEditingNote}
        />
      </div>
    </div>
  );
}

export default App;