import React, { useState, useEffect } from 'react';

function NoteForm({ addNote, updateNote, editingNote, setEditingNote }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setCategory(editingNote.category || '');
    }
  }, [editingNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingNote) {
      updateNote({ ...editingNote, title, content, category, date: new Date().toISOString() });
    } else {
      addNote({ title, content, category });
    }
    setTitle('');
    setContent('');
    setCategory('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-amber-100 p-4 rounded-2xl shadow-md mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-center text-orange-600">{editingNote ? 'Edit Note' : 'Add New Note'}</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-3 mb-4 border rounded-full bg-blue-100 text-purple-700 focus:ring-2 focus:ring-purple-400"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        className="w-full p-3 mb-4 border rounded-2xl bg-green-100 text-teal-700 focus:ring-2 focus:ring-purple-400"
        required
        rows="4"
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category (optional)"
        className="w-full p-3 mb-4 border rounded-full bg-pink-100 text-indigo-700 focus:ring-2 focus:ring-yellow-400"
      />
      <div className="flex justify-center">
        <button type="submit" className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors duration-300">
          {editingNote ? 'Update Note' : 'Add Note'}
        </button>
        {editingNote && (
          <button 
            type="button" 
            onClick={() => setEditingNote(null)} 
            className="bg-red-500 text-white p-3 rounded-full ml-4 hover:bg-red-600 transition-colors duration-300"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default NoteForm;