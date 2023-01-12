const db = require("../../helper(db)/connection");
const { v4: uuidv4 } = require("uuid");
const orderModel = {
  query: (queryParams, sortType = "asc", limit = 5) => {
    if (queryParams.search && queryParams.cat) {
      return `WHERE product.name ILIKE '%${queryParams.search}%' AND ORDER BY product.name ${sortType} LIMIT ${limit}`;
    } else if (queryParams.search || queryParams.cat) {
      return `WHERE product.name ILIKE '%${queryParams.search}%' ORDER BY product.name ${sortType} LIMIT ${limit}`;
    } else {
      return `ORDER BY product.name ${sortType} LIMIT ${limit}`;
    }
  },
  get: function (queryParams) {
    console.log(queryParams);
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT orders.id, product.name, product.price, orders.item_id, orders.quantity, orders.total_price
        FROM orders
        INNER JOIN product ON orders.item_id=product.id ${this.query(
          queryParams,
          queryParams.sortBy,
          queryParams.limit
        )}`,

        (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            return resolve(result.rows);
          }
        }
      );
    });
  },
  getDetail: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * from orders WHERE id='${id}'`, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          return resolve(result.rows[0]);
        }
      });
    });
  },
  add: ({ item_id, quantity, total_price }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO orders (id, item_id, quantity, total_price) VALUES ('${uuidv4()}','${item_id}','${quantity}','${total_price}')`,
        (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            return resolve({ item_id, quantity, total_price });
          }
        }
      );
    });
  },
  update: ({ id, name, deskripsi, price, category }) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM orders WHERE id='${id}'`, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          db.query(
            `UPDATE orders SET name='${
              name || result.rows[0].name
            }', deskripsi='${deskripsi || result.rows[0].deskripsi}',price='${
              price || result.rows[0].price
            }', category='${
              category || result.rows[0].category
            }' WHERE id='${id}'`,
            (err, result) => {
              if (err) {
                return reject(err.message);
              } else {
                return resolve({ id, name, deskripsi, price, category });
              }
            }
          );
        }
      });
    });
  },
  remove: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`DELETE from orders WHERE id='${id}'`, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          return resolve("success delete");
        }
      });
    });
  },
};

module.exports = orderModel;

// `SELECT * from orders ${this.query(
//   queryParams,
//   queryParams.sortBy,
//   queryParams.limit
// )}`,
