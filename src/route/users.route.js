const express = require("express");
const router = express();

//import controller
const userController = require("../controller/users.controller");

router.get("/", userController.get);
router.get("/:id", userController.getDetail);
router.post("/", userController.add);
// router.put('/', userController.update)
router.patch("/:id", userController.update);
router.delete("/:id", userController.remove);

// delete //remove

module.exports = router;
