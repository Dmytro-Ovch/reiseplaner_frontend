import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Users, BarChart3, Map, Trash2, UserCog, ArrowLeft } from "lucide-react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTravels, setUserTravels] = useState([]);
  const [totalTravels, setTotalTravels] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Benutzer laden
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Fehler beim Laden der Benutzer");
        setUsers(data.data);
        setFilteredUsers(data.data);
        const total = data.data.reduce((sum, user) => sum + (user.travels?.length || 0), 0);
        setTotalTravels(total);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter aktualisieren
  useEffect(() => {
    const filtered = users.filter(u =>
      u.username.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  // Reisen eines Benutzers laden
  const fetchUserTravels = async (userId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/travels`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error("Fehler beim Laden der Routen");
      setSelectedUser(data.user);
      setUserTravels(data.travels || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Diagrammdaten
  const roleData = [
    { name: "Admins", value: users.filter(u => u.role === "admin").length },
    { name: "User", value: users.filter(u => u.role === "user").length },
  ];
  const COLORS = ["#074b32ff", "#0e3a80ff"];

  return (
    <div className="flex h-screen bg-base-100 text-base-content">
      {/* Sidebar */}
      <aside className="w-64 bg-base-200 flex flex-col p-4 shadow-lg">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <BarChart3 /> Admin Dashboard
        </h2>
        <nav className="flex flex-col gap-2">
          <a href="#stats" className="btn btn-ghost text-left"><BarChart3 size={18}/> Statistiken</a>
          <a href="#users" className="btn btn-ghost text-left"><Users size={18}/> Benutzer</a>
          <a href="#user-travels" className="btn btn-ghost text-left"><Map size={18}/> Routen</a>
          <Link to="/" className="btn btn-outline btn-sm mt-auto flex items-center gap-2">
            <ArrowLeft size={16}/> Zurück
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Ladeanzeige / Fehler */}
        {loading && <div className="flex justify-center items-center h-full"><span className="loading loading-spinner text-primary"></span></div>}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && (
          <>
            {/* Statistiken */}
            <section id="stats" className="mb-10">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2"><BarChart3 /> Statistiken</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-base-200 shadow p-6">
                  <h4 className="text-lg font-semibold">Benutzer</h4>
                  <p className="text-3xl font-bold">{users.length}</p>
                </div>
                <div className="card bg-base-200 shadow p-6">
                  <h4 className="text-lg font-semibold">Reiserouten</h4>
                  <p className="text-3xl font-bold">{totalTravels}</p>
                </div>
                <div className="card bg-base-200 shadow p-6 flex flex-col items-center">
                  <h4 className="text-lg font-semibold mb-2">Rollenverteilung</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={roleData} dataKey="value" outerRadius={80}>
                        {roleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* Benutzerverwaltung */}
            <section id="users" className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold flex items-center gap-2"><Users /> Benutzerverwaltung</h3>
                <input
                  type="text"
                  placeholder="Benutzer suchen..."
                  className="input input-bordered input-sm w-full max-w-xs"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="overflow-x-auto rounded-lg">
                <table className="table table-sm bg-base-200 shadow text-sm min-w-[600px]">
                  <thead>
                    <tr className="bg-base-300">
                      <th>№</th>
                      <th>Username</th>
                      <th>Rolle</th>
                      <th>Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, idx) => (
                      <tr key={u._id} className="hover:bg-base-300">
                        <td>{idx + 1}</td>
                        <td>{u.username}</td>
                        <td>{u.role}</td>
                        <td className="flex gap-2 flex-wrap">
                          {/* Rolle ändern */}
                          <button
                            className="btn btn-xs btn-outline"
                            onClick={async () => {
                              try {
                                const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${u._id}/role`, {
                                  method: "PATCH",
                                  credentials: "include",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ role: u.role === "admin" ? "user" : "admin" }),
                                });
                                if (res.ok) {
                                  setUsers(prev => prev.map(x => x._id === u._id
                                    ? { ...x, role: x.role === "admin" ? "user" : "admin" }
                                    : x));
                                }
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                          >
                            <UserCog size={14}/> Rolle
                          </button>

                          {/* Löschen */}
                          <button
                            className="btn btn-xs btn-error"
                            onClick={async () => {
                              if (!confirm(`Benutzer ${u.username} wirklich löschen?`)) return;
                              try {
                                const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${u._id}`, {
                                  method: "DELETE",
                                  credentials: "include",
                                });
                                if (res.ok) setUsers(prev => prev.filter(x => x._id !== u._id));
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                          >
                            <Trash2 size={14}/> Löschen
                          </button>

                          {/* Routen anzeigen */}
                          <button
                            className="btn btn-xs btn-info"
                            onClick={() => fetchUserTravels(u._id)}
                          >
                            <Map size={14}/> Routen
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Routen eines Users */}
            {selectedUser && (
              <section id="user-travels">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-semibold flex items-center gap-2">
                    <Map /> Routen von {selectedUser.username}
                  </h3>
                  <button className="btn btn-sm btn-outline" onClick={() => setSelectedUser(null)}>
                    Ausblenden
                  </button>
                </div>
                <div className="overflow-x-auto rounded-lg">
                  <table className="table table-sm bg-base-200 shadow text-sm min-w-[600px]">
                    <thead>
                      <tr className="bg-base-300">
                        <th>№</th>
                        <th>Startdatum</th>
                        <th>Enddatum</th>
                        <th>Punkte</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userTravels.map((t, idx) => (
                        <tr key={t._id} className="hover:bg-base-300">
                          <td>{idx + 1}</td>
                          <td>{t.startDate || "-"}</td>
                          <td>{t.endDate || "-"}</td>
                          <td>
                            {t.points?.map((p, i) => (
                              <div key={i}>
                                {p.city && p.country ? `${p.city}, ${p.country}` : p.name || `Punkt ${i + 1}`}
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
          </>
        )}
      </main>
    </div>
  );
}
