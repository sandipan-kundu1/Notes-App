import React from 'react';
import NoteItem from './NoteItem';

function NoteList({ notes, searchTerm, selectedCategory, deleteNote, setEditingNote }) {
  const filteredNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(note => selectedCategory === 'All' || note.category === selectedCategory)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Notes ({filteredNotes.length})
        </h2>
      </div>
      
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <p className="text-gray-500 text-lg mb-2">No notes found</p>
          <p className="text-gray-400 text-sm">Create your first note to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredNotes.map(note => (
            <NoteItem 
              key={note._id} 
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