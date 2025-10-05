import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const TravelsTable = () => {
  const { user } = useContext(AuthContext);
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/travels/user/${user._id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Fehler beim Laden der Reisen");
        setTravels(data.data || []);
      } catch (err) {
        console.error("Travels laden fehlgeschlagen:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchTravels();
  }, [user]);

  if (loading) return <p className="p-4">Lade Reisen...</p>;
  if (!travels.length) return <p className="p-4">Keine Reisen gefunden.</p>;

  return (
    <div className="overflow-x-auto p-4">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>№</th>
            <th>Startdatum</th>
            <th>Enddatum</th>
            <th>Städte</th>
          </tr>
        </thead>
        <tbody>
          {travels.map((travel, idx) => (
            <tr key={travel._id}>
              <td>{idx + 1}</td>
              <td>{new Date(travel.startDate).toLocaleDateString()}</td>
              <td>{new Date(travel.endDate).toLocaleDateString()}</td>
              <td>
                {travel.points.map((p) => `${p.city} (${p.country})`).join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TravelsTable;
