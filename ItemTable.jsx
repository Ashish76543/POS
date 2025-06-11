import React from "react";

function ItemTable({ itemList, handleDelete, total }) {
  return (
    <>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Item Code</th>
            <th>Item Name</th>
            <th>Unit</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {itemList.map((value, key) => (
            <tr key={key}>
              <td>{value.sino}</td>
              <td>{value.itemCode}</td>
              <td>{value.itemName}</td>
              <td>{value.unit}</td>
              <td>{value.qty}</td>
              <td>{parseFloat(value.unitPrice).toFixed(2)}</td>
              <td>{parseFloat(value.totalPrice).toFixed(2)}</td>
              <td><button onClick={() => handleDelete(value)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>TOTAL: ₹{total && !isNaN(total) ? total.toFixed(2) : "0.00"}</p>
    </>
  );
}

export default ItemTable;
