"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginScehma } from "@/utils/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import UITextField from "@/components/InputFields/UITextField";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    resolver: yupResolver(loginScehma),
    defaultValues: {
      email: "",
      password: "", // Add this if your schema requires it
    },
  });

  function onSubmit(data) {
    // Fixed typo in function name
    console.log("data", data);
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email" // Changed from username to email to match defaultValues
          render={({ field }) => (
            <FormItem>
              <UITextField field={field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <UITextField type="password" field={field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default LoginForm;
