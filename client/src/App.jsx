import Navbar from "./component/nav-bar/Navbar";
import Content from "./component/content/Content";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import About from "./pages/About";
import ProtectedRoute from "./component/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import DoctorProfile from "./pages/DoctorProfile";
import ProfilePage from "./pages/profile";

function App() {
  return (
    <AuthProvider>
{/* <DoctorProfile/> */}
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route index element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
        path="/content"
          
          element={
            <ProtectedRoute>
              <Content/>
            </ProtectedRoute>
          }
        />
         <Route
        path="/doctor-profile"
          
          element={
            <ProtectedRoute>
              <DoctorProfile/>
            </ProtectedRoute>
          }
        />
         <Route
        path="/profile"
          
          element={
            <ProtectedRoute>
              <ProfilePage/>
            </ProtectedRoute>
          }
        />
        {/* Example of adding more protected pages */}
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
