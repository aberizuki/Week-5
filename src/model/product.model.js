const db = require("../../helper/connection");
const { v4: uuidv4 } = require("uuid");
const productModel = {
  query: (queryParams, sortType = "asc") => {
    if (queryParams.search && queryParams.cat) {
      return `WHERE title ILIKE '%${queryParams.search}%' AND category ILIKE '%${queryParams.cat}%' ORDER BY title ${sortType}`;
    } else if (queryParams.search || queryParams.cat) {
      return `WHERE title ILIKE '%${queryParams.search}%' OR category ILIKE '%${queryParams.cat}%' ORDER BY title ${sortType}`;
    } else {
      return `ORDER BY title ${sortType}`;
    }
  },
  get: function (queryParams) {
    console.log(queryParams);
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * from product ${this.query(
          queryParams,
          queryParams.sortBy,
          queryParams.limit
        )} LIMIT ${queryParams.limit} OFFSET (${queryParams.page - 1}) * ${
          queryParams.limit
        }`,
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
      db.query(`SELECT * from product WHERE id='${id}'`, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          return resolve(result.rows[0]);
        }
      });
    });
  },
  add: ({ title, img, price, category }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO product (id, title, img, price, category) VALUES ('${uuidv4()}','${title}','${img}','${price}','${category}')`,
        (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            return resolve({ title, img, price, category });
          }
        }
      );
    });
  },
  update: ({ id, title, img, price, category }) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM product WHERE id='${id}'`, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          // const dataUpdate = [result.rows[0].title, result.rows[0].img, result.rows[0].price, result.rows[0].category]
          db.query(
            `UPDATE product SET title='${
              title || result.rows[0].title
            }', img='${img || result.rows[0].img}',price='${
              price || result.rows[0].price
            }', category='${
              category || result.rows[0].category
            }' WHERE id='${id}'`,
            (err, result) => {
              if (err) {
                return reject(err.message);
              } else {
                return resolve({ id, title, img, price, category });
              }
            }
          );
        }
      });
    });
  },
  remove: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`DELETE from product WHERE id='${id}'`, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          return resolve("success delete");
        }
      });
    });
  },
};

module.exports = productModel;
