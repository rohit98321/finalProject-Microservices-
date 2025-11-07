const { body, validationResult } = require("express-validator");

const responseWithValidationsErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
        message:"validaton failed",
       errors: errors.array() 
      });
  }

  next();
};

const registerUserValidations = [
  body("username")
    .optional()
    .isString()
    .withMessage("user must be a String")
    .isLength({ min: 3 })
    .withMessage("must contain atleast 3 character"),

  body("email").optional().isEmail().withMessage("invalid email id"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("password should be 6 charater atleast"),
  body("fullName.firstName")
    .optional()
    .isString()
    .withMessage("firstname must be a String")
    .notEmpty()
    .withMessage("firstname required"),
  body("fullName.lastName")
    .optional()
    .isString()
    .withMessage("lastname must be a String")
    .notEmpty()
    .withMessage("lastname required"),

  responseWithValidationsErrors,
];

const loginUserValidations = [
  body("username")
    .optional()
    .isString()
    .withMessage("must be string")
    .notEmpty()
    .withMessage("username is required"),
  body("email").optional().isEmail().withMessage("invalid email address"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("password must contain atleat 6 character"),

  responseWithValidationsErrors,
];

const addUserAddressValidator = [
  body("street")
    .trim()
    .notEmpty()
    .withMessage("Street is required")
    .isString()
    .withMessage("Street must be a string"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string"),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required")
    .isString()
    .withMessage("State must be a string"),

  body("country")
    .trim()
    .notEmpty()
    .withMessage("Country is required")
    .isString()
    .withMessage("Country must be a string"),

  body("pincode")
    .exists()
    .withMessage("Pincode is required")
    .bail()
    .custom((value) => {
      const val = String(value);
      if (!/^[0-9]{5,6}$/.test(val)) {
        throw new Error("Pincode must be 5–6 digits");
      }
      return true;
    }),

  // ✅ Optional phone, but must be exactly 10 digits if provided
  body("phone")
    .optional()
    .custom((value) => {
      const val = String(value);
      if (!/^[0-9]{10}$/.test(val)) {
        throw new Error("Phone must be exactly 10 digits");
      }
      return true;
    }),

  responseWithValidationsErrors,
];

module.exports = {
  registerUserValidations,
  loginUserValidations,
  addUserAddressValidator,
};
