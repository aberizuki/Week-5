const express = require("express");
const router = express();

//import controller
const orderController = require("../controller/order.controller");
//end import

router.get("/", orderController.get);
router.get("/:id", orderController.getDetail);
router.post("/", orderController.add);
router.patch("/:id", orderController.update);
router.delete("/:id", orderController.remove);

module.exports = router;
