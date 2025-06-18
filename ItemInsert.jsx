import React from "react";
import axios from "axios";

function ItemInsert() {
  const [count, setCount] = React.useState(0);
  const [all, setAll] = React.useState([]);
  const [item, setItem] = React.useState({
    item_code: "",
    item_name: "",
    unit: "",
    sales_price: "",
  });

  const [message, setMessage] = React.useState("");
  const [isError, setIsError] = React.useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  }

  React.useEffect(() => {
    const f = async () => {
      let result = await axios.post("http://localhost:3000/getallitems");
      setAll(result.data);
    };
    f();
  }, [count]);

  async function handleS(event) {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/insertitem", item);
      setMessage("✅ Item inserted successfully!");
      setIsError(false);
      setCount((prev) => prev + 1);
      setItem({ item_code: "", item_name: "", unit: "", sales_price: "" });
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage("Item code already exists.");
      } else {
        setMessage("Failed to insert item.");
      }
      setIsError(true);
    }
  }

  const del = async (x) => {
    try {
      await axios.post("http://localhost:3000/deleteitem", { code: x });
      setCount((prev) => prev + 1);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Insert New Item</h2>
      <form onSubmit={handleS} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Name"
          value={item.item_name}
          onChange={handleChange}
          name="item_name"
          required
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Code"
          value={item.item_code}
          onChange={handleChange}
          name="item_code"
          required
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Unit"
          value={item.unit}
          onChange={handleChange}
          name="unit"
          required
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          placeholder="Sales Price"
          value={item.sales_price}
          onChange={handleChange}
          name="sales_price"
          required
          style={{ marginRight: "10px" }}
        />
        <button type="submit">Submit</button>
      </form>

      {message && <p style={{ color: isError ? "red" : "green" }}>{message}</p>}

      <h3>All Items</h3>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Code</th>
            <th>Name</th>
            <th>Unit</th>
            <th>Sales Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {all.map((item, index) => (
            <tr key={index}>
              <td>{item.item_code}</td>
              <td>{item.item_name}</td>
              <td>{item.unit}</td>
              <td>{item.sales_price}</td>
              <td>
                <button onClick={() => del(item.item_code)} style={{ color: "red" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {all.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No items found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ItemInsert;
