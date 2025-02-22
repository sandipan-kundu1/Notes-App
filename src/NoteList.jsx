import React from 'react';
import NoteItem from './NoteItem';

function NoteList({ notes, searchTerm, selectedCategory, deleteNote, setEditingNote }) {
  const filteredNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(note => selectedCategory === 'All' || note.category === selectedCategory)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="mt-6">
      {filteredNotes.length === 0 ? (
        <p className="text-center text-gray-500">No notes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => (
            <NoteItem 
              key={note.id} 
              note={note} 
              deleteNote={deleteNote} 
              setEditingNote={setEditingNote}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default NoteList;