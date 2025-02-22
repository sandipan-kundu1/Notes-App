import React from 'react';

function NoteItem({ note, deleteNote, setEditingNote }) {
  return (
    <div className="bg-gradient-to-br from-yellow-200 to-pink-200 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-lg font-semibold mb-2 text-blue-600">{note.title}</h3>
      <p className="text-gray-800 mb-2">{note.content}</p>
      {note.category && <span className="text-sm text-indigo-600">Category: {note.category}</span>}
      <p className="text-sm text-gray-500 mt-2">
        Created: {new Date(note.date).toLocaleString()}
      </p>
      <div className="mt-4 flex justify-between">
        <button 
          onClick={() => setEditingNote(note)} 
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-colors duration-300"
        >
          Edit
        </button>
        <button 
          onClick={() => deleteNote(note.id)} 
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-2 rounded-full hover:from-red-600 hover:to-orange-600 transition-colors duration-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default NoteItem;