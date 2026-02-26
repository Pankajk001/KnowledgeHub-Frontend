import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import RichTextEditor from '../components/RichTextEditor';
import AIAssistant from '../components/AIAssistant';
import { Save, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import './CreateEditPage.css';

const CATEGORIES = ['Tech', 'AI', 'Backend', 'Frontend', 'DevOps', 'Database', 'Cloud', 'Security', 'Mobile', 'Other'];

export default function CreateEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Tech');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [titleSuggestions, setTitleSuggestions] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isEditing) {
      api.get(`/articles/${id}`)
        .then(res => {
          const a = res.data.article;
          setTitle(a.title);
          setContent(a.content);
          setCategory(a.category);
          setTags(a.tags || '');
        })
        .catch(() => {
          toast.error('Article not found.');
          navigate('/');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content || content === '<p></p>') {
      toast.error('Title and content are required.');
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await api.put(`/articles/${id}`, { title, content, category, tags });
        toast.success('Article updated!');
        navigate(`/article/${id}`);
      } else {
        const res = await api.post('/articles', { title, content, category, tags });
        toast.success('Article published!');
        navigate(`/article/${res.data.article.id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save article.');
    } finally {
      setSaving(false);
    }
  };

  const handleTitleSuggestions = (suggestions) => {
    setTitleSuggestions(suggestions);
  };

  const handleTagSuggestions = (suggestedTags) => {
    const current = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    const merged = [...new Set([...current, ...suggestedTags])];
    setTags(merged.join(', '));
  };

  if (loading) {
    return (
      <div className="page loading-state">
        <Loader2 size={40} className="spin" />
        <p>Loading article...</p>
      </div>
    );
  }

  return (
    <div className="page create-edit-page">
      <h1>{isEditing ? 'Edit Article' : 'Create New Article'}</h1>

      <div className="create-edit-layout">
        <form onSubmit={handleSubmit} className="article-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title..."
              className="form-input"
              required
            />
          </div>

          {titleSuggestions.length > 0 && (
            <div className="title-suggestions">
              <div className="suggestions-header">
                <span>AI Title Suggestions:</span>
                <button type="button" onClick={() => setTitleSuggestions([])} className="close-suggestions">
                  <X size={14} />
                </button>
              </div>
              {titleSuggestions.map((suggestion, i) => (
                <button
                  key={i}
                  type="button"
                  className="suggestion-item"
                  onClick={() => { setTitle(suggestion); setTitleSuggestions([]); }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group form-group-grow">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="react, javascript, web..."
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Content</label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <><Loader2 size={18} className="spin" /> Saving...</>
              ) : (
                <><Save size={18} /> {isEditing ? 'Update Article' : 'Publish Article'}</>
              )}
            </button>
          </div>
        </form>

        <aside className="ai-sidebar">
          <AIAssistant
            content={content}
            title={title}
            onContentUpdate={setContent}
            onTitleSuggestions={handleTitleSuggestions}
            onTagSuggestions={handleTagSuggestions}
          />
        </aside>
      </div>
    </div>
  );
}
