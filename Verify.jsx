import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Verify() {
  const [formData, setFormData] = React.useState({
   
   name: "",
    password: ""
  });
  const [submitCount, setSubmitCount] = React.useState(0);
  const [typ, setType] = React.useState("");
  const [result, setResult] = React.useState("");
  const nav = useNavigate();

  React.useEffect(() => {
    if (submitCount > 0) {
      const fetchData = async () => {
        try {
          const res = await axios.post("http://localhost:3000/usersubmit", {
            name: formData.name,
            password: formData.password,
            typ: typ
          });
          setResult(res.data);
          if (res.data === "login success") {
            nav("/Menu", {
              state: {
                
                name: formData.name
              }
            });
          }
        } catch (error) {
          setResult("Error connecting to server");
          console.error(error);
        }
      };
      fetchData();
    }
  }, [submitCount]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const buttonType = event.nativeEvent.submitter.name;
    setType(buttonType);
    setSubmitCount(prev => prev + 1);
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.box}>
        <h2 style={styles.heading}>Customer Login</h2>
     
        <input
          type="text"
          placeholder="Enter Username"
          onChange={handleChange}
          name="name"
          value={formData.name}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Enter Password"
          onChange={handleChange}
          name="password"
          value={formData.password}
          style={styles.input}
        />
        <div style={styles.buttonContainer}>
          <button type="submit" name="register" style={styles.button}>REGISTER</button>
          <button type="submit" name="login" style={styles.button}>LOGIN</button>
        </div>
        {result && (
          <p style={{
            ...styles.result,
            color: result === "login success" ? "green" : "red"
          }}>
            {result}
          </p>
        )}
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5"
  },
  box: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  heading: {
    textAlign: "center",
    marginBottom: "10px"
  },
  input: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between"
  },
  button: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    flex: 1,
    margin: "0 4px"
  },
  result: {
    marginTop: "10px",
    textAlign: "center",
    fontWeight: "bold"
  }
};

export default Verify;
