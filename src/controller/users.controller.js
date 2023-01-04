const usersModel = require("../model/users.model");

const usersController = {
  get: (req, res) => {
    return usersModel
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
    return usersModel
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
    return usersModel
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
    return usersModel
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
    return usersModel
      .remove(req.params.id)
      .then((result) => {
        return res.status(200).send({ message: "success", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },
};

module.exports = usersController;

//next explore (dibikin di helper, dipisah filenya)
// const formResponse = (message, result, status)=> {
//     return res.status(status).send({
//         data: result,
//         message: result.message,
//         status: 200
//     })
// }
