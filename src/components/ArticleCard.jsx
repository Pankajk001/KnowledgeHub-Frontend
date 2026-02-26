import { Link } from 'react-router-dom';
import { Calendar, User, Tag, FolderOpen } from 'lucide-react';
import './ArticleCard.css';

export default function ArticleCard({ article }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const tags = article.tags ? article.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <Link to={`/article/${article.id}`} className="article-card">
      <div className="article-card-category">
        <FolderOpen size={14} />
        <span>{article.category}</span>
      </div>

      <h3 className="article-card-title">{article.title}</h3>

      <p className="article-card-summary">
        {article.summary || 'No summary available.'}
      </p>

      {tags.length > 0 && (
        <div className="article-card-tags">
          {tags.slice(0, 4).map((tag, i) => (
            <span key={i} className="tag">
              <Tag size={10} />
              {tag}
            </span>
          ))}
          {tags.length > 4 && <span className="tag tag-more">+{tags.length - 4}</span>}
        </div>
      )}

      <div className="article-card-meta">
        <div className="article-card-author">
          <User size={14} />
          <span>{article.author?.username || 'Unknown'}</span>
        </div>
        <div className="article-card-date">
          <Calendar size={14} />
          <span>{formatDate(article.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}
