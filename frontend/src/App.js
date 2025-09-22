
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from "./components/Footer";
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Items from './pages/Items';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/items" element={<Items />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
     
      <Footer />
    </Router>
  );
}

export default App;

