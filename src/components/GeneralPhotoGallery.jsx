import { useState } from "react";
import { useTravel } from "../contexts/TravelContext";

export default function GeneralPhotoGallery() {
  const { photos } = useTravel(); // { Berlin: [...], Paris: [...], uploads: [...] }
  const [modalPhoto, setModalPhoto] = useState(null);

  const getCities = () => {
    return Object.keys(photos || {}).filter((key) => key !== "uploads");
  };

  const cities = getCities();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col gap-8">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2">Meine Fotogalerie</h1>

        {/* Städte */}
        {cities.length === 0 && (
          <div className="border border-gray-800 rounded-lg p-6 bg-gray-800 text-gray-300">
            Keine Fotos vorhanden.
          </div>
        )}

        <div className="flex flex-col gap-6">
          {cities.map((city, idx) => (
            <section
              key={city + idx}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-sm"
              aria-labelledby={`city-${idx}`}
            >
              <header className="flex items-center justify-between mb-3">
                <div>
                  <h2 id={`city-${idx}`} className="text-xl font-semibold">
                    {city}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {photos[city]?.length || 0} Foto{(photos[city] || []).length !== 1 ? "s" : ""}
                  </p>
                </div>
              </header>

              {/* Foto-Grid */}
              {Array.isArray(photos[city]) && photos[city].length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {photos[city].map((url, i) => (
                    <button
                      key={`${city}-${i}`}
                      onClick={() => setModalPhoto(url)}
                      className="relative overflow-hidden rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500"
                      aria-label={`Foto ${i + 1} von ${city}`}
                    >
                      <img
                        src={url}
                        alt={`Foto von ${city} ${i + 1}`}
                        className="w-full h-36 object-cover transform hover:scale-105 transition-transform duration-150"
                        loading="lazy"
                      />
                      {/* subtle overlay for contrast on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Keine Fotos für diese Stadt.</p>
              )}
            </section>
          ))}
        </div>

        {/* Globale Uploads */}
        {photos.uploads && photos.uploads.length > 0 && (
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-4 mt-6">
            <h2 className="text-xl font-semibold mb-2">Hochgeladene Fotos</h2>
            <div className="flex flex-wrap gap-3">
              {photos.uploads.map((url, i) => (
                <button
                  key={`upload-${i}`}
                  onClick={() => setModalPhoto(url)}
                  className="w-28 h-28 overflow-hidden rounded-md focus:outline-none focus:ring-4 focus:ring-blue-500"
                  aria-label={`Hochgeladenes Foto ${i + 1}`}
                >
                  <img
                    src={url}
                    alt={`Hochgeladenes Foto ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Ganz unten: optional Hinweis / Aktionen */}
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center text-sm text-gray-400">
        <span>Tippe ein Bild an, um es groß anzusehen.</span>
      </div>

      {/* Modal: Vollbild-Preview */}
      {modalPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-[95vw] max-h-[95vh]">
            <button
              onClick={() => setModalPhoto(null)}
              className="absolute top-2 right-2 z-20 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Schließen"
            >
              ✕
            </button>
            <img
              src={modalPhoto}
              alt="Vollbild Foto"
              className="max-h-[85vh] max-w-[85vw] object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
