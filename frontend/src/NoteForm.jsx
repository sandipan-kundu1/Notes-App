import React, { useState, useEffect } from 'react';

function NoteForm({ addNote, updateNote, editingNote, setEditingNote }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setCategory(editingNote.category || '');
      setTags(editingNote.tags?.join(', ') || '');
      setPriority(editingNote.priority || 'medium');
      setIsPublic(editingNote.isPublic || false);
    }
  }, [editingNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const noteData = {
      title,
      content,
      category,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      priority,
      isPublic
    };
    
    if (editingNote) {
      updateNote({ ...editingNote, ...noteData });
    } else {
      addNote(noteData);
    }
    
    setTitle('');
    setContent('');
    setCategory('');
    setTags('');
    setPriority('medium');
    setIsPublic(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {editingNote ? 'Edit Note' : 'Create New Note'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
            required
          />
        </div>
        
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note content here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500 resize-none"
            required
            rows="4"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800"
          >
            <option value="low">🟢 Low Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
          </select>
          
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-300">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700 font-medium">Make Public</span>
          </label>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button 
            type="submit" 
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-sm"
          >
            {editingNote ? 'Update Note' : 'Create Note'}
          </button>
          {editingNote && (
            <button 
              type="button" 
              onClick={() => setEditingNote(null)} 
              className="flex-1 sm:flex-none bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default NoteForm;