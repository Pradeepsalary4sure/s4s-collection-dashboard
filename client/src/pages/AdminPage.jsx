import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, UserPlus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { listUsers, createUser, deleteUser, toggleAccess } from "../services/authApi";

export default function AdminPage({ onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", name: "", role: "user" });
  const [formMsg, setFormMsg] = useState("");

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    try {
      const res = await listUsers();
      if (res.success) setUsers(res.data);
    } catch (_) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser(e) {
    e.preventDefault();
    setFormMsg("");
    if (!formData.email) {
      setFormMsg("Email is required");
      return;
    }
    if (formData.password && formData.password.length < 6) {
      setFormMsg("Password must be at least 6 characters if provided");
      return;
    }
    try {
      const res = await createUser(formData);
      if (res.success) {
        setFormMsg("User created successfully!");
        setFormData({ email: "", password: "", name: "", role: "user" });
        setShowForm(false);
        loadUsers();
      }
    } catch (err) {
      setFormMsg(err.response?.data?.message || "Failed to create user");
    }
  }

  async function handleDeleteUser(id) {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch (_) {
      setError("Failed to delete user");
    }
  }

  async function handleToggleAccess(id, currentStatus) {
    try {
      const res = await toggleAccess(id, !currentStatus);
      if (res.success) {
        loadUsers();
      }
    } catch (_) {
      setError("Failed to toggle access");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-black text-gray-900">User Management</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm mb-6"
          >
            <UserPlus className="w-4 h-4" />
            Create New User
          </button>

          {showForm && (
            <form onSubmit={handleCreateUser} className="mb-6 p-4 bg-gray-50 rounded-xl border space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-3 py-2 border rounded-lg text-sm"
                  required
                />
                <input
                  type="password"
                  placeholder="Password (optional - OTP login)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-3 py-2 border rounded-lg text-sm"
                />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <p className="text-xs text-gray-500 italic">Password is optional. If not set, user can login via OTP only.</p>
              {formMsg && <p className={`text-xs font-semibold ${formMsg.includes("success") ? "text-green-600" : "text-red-600"}`}>{formMsg}</p>}
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm">Create User</button>
            </form>
          )}

          {error && <p className="text-red-600 text-sm font-semibold mb-4">{error}</p>}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No users found</p>
          ) : (
            <div className="space-y-2">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 bg-white border rounded-xl hover:shadow-sm">
                  <div>
                    <p className="font-semibold text-sm">{u.name || "No Name"}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                        {u.role || "user"}
                      </span>
                      {u.is_verified ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-100 text-green-700">Access ON</span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">Access OFF</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleAccess(u.id, u.is_verified)}
                      className={`p-2 rounded-lg transition-colors ${u.is_verified ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                      title={u.is_verified ? "Revoke Access" : "Grant Access"}
                    >
                      {u.is_verified ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete user">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}