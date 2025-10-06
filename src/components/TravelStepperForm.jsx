import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useTravel } from "../contexts/TravelContext";
import { Link } from "react-router-dom";

export default function TravelStepperForm() {
  const { user } = useContext(AuthContext);
  const { routePoints, setRoutePoints, photos, setPhotos, setUnsplash } = useTravel();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [step, setStep] = useState(1);

  // formData enthält dynamische Punkte + Datum
  const [formData, setFormData] = useState({
    points: [],
    startDate: "",
    endDate: "",
  });

  // Punkte aus routePoints automatisch übernehmen
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      points: routePoints.map((pt) => ({
        city: pt.name,
        country: pt.country,
      })),
    }));
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

  // Punkt entfernen
const removePoint = (index) => {
  const cityName = routePoints[index]?.name;

  // 1️ Stadt aus formData.points entfernen
  setFormData((prev) => ({
    ...prev,
    points: prev.points.filter((_, i) => i !== index),
  }));

  // 2️ Stadt aus routePoints entfernen
  setRoutePoints((prev) => prev.filter((_, i) => i !== index));

  if (cityName) {
    // 3️ Fotos dieser Stadt löschen
    setPhotos((prev) => {
      const copy = { ...prev };
      delete copy[cityName];
      return copy;
    });

    // 4️ Unsplash-Cache dieser Stadt löschen
    setUnsplash((prev) => {
      const copy = { ...prev };
      delete copy[cityName];
      return copy;
    });
  }
};


  // Submit Handler
  const handleSubmit = async () => {
    if (!user) return alert("Sie müssen eingeloggt sein!");

    const payload = {
      username: user.username,
      points: formData.points,
      startDate: formData.startDate,
      endDate: formData.endDate,
      photos: Object.entries(photos).map(([city, urls]) => ({ city, urls })),
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

      {/* Schritt 1: Städte */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          {formData.points.map((p, idx) => (
            <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
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
              <div className="flex justify-center">
                <button
                  type="button"
                  className="btn btn-dash btn-xs btn-circle"
                  onClick={() => removePoint(idx)}
                >
                  ✕
                </button>
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
              onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
              className="input input-bordered w-full"
              required
            />
          </label>
          <label className="block">
            Enddatum:
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
              className="input input-bordered w-full mt-2"
              required
            />
          </label>
        </div>
      )}

      {/* Schritt 3: Fotos */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          {formData.points.map((p, idx) => {
            const cityPhotos = photos[p.city] || [];

            return (
              <div key={idx} className="flex flex-col gap-2">
                <h4 className="font-semibold">{p.city}</h4>

                {/* Textinput für manuelle URLs */}
                <label className="block">
                  Foto-URLs (kommagetrennt):
                  <input
                    type="text"
                    value={cityPhotos.join(",")}
                    onChange={(e) => {
                      const urls = e.target.value.split(",").map((u) => u.trim());
                      setPhotos((prev) => ({
                        ...prev,
                        [p.city]: urls,
                      }));
                    }}
                    className="input input-bordered w-full"
                  />
                </label>

                {/* Buttons: Fotogalerie + Upload */}
                <div className="flex gap-2">
                  <Link
                    to="/photolibrary"
                    state={{ points: [p] }}
                    className="btn btn-info flex-1"
                  >
                    Fotos auswählen
                  </Link>

                  {/* <label className="btn btn-info flex-1 cursor-pointer">
                    Foto hochladen
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        const urls = files.map((f) => URL.createObjectURL(f));
                        setPhotos((prev) => ({
                          ...prev,
                          [p.city]: [...(prev[p.city] || []), ...urls],
                        }));
                      }}
                    />
                  </label> */}
                </div>

                {/* Vorschau */}
                <div className="flex gap-2 flex-wrap mt-2">
                  {cityPhotos.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`${p.city}-${i}`}
                      className="w-24 h-24 object-cover rounded shadow cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setSelectedPhoto(url)}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Modal */}
          {selectedPhoto && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80">
              <div className="relative p-4 max-w-[90vw] max-h-[90vh]">
                <button
                  className="absolute top-2 right-2 text-white text-xl font-bold"
                  onClick={() => setSelectedPhoto(null)}
                >
                  ✕
                </button>
                <img
                  src={selectedPhoto}
                  alt="Ausgewähltes Foto"
                  className="max-w-full max-h-full rounded shadow-lg"
                />
              </div>
            </div>
          )}

          {/* Speichern */}
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
        <button
          type="button"
          className="btn bg-blue-500 hover:bg-blue-600 text-white"
          onClick={prevStep}
          disabled={step === 1}
        >
          Zurück
        </button>
        <button
          type="button"
          className="btn bg-blue-500 hover:bg-blue-600 text-white"
          onClick={nextStep}
          disabled={step === 3}
        >
          Weiter
        </button>
      </div>
    </div>
  );
}
