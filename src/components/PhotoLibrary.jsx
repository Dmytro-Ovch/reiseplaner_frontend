import { useState } from "react";
import { fetchUnsplashImages } from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import { useTravel } from "../contexts/TravelContext";

export default function PhotoLibrary() {
  const [openCity, setOpenCity] = useState(null);       // Modal für eine Stadt
  const [modalPhoto, setModalPhoto] = useState(null);   // Vollbild-Preview
  const { photos, setPhotos, unsplash, setUnsplash } = useTravel(); // Context erweitert
  const navigate = useNavigate();
  const location = useLocation();
  const points = location.state?.points || [];

  /**
   * Unsplash-Bilder laden (nur Vorschau, nicht automatisch ausgewählt)
   */
  const loadPhotosForCity = async (city) => {
    try {
      if (!unsplash[city] || unsplash[city].length === 0) {
        const urls = await fetchUnsplashImages(city, 20); // 20 Bilder pro Stadt
        setUnsplash((prev) => ({ ...prev, [city]: urls }));
      }
    } catch (err) {
      console.error("Fehler beim Laden von Unsplash:", err);
    }
  };

  const openModal = async (city) => {
    await loadPhotosForCity(city);

    // photos[city] initialisieren, falls noch nicht vorhanden
    setPhotos(prev => ({
      ...prev,
      [city]: prev[city] || [],
    }));

    setOpenCity(city);
  };

  /**
   * Foto auswählen / abwählen
   */
  const togglePhoto = (city, url) => {
    setPhotos(prev => {
      const current = prev[city] || [];
      return {
        ...prev,
        [city]: current.includes(url)
          ? current.filter(p => p !== url)
          : [...current, url],
      };
    });
  };

  const goBackStep3 = () => {
    navigate("/travelstepperpage", { state: { fromPhotoLibrary: true } });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-center">Allgemeine Informationen über die Stadt </h2>

        {/* Jede Stadt */}
        {points.map((p, idx) => (
          <div
            key={idx}
            className="border border-gray-700 rounded-lg p-4 shadow-sm bg-gray-800 flex flex-col gap-4"
          >
            {/* Stadt + Land + Button */}
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
              <div>
                <label className="block mb-1 text-gray-300">Stadt</label>
                <input
                  type="text"
                  value={p.city}
                  className="input input-bordered w-full bg-gray-700 text-white"
                  disabled
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Land</label>
                <input
                  type="text"
                  value={p.country}
                  className="input input-bordered w-full bg-gray-700 text-white"
                  disabled
                />
              </div>
              <button
                type="button"
                className="btn btn-accent btn-sm"
                onClick={() => openModal(p.city)}
              >
                Fotos wählen
              </button>
            </div>

            {/* Vorschau für diese Stadt */}
            <div className="flex flex-wrap gap-2">
              {(photos[p.city] || []).map((url, i) => (
                <img
                  key={`${p.city}-${i}`}
                  src={url}
                  alt={`${p.city}-${i}`}
                  className="w-24 h-24 object-cover rounded cursor-pointer border border-gray-600"
                  onClick={() => setModalPhoto(url)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Navigation */}
        <button className="btn btn-block mt-6 w-fit mx-auto" onClick={goBackStep3}>
          Zurück zur Erstellung einer Reise
        </button>
      </div>

      {/* Modal: Fotoauswahl */}
      {openCity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl w-11/12 max-w-3xl relative">
            <button
              className="absolute top-2 right-2 text-gray-300 hover:text-white text-xl"
              onClick={() => setOpenCity(null)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">
              Fotos für {openCity} auswählen
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
              {(unsplash[openCity] || []).map((url, idx) => (
                <label key={idx} className="relative cursor-pointer block">
                  <input
                    type="checkbox"
                    className="absolute top-2 left-2 z-10 accent-blue-500"
                    checked={photos[openCity]?.includes(url) || false} // false, falls noch nichts gewählt
                    onChange={() => togglePhoto(openCity, url)}
                  />
                  <img
                    src={url}
                    alt={`${openCity}-${idx}`}
                    className={`rounded shadow-sm object-cover w-full h-40 transition-transform ${
                      photos[openCity]?.includes(url)
                        ? "ring-4 ring-blue-500 scale-105"
                        : ""
                    }`}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Vollbild-Vorschau */}
      {modalPhoto && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-90">
          <div className="relative p-4">
            <button
              className="absolute top-4 right-4 text-white text-xl font-bold z-[1001]"
              onClick={() => setModalPhoto(null)}
            >
              ✕
            </button>
            <img
              src={modalPhoto}
              alt="Full"
              className="max-h-[90vh] max-w-[90vw] rounded shadow-lg mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
