const dbConnection = require("../database/db_connection");

const addLoan = (itemId, borrowerId, cb) => {
  dbConnection.query(
    `INSERT INTO loans (item_id, borrowers_id) VALUES ($1, $2)`,
    [itemId, borrowerId],
    (err, res) => {
      if (err) {
        return cb(err);
      }
      dbConnection.query(
        `UPDATE items SET on_loan = TRUE WHERE items.id = $1`,
        [itemId],
        (err, res) => {
          if (err) {
            return cb(err);
          }
          return cb(null, res);
        }
      );
    }
  );
};

const postData = (name, email, itemId, cb) => {
  console.log("postData");
  let borrowerId;
  dbConnection.query(
    `SELECT id FROM users WHERE email=$1`,
    [email],
    (err, res) => {
      if (err) {
        return cb(err);
      }
      if (res.rowCount > 0) {
        borrowerId = res.rows[0].id;
        addLoan(itemId, borrowerId, cb);
      } else {
        dbConnection.query(
          `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id`,
          [name, email],
          (err, res) => {
            if (err) {
              console.log(err);
              return cb(err);
            }
            borrowerId = res.rows[0].id;
            addLoan(itemId, borrowerId, cb);
          }
        );
      }
    }
  );
};


const addItem = (name, description, lenderId, cb) => {
  dbConnection.query(
    `INSERT INTO items (name, description, lender_id) VALUES ('${name}', '${description}', ${lenderId}) RETURNING id`, 
    (err, res) => {
      if (err) {
        return cb(err);
      }
    } 
  )
};

// Below function is for adding items (and new user if not already present)
// WET. MAY DRY EVENTUALLY
// params passed as arguments by handler/router
const insertData = (name, email, itemName, itemDesc, cb) => {
  console.log("insertData");
  let lenderId;
  dbConnection.query(
    `SELECT id FROM users WHERE email=$1`,
    [email],
    (err, res) => {
      if (err) {
        return cb(err);
      }
      if (res.rowCount > 0) {
        lenderId = res.rows[0].id;
        addItem(itemName, itemDesc, lenderId, cb);
      } else {
        dbConnection.query(
          `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id`,
          [name, email],
          (err, res) => {
            if (err) {
              return cb(err);
            }
            lenderId = res.rows[0].id;
            // Need to update these
            addItem(itemName, itemDesc, lenderId, cb);
          }
        );
      }
    }
  );
};

module.exports = { postData, insertData };
