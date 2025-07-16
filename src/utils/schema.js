"use client";
import * as yup from "yup";

export const loginScehma = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const addProductSchema = yup.object({
  locationAddress: yup.string().required("Location Address is resquired"),
  locationMapLink: yup.string().required("Location Map Link is resquired"),
  activities: yup.string().required("Activities is resquired"),
  seats: yup.string().required("Seats is resquired"),
  minAge: yup.string().required("Min Age is resquired"),
  maxAge: yup.string().required("Max Age is resquired"),
  ageException: yup.string(),
  intervalCount: yup.string(),
});
