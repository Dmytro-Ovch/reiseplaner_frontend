import { createContext, useState, useCallback } from "react";

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  // showAlert-Funktion für überall im Projekt
  const showAlert = useCallback((type, message) => {
    setAlert({ type, message });

    // Automatisches Ausblenden nach 3 Sekunden
    setTimeout(() => setAlert(null), 3000);
  }, []);

  const hideAlert = () => setAlert(null);

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}

      {/* DaisyUI Alert-Komponente global */}
      {alert && (
        <div className={`alert alert-${alert.type} fixed top-4 right-4 w-auto shadow-lg z-50`}>
          <span>{alert.message}</span>
          <button
            onClick={hideAlert}
            className="btn btn-sm btn-ghost ml-auto"
            type="button"
          >
            ✕
          </button>
        </div>
      )}
    </AlertContext.Provider>
  );
};
