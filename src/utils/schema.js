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
  productName: yup.string().required("Product Name is required"),
  locationAddress: yup.string().required("Location Address is resquired"),
  locationMapLink: yup.string().required("Location Map Link is resquired"),
  startTime: yup.string().required("Start Time is resquired"),
  endTime: yup.string().required("End Time is resquired"),
  startDate: yup.string().required("Start Date is resquired"),
  endDate: yup.string().required("End Date is resquired"),
  activities: yup.string().required("Activities is resquired"),
  seats: yup.string().required("Seats is resquired"),
  minAge: yup.string().required("Min Age is resquired"),
  maxAge: yup.string().required("Max Age is resquired"),
  ageException: yup.string(),
  description: yup.string(),
  price: yup.string().required("Price is required"),
  paymentType: yup.string().required("Payment Type is required"),
  paymentInterval: yup.string().required("Payment Interval is required"),
  intervalCount: yup.string().required("Interval Count is required"),
});
