import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { AlertContext } from "../contexts/AlertContext"; // globaler AlertContext

const Login = () => {
  const [formState, setFormState] = useState({
    username: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext); // Zugriff auf globale Alerts

  const handleInput = (e) =>
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formState);
      showAlert("success", "Login erfolgreich!"); // globaler Erfolg
    } catch (err) {
      showAlert("error", err.message || "Login fehlgeschlagen."); // globaler Fehler
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-100">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <fieldset className="fieldset bg-base-200 border border-base-300 p-8 rounded-2xl shadow-xl">
          <legend className="fieldset-legend text-3xl font-bold text-white mb-6 text-center">
            Login
          </legend>

          <div className="flex flex-col gap-6">
            {/* Username */}
            <label className="fieldset-label text-lg" htmlFor="username">
              Username
            </label>
            <input
              className="input input-lg w-full"
              type="text"
              required
              placeholder="your_username"
              name="username"
              onChange={handleInput}
              value={formState.username}
              id="username"
            />

            {/* Password */}
            <label className="fieldset-label text-lg" htmlFor="password-login">
              Password
            </label>
            <input
              type="password"
              className="input input-lg w-full"
              required
              placeholder="Password"
              name="password"
              onChange={handleInput}
              value={formState.password}
              id="password-login"
            />

            {/* Submit Button */}
            <button
              disabled={!formState.username || !formState.password}
              className="btn btn-neutral btn-lg w-full mt-4"
            >
              Login
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Login;
