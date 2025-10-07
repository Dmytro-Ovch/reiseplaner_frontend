import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from 'react-router-dom';
import {AuthContextProvider} from "./contexts/AuthContext.jsx";
import { TravelProvider, useTravel } from "./contexts/TravelContext";
import { AlertProvider } from "./contexts/AlertContext";
import { MapProvider } from "./contexts/MapContext";


// Mount the app
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <MapProvider>
      <BrowserRouter>
        <AlertProvider>
          <AuthContextProvider>
            <TravelProvider>
              <App />
            </TravelProvider>
          </AuthContextProvider>
        </AlertProvider>
      </BrowserRouter>
    </MapProvider>
  </StrictMode>,
);
