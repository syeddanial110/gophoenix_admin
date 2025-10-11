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
  slug: yup.string().required("URL is resquired"),
  locationAddress: yup.string().required("Location Address is resquired"),
  locationMapLink: yup.string().required("Location Map Link is resquired"),
  seats: yup.string().required("Seats is resquired"),
  minAge: yup.string().required("Min Age is resquired"),
  maxAge: yup.string().required("Max Age is resquired"),
  intervalCount: yup.string(),
});

export const blogsSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
});

export const homepageContentSchema = yup.object({
  mainHeading: yup.string(),
  mainDescription: yup.string(),
  statsCard1Heading: yup.string(),
  statsCard1SubHeading: yup.string(),
  statsCard1Description: yup.string(),
  statsCard2Heading: yup.string(),
  statsCard2SubHeading: yup.string(),
  statsCard2Description: yup.string(),
  statsCard3Heading: yup.string(),
  statsCard3SubHeading: yup.string(),
  statsCard3Description: yup.string(),
});
