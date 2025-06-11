import React from "react";

function InvoiceForm({ invoiceDetails, customerName, transMaster, handleChange, handleSubmit }) {
  return (
    <form id="f1" onSubmit={handleSubmit}>
      <span>INVOICE DATE:</span>
      <input type="date" name="invoiceDate" onChange={handleChange} value={invoiceDetails.invoiceDate} />
      <br />
      <span>INVOICE TYPE</span>
      <select name="invoiceType" onChange={handleChange} value={invoiceDetails.invoiceType}>
        <option value="cash">CASH</option>
        <option value="credit">CREDIT</option>
      </select>
      <br />
      <span>CUSTOMER CODE</span>
      <input type="text" name="customerCode" placeholder="Code" onChange={handleChange} value={invoiceDetails.customerCode} />
      <span>{customerName}</span>
      <br />
      <span>COMMENTS</span>
      <input type="text" name="comments" placeholder="comments" onChange={handleChange} value={invoiceDetails.comments} />
      <br />
      <p>{transMaster}</p>
      <button type="submit">submit</button>
    </form>
  );
}

export default InvoiceForm;
