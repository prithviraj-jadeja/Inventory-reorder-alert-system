import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-cyan-700 to-cyan-500 text-white p-4 flex justify-between items-center">
      
      
        {user ? (
          <>
            <Link to="/dashboard" className="text-2xl font-bold">Inventory Reorder Alert System</Link>
            <div>
            <Link to="/dashboard" className="mr-4">Alert</Link>
            <Link to="/items" className="mr-4">Inventory</Link>
            <Link to="/profile" className="mr-4">Profile</Link>
            
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/" className="text-2xl font-bold">Inventory Reorder Alert System</Link>
            <div>
            <Link to="/login" className="mr-4">Login</Link>
            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </Link>
            </div>
          </>
        )}
    </nav>
  );
};

export default Navbar;
