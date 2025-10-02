import React, { useEffect, useState } from "react";
import axios from "axios";

type Application = {
  id: number;
  position: string;
  company: string;
  status: string;
  created_at: string;
  updated_at: string;
};

const statusOptions = ["Applied", "Interview", "Offer", "Rejected"];
const statusColors: Record<string, string> = {
  Applied: "bg-blue-500/20 text-blue-300",
  Interview: "bg-yellow-500/20 text-yellow-300",
  Offer: "bg-green-500/20 text-green-300",
  Rejected: "bg-red-500/20 text-red-300",
};

const Applications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [form, setForm] = useState({
    position: "",
    company: "",
    status: "Applied",
  });

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/api/applications");
      setApplications(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const openModal = (app?: Application) => {
    setEditingApp(app || null);
    setForm(
      app
        ? { position: app.position, company: app.company, status: app.status }
        : { position: "", company: "", status: "Applied" }
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingApp(null);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingApp)
        await axios.put(
          `http://localhost:3000/api/applications/${editingApp.id}`,
          form
        );
      else await axios.post("http://localhost:3000/api/applications", form);
      fetchApplications();
      closeModal();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this application?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/applications/${id}`);
      fetchApplications();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 bg-gray-950">
        <p className="text-gray-400 animate-pulse">Loading...</p>
      </div>
    );
  if (error) return <p className="text-center text-red-400 mt-8">{error}</p>;

  return (
    <div className="w-full px-6 py-10 bg-gray-950 min-h-screen text-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Job Applications</h2>
        <button
          onClick={() => openModal()}
          className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm"
        >
          + Add Application
        </button>
      </div>

      {/* Empty state */}
      {applications.length === 0 && (
        <p className="text-gray-400 text-center mt-10">
          No applications found. Start applying! 🚀
        </p>
      )}

      {/* Table */}
      {applications.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-900/60 border-b border-gray-800 sticky top-0">
              <tr>
                {[
                  "Position",
                  "Company",
                  "Status",
                  "Created",
                  "Updated",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-2 text-left text-gray-400 font-medium"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map((app, idx) => (
                <tr
                  key={app.id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-900/30" : "bg-gray-900/10"
                  } hover:bg-gray-800/50 transition`}
                >
                  <td className="px-6 py-2 font-medium text-gray-200">
                    {app.position}
                  </td>
                  <td className="px-6 py-2 text-gray-300">{app.company}</td>
                  <td className="px-6 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[app.status] || "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-2 text-gray-400 whitespace-nowrap">
                    {new Date(app.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-2 text-gray-400 whitespace-nowrap">
                    {new Date(app.updated_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-2 flex gap-2">
                    <button
                      onClick={() => openModal(app)}
                      className="cursor-pointer px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-white rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="cursor-pointer px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md text-gray-100">
            <h3 className="text-xl font-semibold mb-4">
              {editingApp ? "Edit Application" : "Add Application"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="Position"
                className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company"
                className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-blue-500"
                required
              />
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-blue-500"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="cursor-pointer px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm"
                >
                  {editingApp ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
