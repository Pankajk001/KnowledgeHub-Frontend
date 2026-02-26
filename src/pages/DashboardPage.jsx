import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Edit, Trash2, Eye, Calendar, FolderOpen, Loader2, PenSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import './DashboardPage.css';

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    api.get('/articles/user/me')
      .then(res => setArticles(res.data.articles))
      .catch(err => {
        console.error('Failed to fetch articles:', err);
        toast.error('Failed to load your articles.');
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleDelete = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      await api.delete(`/articles/${articleId}`);
      setArticles(prev => prev.filter(a => a.id !== articleId));
      toast.success('Article deleted.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete.');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="page loading-state">
        <Loader2 size={40} className="spin" />
        <p>Loading your articles...</p>
      </div>
    );
  }

  return (
    <div className="page dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>My Articles</h1>
          <p>Manage your published content</p>
        </div>
        <Link to="/create" className="btn btn-primary">
          <PenSquare size={18} />
          <span>New Article</span>
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="empty-state">
          <PenSquare size={48} />
          <h3>No articles yet</h3>
          <p>Start sharing your knowledge with the world!</p>
          <Link to="/create" className="btn btn-primary">Create Your First Article</Link>
        </div>
      ) : (
        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id}>
                  <td>
                    <Link to={`/article/${article.id}`} className="article-title-link">
                      {article.title}
                    </Link>
                  </td>
                  <td>
                    <span className="category-badge">
                      <FolderOpen size={12} />
                      {article.category}
                    </span>
                  </td>
                  <td>
                    <span className="date-cell">
                      <Calendar size={12} />
                      {formatDate(article.created_at)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/article/${article.id}`} className="action-btn view" title="View">
                        <Eye size={16} />
                      </Link>
                      <Link to={`/edit/${article.id}`} className="action-btn edit" title="Edit">
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="action-btn delete"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
