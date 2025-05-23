import Joi from 'joi'
const userValidator = Joi.object({
  firstname: Joi.string().pattern(new RegExp("^[a-zA-Z]")).max(25),
  lastname: Joi.string().pattern(new RegExp("^[a-zA-Z]")).max(25),
  password: Joi.string()
    .pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)
    .min(8)
    .required(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"], allowUnicode: true },
    })
    .required(),
});

const validateUserMiddelWare = async (req, res, next) => {
  const userPayload = req.body;
  try {
    await userValidator.validateAsync(userPayload);
    next();
  } catch (error) {
    return res.status(406).send(error.details[0].message);
  }
};

export default validateUserMiddelWare;
