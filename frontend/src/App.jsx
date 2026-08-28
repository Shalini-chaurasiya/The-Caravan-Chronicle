import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Citizen */}
      <Route
        path="/citizen/login"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold">Citizen Login Page</h1>
          </div>
        }
      />

      <Route
        path="/citizen/register"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold">Citizen Register Page</h1>
          </div>
        }
      />

      {/* Staff */}
      <Route
        path="/staff/login"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold">Staff Login Page</h1>
          </div>
        }
      />

      <Route
        path="/staff/register"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold">Staff Register Page</h1>
          </div>
        }
      />

      {/* Owner */}
      <Route
        path="/owner/login"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold">Owner Login Page</h1>
          </div>
        }
      />

      <Route
        path="/owner/register"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold">Owner Register Page</h1>
          </div>
        }
      />
    </Routes>
  );
}

export default App;