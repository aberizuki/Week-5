const productModel = require("../model/product.model");
const { unlink } = require("node:fs");

const productController = {
  get: (req, res) => {
    return productModel
      .get(req.query)
      .then((result) => {
        return res
          .status(200)
          .send({ message: "success", data: result, status: 200 });
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },
  getDetail: (req, res) => {
    return productModel
      .getDetail(req.params.id)
      .then((result) => {
        if (result != null) {
          return res.status(200).send({ message: "success", data: result });
        } else {
          return res.status(400).send({ message: "ID not found" });
        }
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },

  add: (req, res) => {
    console.log(req.files);
    if (
      req.body.title != null &&
      req.body.price != null &&
      req.body.category != null
      // req.body.title
    ) {
      const request = {
        ...req.body,
        file: req.files, //uncomment if multiple
        // img: req.file.filename, //uncomment if single
        //depend on product.route, formUpload.single or formUpload.array
      };
      // console.log(req.files) //multiple
      // console.log(req.file) //(single)
      // console.log(req.body);

      return productModel
        .add(request)
        .then((result) => {
          return res.status(201).send({ message: "succes", data: result });
        })
        .catch((error) => {
          return res.status(500).send({ message: error });
        });
    } else {
      return res.status(400).send({ message: "Field cannot be empty!" });
    }
  },
  update: (req, res) => {
    const request = {
      ...req.body,
      id: req.params.id,
      file: req.files,
    };
    console.log(req.files);
    return productModel
      .update(request)
      .then((result) => {
        if (typeof result.oldImages != "undefined") {
          for (let index = 0; index < result.oldImages.length; index++) {
            console.log(result.oldImages[index].filename);
            unlink(
              `public/uploads/images/${result.oldImages[index].filename}`,
              (err) => {
                // if (err) throw err;
                console.log(
                  `successfully deleted ${result.oldImages[index].filename}`
                );
              }
            );
          }
        }
        return res.status(201).send({ message: "success", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },
  remove: (req, res) => {
    console.log(req.params.id);
    if (req.params.id != ":id") {
      return productModel
        .remove(req.params.id)
        .then((result) => {
          for (let index = 0; index < result.length; index++) {
            unlink(`public/uploads/images/${result[index].filename}`, (err) => {
              if (err) throw err;
              console.log(`successfully deleted ${result[index].filename}`);
            });
          }
          return res
            .status(201)
            .send({ message: "succes deleted", data: result });
        })
        .catch((error) => {
          return res.status(500).send({ message: error });
        });
    } else {
      return res.status(400).send({ message: "ID cannot be empty" });
    }
  },
};

module.exports = productController;

//next explore (dibikin di helper, dipisah filenya)
// const formResponse = (message, result, status)=> {
//     return res.status(status).send({
//         data: result,
//         message: result.message,
//         status: 200
//     })
// }
