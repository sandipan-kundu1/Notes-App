import React, { useState, useEffect } from 'react';

const API_URL = 'https://your-render-app.onrender.com';

function Analytics({ isOpen, onClose }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchAnalytics();
    }
  }, [isOpen]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Analytics fetch failed:', error);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading analytics...</div>
        ) : analytics ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-blue-600 mb-4">Usage Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Notes:</span>
                  <span className="font-bold">{analytics.totalNotes}</span>
                </div>
                <div className="flex justify-between">
                  <span>Notes This Month:</span>
                  <span className="font-bold">{analytics.notesThisMonth}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-green-600 mb-4">Categories</h3>
              <div className="space-y-2">
                {analytics.categoriesBreakdown.map((cat, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{cat._id || 'Uncategorized'}:</span>
                    <span className="font-bold">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-yellow-600 mb-4">Priority Distribution</h3>
              <div className="space-y-2">
                {analytics.priorityBreakdown.map((priority, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="capitalize">{priority._id}:</span>
                    <span className="font-bold">{priority.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-red-500">
            Analytics not available. Upgrade to Enterprise plan.
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;