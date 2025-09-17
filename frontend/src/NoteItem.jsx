import React from 'react';

function NoteItem({ note, deleteNote, setEditingNote }) {
  const priorityConfig = {
    high: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: '🔴' },
    medium: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: '🟡' },
    low: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: '🟢' }
  };
  
  const priority = priorityConfig[note.priority] || priorityConfig.medium;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-200 group">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {note.title}
        </h3>
        <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${priority.bg} ${priority.color} ${priority.border} border`}>
          <span>{priority.icon}</span>
          {note.priority?.toUpperCase()}
        </span>
      </div>
      
      {/* Content */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
        {note.content}
      </p>
      
      {/* Tags & Metadata */}
      <div className="flex flex-wrap gap-2 mb-4">
        {note.category && (
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-medium border border-blue-200">
            {note.category}
          </span>
        )}
        {note.tags?.slice(0, 3).map((tag, index) => (
          <span key={index} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-200">
            #{tag}
          </span>
        ))}
        {note.tags?.length > 3 && (
          <span className="text-xs text-gray-400">+{note.tags.length - 3} more</span>
        )}
      </div>
      
      {/* Status Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {note.isPublic && (
          <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-md font-medium border border-green-200">
            🌍 Public
          </span>
        )}
        {note.sharedWith?.length > 0 && (
          <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-md font-medium border border-purple-200">
            👥 Shared ({note.sharedWith.length})
          </span>
        )}
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {note.userId?.name && note.userId.name !== 'You' && (
            <span className="font-medium">{note.userId.name} • </span>
          )}
          {new Date(note.createdAt).toLocaleDateString()}
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setEditingNote(note)} 
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            title="Edit note"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            onClick={() => deleteNote(note._id)} 
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Delete note"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteItem;