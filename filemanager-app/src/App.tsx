import { Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Signup from './pages/SignupPage';
import EditProfile from './pages/EditProfile';
//import Upload from './files/Upload';
//import List from './files/List';
//import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<EditProfile />} />
      </Routes>
    </>
  );
}

export default App;
