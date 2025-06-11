import express from "express";
import cors from "cors";
import pg from "pg";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "pos",
  password: "root",
  port: 5432,
});

db.connect()
app.post("/getinvoicenumber", async (req, res) => {
    try {
        let result = await db.query("SELECT MAX(Invoice_no) FROM Transaction_master");
        
        if (result.rows[0].max == null) {
            res.json(1);
        } else {
            let x = result.rows[0].max + 1;
            res.json(x);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

app.post("/getcustomername",async(req,res)=>{

    let result=await db.query("select Customer_name from Customer_master where Customer_Code=$1",[req.body.cid])
    if (result.rows.length==0){
        res.json("invalid customer")
    }
    else{
        res.json(result.rows[0].customer_name)
    }
})

app.post("/getitemname",async(req,res)=>{
    let result=await db.query("select item_name,unit,sales_price from item_master where item_Code=$1",[req.body.code])
    if (result.rows.length==0){
        res.json("invalid user")
    }
    else{
        res.json(result.rows[0])
    }

})

app.post("/getitemcode", async (req, res) => {
  try {
    let result = await db.query("SELECT item_code FROM item_master");
    res.json(result.rows); 
  } catch (error) {
    console.error("Error fetching item codes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/transmaster", async (req, res) => {
  try {
    const bd = req.body.details;
    const { invoiceDate, invoiceType, customerCode, comments } = bd;

   
    const result = await db.query(
      "SELECT COUNT(*) AS c FROM customer_master WHERE customer_code = $1",
      [customerCode]
    );

    if (parseInt(result.rows[0].c) > 0) {
      
      const insertResult = await db.query(
  "INSERT INTO transaction_master (invoice_date, customer_code, invoice_type, comment_s) VALUES ($1, $2, $3, $4) RETURNING invoice_no",
  [invoiceDate, customerCode, invoiceType, comments]
);

res.json({ msg: "new transaction header created", m: insertResult.rows[0].invoice_no });

     
    } else {
      return res.json({msg:"incorrect customer code"});
    }
  } catch (error) {
    console.error("Error in /transmaster:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/submititem", async (req, res) => {
  try {
    const invoiceno = req.body.invoiceno;
    const bd = req.body.item;
    const { itemCode, itemName, unit, qty, unitPrice } = bd;


    if (!qty || isNaN(qty) || parseFloat(qty) <= 0) {
      return res.json({ status: "error", message: "Enter a valid quantity" });
    }

    if (!unitPrice || isNaN(unitPrice) || parseFloat(unitPrice) <= 0) {
      return res.json({ status: "error", message: "Enter a valid unit price" });
    }

    const parsedQty = parseFloat(qty);
    const parsedPrice = parseFloat(unitPrice);
    const totalPrice = parsedQty * parsedPrice;

    const invoiceCheck = await db.query(
      "SELECT COUNT(*) AS c FROM transaction_master WHERE invoice_no = $1",
      [invoiceno]
    );
    if (parseInt(invoiceCheck.rows[0].c) === 0) {
      return res.json({ status: "error", message: "Create invoice header first" });
    }

  
    const itemCheck = await db.query(
      "SELECT item_name, unit, sales_price FROM item_master WHERE item_code = $1",
      [itemCode]
    );
    if (itemCheck.rows.length === 0) {
      return res.json({ status: "error", message: "No such item code" });
    }

    const dbItem = itemCheck.rows[0];
    const invalidFields = [];
    if (dbItem.item_name !== itemName) invalidFields.push("itemName");
    if (dbItem.unit !== unit) invalidFields.push("unit");
    if (parseFloat(dbItem.sales_price) !== parsedPrice) invalidFields.push("unitPrice");

    if (invalidFields.length > 0) {
      return res.json({
        status: "error",
        message: "Invalid value(s)",
        value: invalidFields
      });
    }


    const codeRes = await db.query(
      "SELECT COALESCE(MAX(transaction_code), 0) + 1 AS next_code FROM transaction_detail WHERE transaction_number = $1",
      [invoiceno]
    );
    const transactionCode = codeRes.rows[0].next_code;

    
    const insertRes = await db.query(
      `INSERT INTO transaction_detail
       (transaction_number, transaction_code, item_code, unit, quantity, unit_price, total_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING transaction_code`,
      [invoiceno, transactionCode, itemCode, unit, parsedQty, parsedPrice, totalPrice]
    );

    return res.json({
      status: "success",
      value: insertRes.rows[0].transaction_code,
      message: "Item added successfully."
    });

  } catch (error) {
    console.error("Error in /submititem:", error);
  
    if (!res.headersSent) {
      return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
  }
});


app.post("/delete", async (req, res) => {
  try {
    const { invoiceno, sino } = req.body;

   
    await db.query(
      "DELETE FROM transaction_detail WHERE transaction_number = $1 AND transaction_code = $2",
      [invoiceno, sino]
    );

    
    const result = await db.query(
      "SELECT transaction_code, item_code FROM transaction_detail WHERE transaction_number = $1 ORDER BY transaction_code",
      [invoiceno]
    );

    for (let i = 0; i < result.rows.length; i++) {
      await db.query(
        "UPDATE transaction_detail SET transaction_code = $1 WHERE transaction_number = $2 AND transaction_code = $3",
        [i + 1, invoiceno, result.rows[i].transaction_code]
      );
    }

   
const updated = await db.query(
  `SELECT 
     td.transaction_code AS sino,
     td.item_code as itemCode,
     im.item_name as itemName,
     td.quantity AS qty,
     td.unit as unit,
     td.unit_price as unitPrice,
     (td.quantity * td.unit_price) AS totalPrice
   FROM transaction_detail td
   JOIN item_master im ON td.item_code = im.item_code
   WHERE td.transaction_number = $1
   ORDER BY td.transaction_code`,
  [invoiceno]
);
    

    res.json({ message: "success", updatedList: updated.rows });

  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "fail" });
  }
});






app.listen(3000,()=>{
    console.log("3000")
})