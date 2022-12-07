const express = require("express");
const { body, validationResult } = require("express-validator");

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
    } else {
      res.status(400).json({
        error: 1,
        errors: errors.array(),
      });
    }
  };
};

const {
  addProduct,
  getProduct,
  getProductbyId,
  deleteProduct,
  updateProduct,
  regis,
  login,
  access,
} = require("../controllers/products");
const jwtvalidate = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/product/add",
  validate([
    body("name")
      .isLength({
        min: 4,
      })
      .withMessage("The length should be 4 or greater than 4"),
    body("city").contains().withMessage("city is required"),
  ]),
  addProduct
);
router.get("/product/get", getProduct);
router.get("/product/getproductbyid/:id", getProductbyId);
router.delete("/product/delete/:id", deleteProduct);
router.put("/product/update/:id", updateProduct);
router.post("/signup", regis);
router.post("/signin", login);
router.get("/accesstoken", access);

module.exports = router;
