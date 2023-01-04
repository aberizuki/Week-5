const productModel = require("../model/product.model");

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
          return res.status(400).send({ message: "id not found" });
        }
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },
  add: (req, res) => {
    return productModel
      .add(req.body)
      .then((result) => {
        return res.status(201).send({ message: "success", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },
  update: (req, res) => {
    const request = {
      ...req.body,
      id: req.params.id,
    };
    return productModel
      .update(request)
      .then((result) => {
        if (result != null) {
          return res.status(200).send({ message: "success", data: result });
        } else {
          return res.status(404).send({ message: "not found" });
        }
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },
  remove: (req, res) => {
    // console.log(req.params.id);
    return productModel
      .remove(req.params.id)
      .then((result) => {
        return res.status(200).send({ message: "success", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
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
