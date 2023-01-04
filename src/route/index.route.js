const express = require("express"); //import
const router = express();

//import route
const productRoute = require("./product.route");
const usersRoute = require("./users.route");
//end import route

router.get("/", (req, res) => {
  return res.send("backend for coffe shop");
});

router.use("/product", productRoute);
router.use("/users", usersRoute);
// router.use('/userss', usersRoute)

module.exports = router; //export, biar bisa diakses oleh file lain melalui require
