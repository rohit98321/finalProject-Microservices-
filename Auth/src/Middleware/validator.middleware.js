const { body, validationResult } = require("express-validator");

const responseWithValidationsErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

const registerUserValidations = [
  body("username")
    .isString()
    .withMessage("user must be a String")
    .isLength({ min: 3 })
    .withMessage("must contain atleast 3 character"),

  body("email").isEmail().withMessage("invalid email id"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password should be 6 charater atleast"),
  body("fullName.firstName")
    .isString()
    .withMessage("firstname must be a String")
    .notEmpty()
    .withMessage("firstname required"),
  body("fullName.lastName")
    .isString()
    .withMessage("lastname must be a String")
    .notEmpty()
    .withMessage("lastname required"),

  responseWithValidationsErrors,
];

const loginUserValidations = [
  body("username")
    .isString()
    .withMessage("must be string")
    .notEmpty()
    .withMessage("username is required"),
  body("email").isEmail().withMessage("invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password must contain atleat 6 character"),

  responseWithValidationsErrors,
];

const addUserAddressValidator = [
  body('street')
      .isString()
      .withMessage("street must be string")
      .notEmpty()
      .withMessage("street is required"),
  body('city')
      .isString()
      .withMessage("city must be string")
      .notEmpty()
      .withMessage("city is required"),
  body('state')
      .isString()
      .withMessage("state must be string")
      .notEmpty()
      .withMessage("state is required"),
  body('country')
      .isString()
      .withMessage("country must be string")
      .notEmpty()
      .withMessage("country is required"),
  body('pincode')
      .isString()
      .withMessage("pincode must be string")
      .notEmpty()
      .withMessage("pincode is required")
      .matches(/^\d{5,10}$/).withMessage("pincode must be a valid numeric code"),
  body('isDefault')
      .optional()
      .isBoolean()
      .withMessage("isDefault must be boolean"),
      responseWithValidationsErrors
]

module.exports = {
  registerUserValidations,
  loginUserValidations,
  addUserAddressValidator
};
