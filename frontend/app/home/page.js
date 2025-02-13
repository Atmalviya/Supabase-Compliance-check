'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '../../lib/api';

export default function Home() {
  const [issue, setIssue] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.ai.getSuggestion(issue);
      if (response.error) throw new Error(response.error);
      setSuggestion(response.suggestion);
      toast.success('Got AI suggestion!');
    } catch (error) {
      toast.error(error.message || 'Failed to get suggestion');
      setSuggestion('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Supabase Security Assistant</h1>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="issue" className="form-label">
                    Describe your security concern
                  </label>
                  <textarea
                    className="form-control"
                    id="issue"
                    rows="3"
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Getting Suggestion...' : 'Get AI Suggestion'}
                </button>
              </form>

              {suggestion && (
                <div className="mt-4">
                  <h5>AI Suggestion:</h5>
                  <div className="suggestion-content">
                    {suggestion}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 