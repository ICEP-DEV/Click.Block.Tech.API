const express = require("express");
const cors = require("cors");
const customerRoutes = require("./route/customerRoutes");
const adminRoutes = require("./route/adminRoutes");
const supportingDocumentRoutes = require("./route/supportingDocumentRoutes");
const bankAccountRoutes = require("./route/bankAccountRoutes");
const notificationRoutes = require("./route/notificationRoutes");
const bankCardRoutes = require("./route/bankCardRoutes");
const transactionRoutes = require("./route/transactionRoutes"); // Import transaction routes

const app = express();

const db = require("./config/config");

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Use express' built-in URL-encoded parser
app.use(cors());

app.use("/api", customerRoutes);
app.use("/api", adminRoutes);
//app.use('/api', supportingDocumentRoutes);
app.use("/api", bankAccountRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", bankCardRoutes);
app.use("/api", transactionRoutes); // Use transaction routes




app.post("/triggerPop/:cardNumber", (req, res) => {
  const query = `SELECT c.CustID_Nr, c.AccountID, c.loginpin
                   FROM customer c 
                   JOIN bankcard bc ON c.AccountID = bc.AccountID 
                   JOIN bankaccount ba ON bc.AccountID = ba.AccountID 
                   WHERE bc.CardNumber = ?`;

  db.query(query, [req.params.cardNumber, req.body.pin], (err, result) => {
    if (err) {
      console.error("Error retrieving customer by card number:", err);
      return;
    }

    if (result.length > 0) {
      if (result[0].loginpin == req.body.pin) {
        console.log("Customer found:", result[0]);
        var transactionType = req.body.transactionType;
        var amount = req.body.amount;
        console.log(amount);

        var CustID_Nr = result[0].CustID_Nr;
        var AccountID = result[0].AccountID;
        var currentdate = new Date();
        const insertQuery = `INSERT INTO transaction(AccountID, TransactionType,TransactionDate,TransactionAmount,Status)
                              VALUES('${AccountID}','${transactionType}','${currentdate}','${amount}', 'Pending')`;
        
        db.query(insertQuery, (err, results) => {
          if (err) {
            console.error("Error retrieving customer by card number:", err);
            return;
          }
          console.log(results);
          
          if(results.affectedRows != 0){
            res.send({
              CustID_Nr,
              AccountID,
              success: true,
              transactionType,
              amount,
            });
          }
        })
        
        
      } else {
        console.log("No customer found with this card number.");
        res.send({
          message: "No customer found with this card number.",
          success: false,
        });
      }
    } else {
      console.log("No customer found with this card number.");
      res.send({
        message: "No customer found with this card number.",
        success: false,
      });
    }
  });
});

app.get("/get_popup/:account_id",(req, res)=>{
  var sql = `SELECT * FROM transaction  where AccountID ='${req.params.account_id}' AND status = 'Pending'`;
  db.query(sql, (err, result) => {
    if(err){
      console.log(err);
      return;
    }
    console.log(result);
    
    if (result.length > 0) {
      res.send({success: true });
    }
  })
})

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
