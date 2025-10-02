
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Items from './pages/Items';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/CalendarPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
    <div className="flex flex-col min-h-screen">

      <Navbar />
      
      <main className="flex-grow">

      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/items" element={<Items />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </ErrorBoundary>
      </main>
      
      <Footer />
    </div>
    </Router>
  );
}

export default App;

