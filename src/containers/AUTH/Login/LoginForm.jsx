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
import { apiPost } from "@/apis/ApiRequest";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import UIButton from "@/components/UIButton/UIButton";
import { toast } from "sonner";
import { setToken } from "@/apis/Auth";
import { useDispatch, useSelector } from "react-redux";
import { signin } from "@/store/actions/AUTH";
import { useRouter } from "next/navigation";
import { pathLocations } from "@/utils/navigation";

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    resolver: yupResolver(loginScehma),
    defaultValues: {
      email: "",
      password: "", // Add this if your schema requires it
    },
  });
  const signinData = useSelector((state) => state?.SignInReducer);
  console.log("signinData", signinData);

  function onSubmit(data, e) {
    e.preventDefault(); // Prevent default form submission
    // Fixed typo in function name
    console.log("data", data);
    const dataObj = {
      email: data.email,
      password: data.password,
    };
    apiPost(
      `${ApiEndpoints.auth.base}${ApiEndpoints.auth.login}`,
      dataObj,
      (res) => {
        console.log("res", res);
        if (!res.success) {
          toast.error(res.message);
        }
        if (res.success) {
          toast.success(res.message);
          setToken(res.data.token);
          dispatch(signin(res.data));
          router.push(pathLocations.dashboard);
        }
      },
      (err) => {
        console.log("err", err);
        toast.error(err.message);
      }
    );
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
        <UIButton
          type="contained"
          icon={false}
          title="Submit"
          btnType="submit"
        />
      </form>
    </Form>
  );
};

export default LoginForm;
