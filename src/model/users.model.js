const db = require("../../helper/connection");
const { v4: uuidv4 } = require("uuid");
const usersModel = {
  query: (queryParams, sortType = "asc") => {
    if (queryParams.search && queryParams.gen) {
      return `WHERE username ILIKE '%${queryParams.search}%' AND gender ILIKE '${queryParams.gen}%' ORDER BY username ${sortType}`;
    } else if (queryParams.search || queryParams.gen) {
      return `WHERE username ILIKE '%${queryParams.search}%' OR gender ILIKE '${queryParams.gen}%' ORDER BY username ${sortType}`;
    } else {
      return `ORDER BY username ${sortType}`;
    }
  },
  get: function (queryParams) {
    console.log(queryParams);
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * from users ${this.query(
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
      db.query(`SELECT * from users WHERE id='${id}'`, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          return resolve(result.rows[0]);
        }
      });
    });
  },
  add: ({ email, username, password, gender }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO users (id, email, username, password, gender) VALUES ('${uuidv4()}','${email}','${username}','${password}','${gender}')`,
        (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            return resolve({ email, username, password, gender });
          }
        }
      );
    });
  },
  update: ({ id, email, username, password, gender }) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE id='${id}'`, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          // const dataUpdate = [result.rows[0].email, result.rows[0].username, result.rows[0].password, result.rows[0].gender]
          db.query(
            `UPDATE users SET email='${
              email || result.rows[0].email
            }', username='${username || result.rows[0].username}',password='${
              password || result.rows[0].password
            }', gender='${gender || result.rows[0].gender}' WHERE id='${id}'`,
            (err, result) => {
              if (err) {
                return reject(err.message);
              } else {
                return resolve({ id, email, username, password, gender });
              }
            }
          );
        }
      });
    });
  },
  remove: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`DELETE from users WHERE id='${id}'`, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          return resolve("success delete");
        }
      });
    });
  },
};

module.exports = usersModel;
