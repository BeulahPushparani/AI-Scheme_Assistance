import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout.jsx";
import ProtectedRoute from "./components/ui/ProtectedRoute.jsx";

import Landing from "./pages/Landing.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CategorySelect from "./pages/CategorySelect.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";

import Wizard from "./pages/Wizard.jsx";
import Results from "./pages/Results.jsx";
import SavedSchemes from "./pages/SavedSchemes.jsx";
import ChatAssistant from "./pages/ChatAssistant.jsx";
import Schemes from "./pages/Schemes.jsx";
import SchemeDetails from "./pages/SchemeDetails.jsx";
import Applications from "./pages/Applications.jsx"; 


export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes wrapped in main layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/schemes" element={<ProtectedRoute><Schemes /></ProtectedRoute>}/>
        <Route path="/schemes/:schemeId" element={<ProtectedRoute><SchemeDetails /></ProtectedRoute>}/>
        <Route path="/applications"element={ <ProtectedRoute>  <Applications /> </ProtectedRoute> }/>

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category"
          element={
            <ProtectedRoute>
              <CategorySelect />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wizard"
          element={
            <ProtectedRoute>
              <Wizard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedSchemes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatAssistant />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}