import React, { useEffect, useState } from "react";
import axios from "axios";

function Rights() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await axios.get("http://localhost:3000/getallusers");
        setUsers(result.data);
      } catch (err) {
        setError("Failed to load users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (index, field) => {
    const updatedUsers = [...users];
    updatedUsers[index] = {
      ...updatedUsers[index],
      [field]: updatedUsers[index][field] === "y" ? "f" : "y",
    };
    setUsers(updatedUsers);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await axios.post("http://localhost:3000/updaterights", { total: users });
    
    } catch (err) {
      console.error("Error updating rights:", err);
      
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>User Rights Management</h2>
      <form onSubmit={handleSubmit}>
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Item</th>
              <th>Customer</th>
              <th>Rights</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.username}>
                <td>{user.username}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={user.item === "y"}
                    onChange={() => handleChange(idx, "item")}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={user.customer === "y"}
                    onChange={() => handleChange(idx, "customer")}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={user.rights === "y"}
                    onChange={() => handleChange(idx, "rights")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default Rights;
