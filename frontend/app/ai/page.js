'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { api } from '../../lib/api';

export default function AIAssistant() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [issue, setIssue] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { user } = await api.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      setLoading(false);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/auth');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issue.trim()) {
      toast.error('Please describe your security concern');
      return;
    }

    setRequesting(true);
    try {
      const response = await api.ai.suggest(issue);
      setSuggestion(response.suggestion);
      toast.success('Suggestion received');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to get response');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center px-3 mb-3">
        <h1 className="h4 mb-0">AI Security Assistant</h1>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="securityIssue" className="form-label">
                Describe your security concern
              </label>
              <textarea
                id="securityIssue"
                className="form-control"
                rows="3"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="E.g., How can I secure my database against SQL injection attacks?"
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={requesting}
            >
              {requesting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Getting Suggestion...
                </>
              ) : (
                <>
                  <i className="bi bi-robot me-2"></i>
                  Get AI Suggestion
                </>
              )}
            </button>
          </form>

          {suggestion && (
            <div className="suggestion-content mt-4">
              <h6 className="mb-3">
                <i className="bi bi-lightbulb me-2"></i>
                AI Suggestion
              </h6>
              <div className="bg-light p-3 rounded">
                {suggestion}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 