import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Menu() {
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [menu, setMenu] = React.useState({
    item: "f",
    customer: "f",
    rights: "f",
  });

  React.useEffect(() => {
    if (location.state?.name) {
      const name = location.state.name;
      setUsername(name);

      axios
        .post("http://localhost:3000/getrights", { name })
        .then((res) => {
          if (res.data.message === "success") {
            const { item, customer, rights } = res.data.val;
            setMenu({ item, customer, rights });
          }
        })
        .catch((err) => {
          console.error("Error fetching rights:", err);
        });
    }
  }, [location.state]);

  const handleNavigation = (path, includeUser = false) => {
    if (includeUser) {
      navigate(path, { state: { name: username } });
    } else {
      navigate(path);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "200px", margin: "20px auto" }}>
      <button onClick={() => handleNavigation("/ItemInsert")} disabled={menu.item === "f"}>
        Item Insert
      </button>
      <button onClick={() => handleNavigation("/Customer")} disabled={menu.customer === "f"}>
        Customer Insert
      </button>
      <button onClick={() => handleNavigation("/Rights")} disabled={menu.rights === "f"}>
        Rights Insert
      </button>
      <button onClick={() => handleNavigation("/Handle", true)}>
        Create Invoice
      </button>
    </div>
  );
}

export default Menu;
