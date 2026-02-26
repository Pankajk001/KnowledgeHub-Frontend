import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PenSquare, Home, LayoutDashboard, LogIn, LogOut, Sparkles, Sun, Moon } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Sparkles size={24} />
          <span>KnowledgeHub</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <Home size={18} />
            <span>Home</span>
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/create" className="nav-link">
                <PenSquare size={18} />
                <span>New Article</span>
              </Link>
              <Link to="/dashboard" className="nav-link">
                <LayoutDashboard size={18} />
                <span>My Articles</span>
              </Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          <button onClick={toggleTheme} className="theme-toggle" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-greeting">Hi, {user?.username}</span>
              <button onClick={handleLogout} className="btn btn-ghost">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost">
                <LogIn size={18} />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="btn btn-primary">
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
