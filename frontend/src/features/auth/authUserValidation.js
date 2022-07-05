import * as Yup from "yup";

const currentPasswordSchema = Yup.object({
  currentPassword: Yup.string().required("Required"),
});

const newPasswordSchema = Yup.object({
  newPassword: Yup.string()
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/,
      "Please enter a strong password of at least 8 characters, containing a minimum of 1 upper case character, 1 lower case character, 1 symbol and 1 number."
    )
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Required"),
});

const userSchema = Yup.object({
  firstName: Yup.string().required("Required").min(1).max(100),
  lastName: Yup.string().required("Required").min(1).max(100),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Required"),
});

export const updatePasswordSchema = Yup.object({
  currentPassword: Yup.string().required("Required"),
}).concat(newPasswordSchema);

export const userRegistrationSchema = userSchema.concat(newPasswordSchema);

export const loginSchema = userSchema
  .pick(["email"])
  .concat(currentPasswordSchema);

export const userUpdateSchema = userSchema.concat(currentPasswordSchema);
