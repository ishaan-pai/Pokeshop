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
        Pokéshop
      </Link>
      <div className="navbar-links">
        <Link to="/">Browse</Link>
        {isAdmin ? (
          <>
            <Link to="/admin">Dashboard</Link>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/admin/login">Admin</Link>
        )}
      </div>
    </nav>
  );
}
