import React from "react";
import axios from "axios";

function Customer() {
  const [count, setCount] = React.useState(0);
  const [all, setAll] = React.useState([]);
  const [customer, setCustomer] = React.useState({
    customer_code: "",
    customer_name: "",
  });

  const [message, setMessage] = React.useState("");
  const [isError, setIsError] = React.useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  }

  React.useEffect(() => {
    const f = async () => {
      try {
        const result = await axios.post("http://localhost:3000/getallcustomers");
        setAll(result.data);
      } catch (err) {
        setMessage("Error fetching customers.");
        setIsError(true);
      }
    };
    f();
  }, [count]);

  async function handleS(event) {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3000/insertcustomer", customer);
      setMessage("✅ Customer inserted successfully!");
      setIsError(false);
      setCount((prev) => prev + 1);
      setCustomer({ customer_code: "", customer_name: "" });
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage("Customer code already exists.");
      } else {
        setMessage("Failed to insert customer.");
      }
      setIsError(true);
    }
  }

  const del = async (code) => {
    try {
      await axios.post("http://localhost:3000/deletecustomer", { code });
      setMessage("❌ Customer deleted successfully.");
      setIsError(false);
      setCount((prev) => prev + 1);
    } catch (err) {
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Delete failed.");
      }
      setIsError(true);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Insert New Customer</h2>
      <form onSubmit={handleS} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Customer Code"
          value={customer.customer_code}
          onChange={handleChange}
          name="customer_code"
          required
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Customer Name"
          value={customer.customer_name}
          onChange={handleChange}
          name="customer_name"
          required
          style={{ marginRight: "10px" }}
        />
        <button type="submit">Submit</button>
      </form>

      {message && <p style={{ color: isError ? "red" : "green" }}>{message}</p>}

      <h3>All Customers</h3>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Customer Code</th>
            <th>Customer Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {all.map((cust, index) => (
            <tr key={index}>
              <td>{cust.customer_code}</td>
              <td>{cust.customer_name}</td>
              <td>
                <button onClick={() => del(cust.customer_code)} style={{ color: "red" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {all.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No customers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Customer;
