import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, Tag, FolderOpen, Edit, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import './ArticleDetailPage.css';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${id}`);
        setArticle(res.data.article);
      } catch (error) {
        toast.error('Article not found.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await api.delete(`/articles/${id}`);
      toast.success('Article deleted.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete.');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="page loading-state">
        <Loader2 size={40} className="spin" />
        <p>Loading article...</p>
      </div>
    );
  }

  if (!article) return null;

  const tags = article.tags ? article.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const isAuthor = user?.id === article.author_id;

  return (
    <div className="page article-detail-page">
      <button onClick={() => navigate(-1)} className="back-btn">
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      <article className="article-full">
        <header className="article-header">
          <div className="article-category-badge">
            <FolderOpen size={14} />
            <span>{article.category}</span>
          </div>

          <h1 className="article-title">{article.title}</h1>

          <div className="article-meta-row">
            <div className="meta-item">
              <User size={16} />
              <span>{article.author?.username}</span>
            </div>
            <div className="meta-item">
              <Calendar size={16} />
              <span>{formatDate(article.created_at)}</span>
            </div>
            {article.updated_at && article.updated_at !== article.created_at && (
              <div className="meta-item">
                <Clock size={16} />
                <span>Updated {formatDate(article.updated_at)} at {formatTime(article.updated_at)}</span>
              </div>
            )}
          </div>

          {isAuthor && (
            <div className="article-actions">
              <Link to={`/edit/${article.id}`} className="btn btn-primary btn-sm">
                <Edit size={16} />
                <span>Edit</span>
              </Link>
              <button onClick={handleDelete} className="btn btn-danger btn-sm">
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </header>

        <div
          className="article-content prose"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {tags.length > 0 && (
          <div className="article-tags-section">
            <Tag size={16} />
            <div className="article-tags">
              {tags.map((tag, i) => (
                <span key={i} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
