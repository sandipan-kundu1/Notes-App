import React, { useState } from 'react';

const API_URL = 'https://your-render-app.onrender.com';

function PricingModal({ isOpen, onClose, currentPlan, onUpgrade }) {
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: 'Free',
      price: '$0',
      features: ['10 Notes', 'Basic Search', 'Categories'],
      plan: 'free'
    },
    {
      name: 'Pro',
      price: '$9.99/mo',
      features: ['100 Notes', 'Advanced Search', 'Collaboration', 'Export Notes', 'Priority Support'],
      plan: 'pro'
    },
    {
      name: 'Enterprise',
      price: '$29.99/mo',
      features: ['Unlimited Notes', 'Analytics Dashboard', 'Team Management', 'API Access', 'Custom Integrations'],
      plan: 'enterprise'
    }
  ];

  const handleUpgrade = async (plan) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/subscription/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ plan })
      });

      if (res.ok) {
        onUpgrade();
        onClose();
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Choose Your Plan</h2>
              <p className="text-gray-600 mt-1">Upgrade to unlock powerful features</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div 
                key={plan.plan} 
                className={`relative rounded-2xl p-6 border-2 transition-all duration-200 ${
                  currentPlan === plan.plan 
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                } ${index === 1 ? 'md:scale-105 md:shadow-lg' : ''}`}
              >
                {index === 1 && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-gray-800 mb-1">{plan.price}</div>
                  {plan.plan !== 'free' && (
                    <p className="text-gray-500 text-sm">per month</p>
                  )}
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleUpgrade(plan.plan)}
                  disabled={loading || currentPlan === plan.plan}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    currentPlan === plan.plan 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                      : index === 1
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  }`}
                >
                  {loading ? 'Processing...' : currentPlan === plan.plan ? 'Current Plan' : 'Choose Plan'}
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              All plans include 30-day money-back guarantee • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingModal;