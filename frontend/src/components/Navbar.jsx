// components/Navbar.jsx - Top navigation bar
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <span className="text-2xl">🏛️</span>
            <span className="hidden sm:block">SmartComplaints</span>
          </Link>

          {/* Nav Links */}
          {isAuthenticated && (
            <div className="flex items-center gap-1">
              <NavLink to="/dashboard" active={isActive('/dashboard')}>Dashboard</NavLink>
              <NavLink to="/complaints" active={isActive('/complaints')}>My Complaints</NavLink>
              <NavLink to="/complaints/new" active={isActive('/complaints/new')}>+ New</NavLink>
            </div>
          )}

          {/* User */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:block text-sm text-gray-600">
                  Hi, <span className="font-semibold text-gray-900">{user?.name}</span>
                </span>
                <button onClick={handleLogout} className="btn-secondary text-sm">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary text-sm">Login</Link>
                <Link to="/signup" className="btn-primary text-sm">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, active }) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;
