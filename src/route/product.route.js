const express = require("express");
const formUpload = require("../../helper/formUpload");
const verifyToken = require("../../helper/verivyToken");
const router = express();

//import controller
const productController = require("../controller/product.controller");

router.get("/", productController.get);
router.get("/:id", productController.getDetail);
router.post("/", verifyToken, formUpload.array("img"), productController.add);
// router.put('/', productController.update)
router.patch(
  "/:id",
  verifyToken,
  formUpload.array("img"),
  productController.update
);
router.delete("/:id", verifyToken, productController.remove);

// delete //remove

module.exports = router;
