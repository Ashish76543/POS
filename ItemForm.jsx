import React from "react";

function ItemForm({
  itemDetails,
  itemCode,
  newItemCode,
  handleChange2,
  handleItemSubmit,
  setNewItemCode
}) {
  return (
    <form onSubmit={handleItemSubmit}>
      <div style={{ border: "2px solid black" }}>
        <span>ITEM CODE:</span>
        <input
          type="text"
          placeholder="item code"
          value={itemDetails.itemCode}
          onChange={handleChange2}
          name="itemCode"
          autoComplete="off"
          onBlur={() => setTimeout(() => setNewItemCode([]), 200)}
          onFocus={() =>
            setNewItemCode(
              itemCode.filter((item) =>
                item.item_code.toLowerCase().includes(itemDetails.itemCode.toLowerCase())
              )
            )
          }
        />
        {itemDetails.itemCode && newItemCode.length > 0 && (
          <ul style={{
            listStyle: "none",
            padding: "5px",
            margin: "5px 0",
            border: "1px solid #ccc",
            maxHeight: "150px",
            overflowY: "auto",
            width: "200px",
            backgroundColor: "#fff",
            position: "absolute",
            zIndex: 1
          }}>
            {newItemCode.map((item, index) => (
              <li
                key={index}
                onMouseDown={() => {
                  handleChange2({ target: { name: "itemCode", value: item.item_code } });
                  setNewItemCode([]);
                }}
                style={{
                  padding: "5px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee"
                }}
              >
                {item.item_code}
              </li>
            ))}
          </ul>
        )}

        <span>ITEM NAME:</span>
        <input type="text" placeholder="item name" value={itemDetails.itemName} onChange={handleChange2} name="itemName" />

        <span>UNIT:</span>
        <input type="text" placeholder="unit" value={itemDetails.unit} onChange={handleChange2} name="unit" />

        <span>QUANTITY:</span>
        <input type="text" placeholder="quantity" value={itemDetails.qty} onChange={handleChange2} name="qty" />

        <span>UNIT PRICE:</span>
        <input type="text" placeholder="Unit price" value={itemDetails.unitPrice} onChange={handleChange2} name="unitPrice" />

        <button type="submit">add</button>
      </div>
    </form>
  );
}

export default ItemForm;
