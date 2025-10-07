import { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "./AlertContext"; 

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const { showAlert } = useContext(AlertContext); // Zugriff auf globalen Alert
  const navigate = useNavigate();

  // Signup
  const signup = async (formState) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      showAlert("success", `Signup erfolgreich, ${data.data.username}! Bitte logge dich ein.`);
      navigate("/login");
    } catch (error) {
      showAlert("error", error.message);
      console.error(error);
      throw error;
    }
  };

  // Login
  const login = async (formState) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      setUser(data.data);
      showAlert("success", `Login erfolgreich, ${data.data.username}. Rolle: ${data.data.role}`);
      navigate("/");
    } catch (error) {
      showAlert("error", error.message);
      console.error(error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/logout`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Logout failed");

      setUser(null);
      navigate("/");
      showAlert("info", data.message || "Logout erfolgreich");
    } catch (error) {
      showAlert("error", error.message);
      console.error(error);
      throw error;
    }
  };

  // Session refresh
  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.data);
        }
      } catch (err) {
        console.warn("Session refresh failed", err);
      } finally {
        setIsRefreshing(false);
      }
    };
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, signup, login, logout, isRefreshing }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContextProvider, AuthContext };
