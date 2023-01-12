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
    const { page = 1, limit = 5 } = queryParams;
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT 
        product.id, product.title, product.price, product.category,  
        json_agg(row_to_json(product_images)) images
      FROM product 
      INNER JOIN product_images ON product.id=product_images.id_product
      GROUP BY product.id ${this.query(
        queryParams,
        queryParams.sortBy,
        queryParams.limit
      )}
      LIMIT ${limit} OFFSET (${page}-1)*${limit}`,
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
  add: ({ title, price, category, file }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO product (id, title, price, category) VALUES ('${uuidv4()}','${title}','${price}','${category}') RETURNING id`,
        (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            // console.log(uuidImage, uuidProduct)
            //ini berlaku ketika upload multiple (array)
            for (let index = 0; index < file.length; index++) {
              db.query(
                `INSERT INTO product_images (id_image, id_product, name, filename) VALUES($1, $2 ,$3 , $4)`,
                [uuidv4(), result.rows[0].id, title, file[index].filename]
              );
            }
            return resolve({ title, price, category, images: file });
          }
        }
      );
    });
  },
  update: ({ id, title, img, price, category, file }) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM product WHERE id='${id}'`, (err, result) => {
        console.log(result.rows.length);
        if (err) {
          return reject(err.message);
        } else {
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
                if (file.length <= 0)
                  return resolve({ id, title, price, category });

                db.query(
                  `SELECT id_image, filename FROM product_images WHERE id_product='${id}'`,
                  (errProductImages, productImages) => {
                    if (errProductImages) {
                      return reject({ message: errProductImages.message });
                    } else if (productImages.rows.length < file.length) {
                      return reject("Feature not available yet");
                    } else {
                      for (
                        let indexNew = 0;
                        indexNew < file.length;
                        indexNew++
                      ) {
                        db.query(
                          `UPDATE product_images SET filename=$1 WHERE id_image=$2`,
                          [
                            file[indexNew].filename,
                            productImages.rows[indexNew].id_image,
                          ],
                          (err, result) => {
                            if (err)
                              return reject({ message: "image gagal dihapus" });
                            return resolve({
                              id,
                              title,
                              price,
                              category,
                              oldImages: productImages.rows,
                              images: file,
                            });
                          }
                        );
                      }
                    }
                  }
                );
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
          db.query(
            `DELETE FROM product_images WHERE id_product='${id}' RETURNING filename`,
            (err, result) => {
              if (err) return reject({ message: "gambar gagal dihapus" });
              return resolve(result.rows);
            }
          );
        }
      });
    });
  },
};

module.exports = productModel;
