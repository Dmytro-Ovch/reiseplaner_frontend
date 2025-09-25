import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const SignUp = () => {
  const [formState, setFormState] = useState({
    username: "",
    password: "",
  });
  const [confirmPW, setConfirmPW] = useState("");
  const [error, setError] = useState(null);

  const { signup } = useContext(AuthContext);

  const handleInput = (e) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (confirmPW !== formState.password) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await signup(formState);
    } catch (err) {
      setError(err.message || "Signup failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-100">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <fieldset className="fieldset bg-base-200 border border-base-300 p-8 rounded-2xl shadow-xl">
          <legend className="fieldset-legend text-3xl font-bold text-white mb-6 text-center">
            Sign Up
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
            <label className="fieldset-label text-lg" htmlFor="password-signup">
              Password
            </label>
            <input
              type="password"
              className="input input-lg w-full"
              required
              placeholder="Password"
              minLength="8"
              name="password"
              pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\#\\?!\\@\\$%\\^&*\\-]).{8,}"
              title="Must be more than 8 characters, including number, lowercase, uppercase, and special character"
              onChange={handleInput}
              value={formState.password}
              id="password-signup"
            />

            {/* Confirm Password */}
            <label className="fieldset-label text-lg" htmlFor="password-confirm">
              Confirm Password
            </label>
            <input
              type="password"
              className={`input input-lg w-full ${
                confirmPW && formState.password === confirmPW
                  ? "input-success"
                  : confirmPW
                  ? "input-error"
                  : ""
              }`}
              required
              placeholder="Confirm Password"
              title="Must match Password"
              onChange={(e) => setConfirmPW(e.target.value)}
              value={confirmPW}
              id="password-confirm"
            />
            {confirmPW && confirmPW !== formState.password && (
              <p className="text-red-500 text-sm">Passwords don&apos;t match.</p>
            )}

            {/* Error-Message */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Button */}
            <button
              disabled={!confirmPW || confirmPW !== formState.password}
              className="btn btn-neutral btn-lg w-full mt-4"
            >
              Signup
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default SignUp;
