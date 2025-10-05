import { useState, useEffect } from "react";
import { useTravel } from "../contexts/TravelContext";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const { routePoints } = useTravel(); // aktuelle Routen
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTravels, setUserTravels] = useState([]);
  const [totalTravels, setTotalTravels] = useState(0);

  // Benutzer laden
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) setUsers(data.data);

        // Gesamtreisen zählen
        const total = data.data.reduce((sum, user) => sum + (user.travels?.length || 0), 0);
        setTotalTravels(total);

      } catch (err) {
        console.error("Fehler beim Laden der Benutzer:", err);
      }
    };
    fetchUsers();
  }, []);

  // Routen eines Users laden
  const fetchUserTravels = async (userId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}/travels`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Fehler beim Laden der Routen");
      const data = await res.json();
      setSelectedUser(data.user);
      setUserTravels(data.travels || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-4">
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <a href="#stats" className="btn btn-ghost text-left">Statistiken</a>
          <a href="#users" className="btn btn-ghost text-left">Benutzer</a>
          <a href="#user-travels" className="btn btn-ghost text-left">Reiserouten</a>
          <Link to ="/" className="btn btn-ghost text-left mt-auto">Zurück zum Reiseplaner</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-900 text-white p-6 overflow-y-auto max-w-6xl mx-auto">
        {/* Statistiken */}
        <section id="stats" className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Statistiken</h3>
          <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="card bg-gray-800 text-white shadow p-4">
              <h4 className="font-bold text-xl">Nutzer</h4>
              <p className="text-gray-600">{users.length}</p>
            </div>
            <div className="card bg-gray-800 text-white shadow p-4">
              <h4 className="font-bold text-xl">Reiserouten</h4>
              <p className="text-gray-600">{totalTravels}</p>
            </div>
            <div className="card bg-gray-800 text-white shadow p-4">
              <h4 className="font-bold text-xl">Weitere Statistik</h4>
              <p className="text-gray-600">456</p>
            </div>
          </div>
        </section>

        {/* Benutzerverwaltung */}
        <section id="users" className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Benutzerverwaltung</h3>
          <div className="overflow-x-auto">
            <table className="table table-sm bg-gray-800 text-white shadow rounded-md text-sm min-w-[600px]">
              <thead>
                <tr className="bg-gray-700 text-gray-200">
                  <th>№</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u._id} className={idx % 2 === 0 ? "bg-gray-700" : "bg-gray-800"}>
                    <td className="p-2">{idx + 1}</td>
                    <td className="p-2">{u.username}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2 flex gap-2 flex-wrap">
                      {/* Rolle ändern */}
                      <button
                        className="btn btn-xs btn-dash"
                        onClick={async () => {
                          try {
                            const res = await fetch(
                              `${import.meta.env.VITE_API_URL}/users/${u._id}/role`,
                              {
                                method: "PATCH",
                                credentials: "include",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ role: u.role === "admin" ? "user" : "admin" }),
                              }
                            );
                            if (res.ok) {
                              setUsers(prev =>
                                prev.map(x => x._id === u._id ? { ...x, role: x.role === "admin" ? "user" : "admin" } : x)
                              );
                            }
                          } catch (err) {
                            console.error("Fehler beim Ändern der Rolle:", err);
                          }
                        }}
                      >
                        Rolle ändern
                      </button>

                      {/* Benutzer löschen */}
                      <button
                        className="btn btn-xs btn-dash"
                        onClick={async () => {
                          if (!confirm("Willst du diesen Benutzer wirklich löschen?")) return;
                          try {
                            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${u._id}`, {
                              method: "DELETE",
                              credentials: "include",
                            });
                            if (res.ok) setUsers(prev => prev.filter(x => x._id !== u._id));
                          } catch (err) {
                            console.error("Fehler beim Löschen:", err);
                          }
                        }}
                      >
                        Löschen
                      </button>

                      {/* Routen anzeigen */}
                      <button
                        className="btn btn-xs btn-dash"
                        onClick={() => fetchUserTravels(u._id)}
                      >
                        Routen anzeigen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Routen des ausgewählten Users als Tabelle */}
        {selectedUser && (
          <section id="user-travels" className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Routen von {selectedUser.username}</h3>
              <button
                className="btn btn-xs"
                onClick={() => {
                  setSelectedUser(null);
                  setUserTravels([]);
                }}
              >
                Alle Routen ausblenden
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-sm bg-gray-800 text-white shadow rounded-md text-sm min-w-[600px]">
                <thead>
                  <tr className="bg-gray-700 text-gray-200">
                    <th>№</th>
                    <th>Startdatum</th>
                    <th>Enddatum</th>
                    <th>Punkte</th>
                  </tr>
                </thead>
                <tbody>
                  {userTravels.map((travel, idx) => (
                    <tr key={travel._id} className={idx % 2 === 0 ? "bg-gray-700" : "bg-gray-800"}>
                      <td className="p-2">{idx + 1}</td>
                      <td className="p-2">{travel.startDate || "-"}</td>
                      <td className="p-2">{travel.endDate || "-"}</td>
                      <td className="p-2">
                  {travel.points?.map((p, i) => (
                  <div key={i}>
                     {p.city && p.country 
                      ? `${p.city}, ${p.country}`
                     : p.name || `Punkt ${i + 1}`}
                  </div>
                   )) || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
