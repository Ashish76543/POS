import React from "react";
import InvoiceForm from "./InvoiceForm";
import ItemForm from "./ItemForm";
import ItemTable from "./ItemTable";
import axios from "axios"
import './styles.css';

function App() {
  let [invoiceNo, setInvoiceno] = React.useState(null);
  let [itemCode, setItemCode] = React.useState([]);
  let [newItemCode, setNewItemCode] = React.useState([]);
  let [transMaster, setTransMaster] = React.useState("");
  let [itemList, setItemList] = React.useState([]);
  let [total, setTotal] = React.useState(0);

  let [invoiceDetails, setInvoiceDetails] = React.useState({
    invoiceDate: "",
    invoiceType: "cash",
    customerCode: "",
    comments: ""
  });

  let [itemDetails, setItemDetails] = React.useState({
    sino: "",
    itemCode: "",
    itemName: "",
    unit: "",
    qty: "",
    unitPrice: "",
    totalPrice: 0
  });

  let [customerName, setCustomerName] = React.useState("");

  React.useEffect(() => {
    let func = async function () {
      const result = await axios.post("http://localhost:3000/getitemcode");
      setItemCode(result.data);
      setNewItemCode(result.data);
    };
    func();
  }, []);

  let handleChange = async function (event) {
    let name = event.target.name;
    let value = event.target.value;

    if (name === "customerCode") {
      if (value.length >= 2) {
        let result = await axios.post("http://localhost:3000/getcustomername", {
          cid: value
        });
        setCustomerName(result.data);
      }
    }

    setInvoiceDetails((prev) => {
      return { ...prev, [name]: value };
    });
  };

  let handleSubmit = async function (event) {
    event.preventDefault();

    if (invoiceDetails.invoiceDate.length === 0) {
      alert("Please enter an invoice date.");
      return;
    }

    try {
      const result = await axios.post("http://localhost:3000/transmaster", {
        details: invoiceDetails
      });

      if (result.data.msg === "new transaction header created") {
        setInvoiceno(result.data.m); 
        setTransMaster("Transaction saved");
        setInvoiceDetails({
          invoiceDate: "",
          invoiceType: "cash",
          customerCode: "",
          comments: ""
        });
        setCustomerName("");
        setItemList([]);
        setTotal(0);
      } else {
        setTransMaster(result.data.msg);
      }
    } catch (error) {
      console.error("Error submitting invoice:", error);
      setTransMaster("Error submitting invoice.");
    }
  };

  let handleChange2 = async function (event) {
    let name = event.target.name;
    let value = event.target.value;

    setItemDetails((prev) => ({ ...prev, [name]: value }));

    if (name === "itemCode") {
      let matched = itemCode.find(
        (item) => item.item_code.toLowerCase() === value.toLowerCase()
      );

      if (!matched) {
        setNewItemCode(
          itemCode.filter((item) =>
            item.item_code.toLowerCase().includes(value.toLowerCase())
          )
        );
        return;
      }

      let result = await axios.post("http://localhost:3000/getitemname", {
        code: matched.item_code
      });

      if (result.data !== "invalid user") {
        setItemDetails((prev) => ({
          ...prev,
          itemCode: matched.item_code,
          itemName: result.data.item_name,
          unit: result.data.unit,
          unitPrice: result.data.sales_price
        }));
        setNewItemCode([]);
      }
    }
  };

  const handleItemSubmit = async (event) => {
    event.preventDefault();

    const parsedQty = parseFloat(itemDetails.qty);
    const parsedPrice = parseFloat(itemDetails.unitPrice);

    if (isNaN(parsedQty) || parsedQty <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert("Please enter a valid unit price");
      return;
    }

    try {
      const result = await axios.post("http://localhost:3000/submititem", {
        item: itemDetails,
        invoiceno: invoiceNo
      });

      if (result.data.message === "Item added successfully.") {
        const transactionCode = result.data.value;

        const updatedItem = {
          ...itemDetails,
          sino: transactionCode,
          totalPrice: parsedQty * parsedPrice
        };

        const updatedList = [...itemList, updatedItem];
        setItemList(updatedList);

        const totalSum = updatedList.reduce(
          (sum, item) => sum + item.totalPrice,
          0
        );
        setTotal(totalSum);

        setItemDetails({
          sino: "",
          itemCode: "",
          itemName: "",
          unit: "",
          qty: "",
          unitPrice: "",
          totalPrice: 0
        });

        
      } else {
        alert(result.data.message);
      }
    } catch (error) {
      console.error("Error submitting item:", error);
      alert("Error submitting item. See console for details.");
    }
  };

let handleDelete = async function (val) {
  try {
    const response = await axios.post("http://localhost:3000/delete", {
      invoiceno: invoiceNo,
      sino: val.sino,
    });

    if (response.data.message === "success") {
      const updatedList = response.data.updatedList;
       
      let y = updatedList.map((value) => ({
        sino: value.sino,
        itemCode: value.itemcode,
        itemName: value.itemname,
        unit: value.unit,
        qty: value.qty,
        unitPrice: value.unitprice,
        totalPrice:  parseFloat(value.totalprice), 
      }));
      setItemList(y)
      

      

      const totalSum = y.reduce((sum, item) => sum + item.totalPrice, 0);
      setTotal(totalSum);
    } else {
      alert("Failed to delete item.");
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    alert("Error deleting item.");
  }
};
let handleFinish = () => {
  setInvoiceno(null);
  setInvoiceDetails({
    invoiceDate: "",
    invoiceType: "cash",
    customerCode: "",
    comments: ""
  });
  setCustomerName("");
  setItemDetails({
    sino: "",
    itemCode: "",
    itemName: "",
    unit: "",
    qty: "",
    unitPrice: "",
    totalPrice: 0
  });
  setItemList([]);
  setTotal(0);
  setTransMaster("");
  alert("Invoice saved with total: ₹" + total.toFixed(2));
};



  return (
    <div>
      <div style={{ border: "10px solid black" }}>
        <p>INVOICE NO: {invoiceNo ? invoiceNo : "(Not saved yet)"}</p>

        <InvoiceForm
          invoiceDetails={invoiceDetails}
          customerName={customerName}
          transMaster={transMaster}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />

        <ItemForm
          itemDetails={itemDetails}
          itemCode={itemCode}
          newItemCode={newItemCode}
          handleChange2={handleChange2}
          handleItemSubmit={handleItemSubmit}
          setNewItemCode={setNewItemCode}
        />
      </div>

      <ItemTable
        itemList={itemList}
        handleDelete={handleDelete}
        total={total}
      />

      <button onClick={handleFinish}>FINISH</button>
    </div>
  );
}

export default App;
