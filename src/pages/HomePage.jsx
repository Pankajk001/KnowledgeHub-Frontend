import { useState, useEffect } from 'react';
import api from '../services/api';
import ArticleCard from '../components/ArticleCard';
import { Search, Filter, BookOpen, Loader2 } from 'lucide-react';
import './HomePage.css';

const CATEGORIES = ['All', 'Tech', 'AI', 'Backend', 'Frontend', 'DevOps', 'Database', 'Cloud', 'Security', 'Mobile', 'Other'];

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;

      const res = await api.get('/articles', { params });
      setArticles(res.data.articles);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchArticles();
  };

  return (
    <div className="page home-page">
      <div className="home-hero">
        <h1>
          <BookOpen size={36} />
          Discover & Share Knowledge
        </h1>
        <p>Explore technical articles, powered by AI assistance</p>
      </div>

      <div className="search-filter-bar">
        <form onSubmit={handleSearch} className="search-form">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search articles by title, content, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>

        <div className="category-filter">
          <Filter size={18} />
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="category-select"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <Loader2 size={40} className="spin" />
          <p>Loading articles...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} />
          <h3>No articles found</h3>
          <p>Be the first to share your knowledge!</p>
        </div>
      ) : (
        <>
          <div className="articles-grid">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-ghost"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>
              <span className="page-info">Page {page} of {totalPages}</span>
              <button
                className="btn btn-ghost"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
