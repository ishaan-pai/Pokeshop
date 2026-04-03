import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAdmin, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        POKÉSHOP
      </Link>
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Browse</Link>
        {isAdmin ? (
          <>
            <Link to="/admin" className="navbar-link">Dashboard</Link>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/admin/login" className="navbar-link navbar-link--dim">Admin</Link>
        )}
      </div>
    </nav>
  );
}
