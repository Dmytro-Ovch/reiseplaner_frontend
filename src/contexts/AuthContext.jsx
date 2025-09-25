import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);

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

      alert(`Signup successful, ${data.data.username}! Please log in.`);
      navigate("/login");
    } catch (error) {
      alert(error.message);
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

      alert(`Login successful, ${data.data.username}. Role: ${data.data.role}`);
      navigate("/");
    } catch (error) {
      alert(error.message);
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

      alert(data.message || "Logout successful");
    } catch (error) {
      alert(error.message);
      console.error(error);
      throw error;
    }
  };

  // Refresh session
  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data.data); // User-Daten setzen
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
    <AuthContext.Provider
      value={{ user, setUser, signup, login, logout, isRefreshing }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContextProvider, AuthContext };
