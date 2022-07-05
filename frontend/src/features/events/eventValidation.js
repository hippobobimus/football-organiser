import * as Yup from "yup";

export const eventInfoSchema = Yup.object({
  category: Yup.string().matches(
    /^(match|social)$/i,
    "Must be a valid category"
  ),
  name: Yup.string()
    .required("Required")
    .min(1, "Must not be empty")
    .max(20, "Maximum length 20 characters"),
  buildUpTime: Yup.date()
    .required("Required")
    .min(new Date(), "Cannot be in the past"),
  startTime: Yup.date()
    .required("Required")
    .min(Yup.ref("buildUpTime"), "Cannot precede the warm up time"),
  endTime: Yup.date()
    .required("Required")
    .min(Yup.ref("startTime"), "Cannot precede the kick off time"),
  capacity: Yup.number()
    .optional()
    .min(1, "Must be at least 1")
    .max(100, "Must be no more than 100"),
});

export const addressSchema = Yup.object({
  locationName: Yup.string().max(20, "Maximum length 20 characters"),
  locationLine1: Yup.string()
    .required("Required")
    .min(1, "Must not be empty")
    .max(30, "Maximum length 30 characters"),
  locationLine2: Yup.string().max(30, "Maximum length 30 characters"),
  locationTown: Yup.string()
    .required("Required")
    .min(1, "Must not be empty")
    .max(30, "Maximum length 30 characters"),
  locationPostcode: Yup.string()
    .required("Required")
    .matches(
      /^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/,
      "Must be a valid UK postcode format."
    ),
});

export const attendeeUserSchema = Yup.object({
  userId: Yup.string().required("Required"),
});
