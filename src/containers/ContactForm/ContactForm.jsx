"use client"
import UITextField from "@/components/InputFields/UITextField";
// import { contactFormSchema } from "@/utils/schema";
import React from "react";


const ContactForm = () => {
  

  const handleContactForm = (data) => {
    console.log('data', data)
  };
  return (
    <form onSubmit={handleSubmit(handleContactForm)}>
      <UITextField  errorMessage={errors.email} />
    </form>
  );
};

export default ContactForm;
