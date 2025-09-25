import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import TravelPlannerPage from './pages/TravelPlannerPage.jsx';
import TravelStepperPage from './pages/TravelStepperPage.jsx';
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";

//import TravelPage from "./pages/TravelPage";
//import Dashboard from "./pages/Dashboard";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import TravelStepperForm from './components/TravelStepperForm.jsx';
import TravelPlanner from './components/LeafletMap.jsx';
import TravelCityList from './components/TravelCityList.jsx';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/travelplannerpage" element={<TravelPlannerPage />} />
        <Route path="/travelstepperpage" element={<TravelStepperPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected routes for logged-in users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/travelform" element={<TravelStepperForm />} />
        <Route path="/travelplanner" element={<TravelPlanner />} />
        <Route path="/travelcities" element={<TravelCityList />} />
      </Route>

      {/* Protected routes only for admins */}
      <Route element={<ProtectedRoute roles={["admin"]} />}>
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<h1>Page not found</h1>} />
    </Routes>
  );
}

export default App;
