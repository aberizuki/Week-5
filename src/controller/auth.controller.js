const authModel = require("../model/auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_PRIVATE_KEY } = process.env;

const authController = {
  login: (req, res) => {
    if (req.body.username != null && req.body.password != null) {
      return authModel
        .login(req.body)
        .then((result) => {
          jwt.sign(
            { id: result.id, role: result.role },
            JWT_PRIVATE_KEY,
            (err, token) => {
              return res.status(200).send({
                message: "success",
                data: {
                  token,
                  user: result,
                },
              });
            }
          );
        })
        .catch((error) => {
          return res.status(500).send({ message: error });
        });
    } else {
      return res.status(400).send({ message: "Field cannot be empty!" });
    }
  },
  register: (req, res) => {
    if (req.body.username != null && req.body.password != null) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        } else {
          const request = {
            username: req.body.username,
            password: hash,
          };
          return authModel
            .register(request)
            .then((result) => {
              return res.status(201).send({ message: "succes", data: result });
            })
            .catch((error) => {
              return res.status(500).send({ message: error });
            });
        }
      });
    } else {
      return res.status(400).send({ message: "Field cannot be empty!" });
    }
  },
};

module.exports = authController;
