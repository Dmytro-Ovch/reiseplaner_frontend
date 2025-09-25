import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useTravel } from "../contexts/TravelContext";

export default function TravelStepperForm() {
  const { user } = useContext(AuthContext);       // AuthContext korrekt nutzen
  const { routePoints } = useTravel();           // TravelContext für Städte

  const [step, setStep] = useState(1);

  // formData enthält alle dynamischen Punkte + Datum + Fotos
  const [formData, setFormData] = useState({
    points: [], // Array von { city, country }
    startDate: "",
    endDate: "",
    photos: [],
  });

  // Automatisch Punkte aus routePoints erstellen
  useEffect(() => {
    if (routePoints.length > 0) {
      setFormData((prev) => ({
        ...prev,
        points: routePoints.map((pt) => ({
          city: pt.name,
          country: pt.country,
        })),
      }));
    }
  }, [routePoints]);

  // Handler für dynamische Felder
  const handleCityChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.points];
      updated[index].city = value;
      return { ...prev, points: updated };
    });
  };

  const handleCountryChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.points];
      updated[index].country = value;
      return { ...prev, points: updated };
    });
  };

  // Stepper Navigation
  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // Submit Handler
  const handleSubmit = async () => {
    if (!user) return alert("Sie müssen eingeloggt sein!");

    const payload = {
    username: user.username,
    points: formData.points,   // array von {city,country}
    startDate: formData.startDate,
    endDate: formData.endDate,
    photos: formData.photos,
  };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/travels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler beim Speichern der Reise");

      alert("Reise erfolgreich gespeichert!");
      console.log("Gespeichert:", data);
    } catch (err) {
      console.error(err);
      alert("Fehler: " + err.message);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      {/* Stepper */}
      <ul className="steps mb-6">
        <li className={`step ${step >= 1 ? "step-primary" : ""}`}>Städte & Länder</li>
        <li className={`step ${step >= 2 ? "step-primary" : ""}`}>Datum</li>
        <li className={`step ${step >= 3 ? "step-primary" : ""}`}>Fotos</li>
      </ul>

      {/* Schritt 1: Dynamische Felder für jede Stadt/Land */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          {formData.points.map((p, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-2">
              <div>
                <label className="block mb-1">Stadt {idx + 1}:</label>
                <input
                  type="text"
                  value={p.city}
                  onChange={(e) => handleCityChange(idx, e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Land {idx + 1}:</label>
                <input
                  type="text"
                  value={p.country}
                  onChange={(e) => handleCountryChange(idx, e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schritt 2: Datum */}
      {step === 2 && (
        <div>
          <label className="block mb-2">
            Startdatum:
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="input input-bordered w-full"
              required
            />
          </label>
          <label className="block">
            Enddatum:
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="input input-bordered w-full mt-2"
              required
            />
          </label>
        </div>
      )}

      {/* Schritt 3: Fotos */}
      {step === 3 && (
        <div>
          <label className="block">
            Foto-URLs (kommagetrennt):
            <input
              type="text"
              value={formData.photos.join(",")}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  photos: e.target.value.split(",").map((p) => p.trim()),
                }))
              }
              className="input input-bordered w-full"
            />
          </label>
          <button
            type="button"
            className="btn btn-primary mt-4 w-full"
            onClick={handleSubmit}
          >
            Reise speichern
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button type="button" className="btn bg-blue-500 hover:bg-blue-600 text-white" onClick={prevStep} disabled={step === 1}>
          Zurück
        </button>
        <button type="button" className="btn bg-blue-500 hover:bg-blue-600 text-white" onClick={nextStep} disabled={step === 3}>
          Weiter
        </button>
      </div>
    </div>
  );
}
