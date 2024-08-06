import { useForm } from "react-hook-form";
import Link from "next/link";

import { LoadingButton } from "../loading-btn";
import Loader from "@/components/loading";
import { useState } from "react";
import { EyeIcon, EyeOff } from "lucide-react";

export function ResetPasswordForm({ onSubmit, loading }: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const watchPassword = watch("password", "");
  const watchConformPassword = watch("conformPassword", "");

  const [showPassword, setShowPassword] = useState(false);
  const [showConformPassword, setShowConformPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConformPasswordVisibility = () => {
    setShowConformPassword(!showConformPassword);
  };

  const passwordMatch = (value: any) => {
    return value === watchPassword || "Passwords do not match";
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-zinc-100 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center mb-2">
              Reset Password
            </h1>

            <form
              className="space-y-4 md:space-y-6"
              action="#"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    id="password"
                    autoComplete="true"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeIcon /> : <EyeOff />}
                  </button>
                </div>
                {errors.password && (
                  <p className="error-message">
                    {String(errors.password.message)}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="conformPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Conform password
                </label>
                <div className="relative">
                  <input
                    type={showConformPassword ? "text" : "password"}
                    {...register("conformPassword", {
                      required: "Conform password is required",
                      minLength: {
                        value: 6,
                        message:
                          "Conform password must be at least 6 characters",
                      },
                      validate: passwordMatch,
                    })}
                    id="conformPassword"
                    autoComplete="true"
                    placeholder="••••••••"
                    className=" bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={toggleConformPasswordVisibility}
                  >
                    {showConformPassword ? <EyeIcon /> : <EyeOff />}
                  </button>
                </div>

                {errors.conformPassword && (
                  <p className="error-message">
                    {String(errors.conformPassword.message)}
                  </p>
                )}
              </div>
              {loading ? (
                <LoadingButton
                  type="outline"
                  className="w-full dark:hover:bg-slate-500 dark:bg-slate-700 bg-slate-200 hover:bg-slate-300"
                />
              ) : (
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Submit
                </button>
              )}

              <div className="text-sm font-light text-gray-500 dark:text-gray-400 flex justify-center gap-1">
                Go back to{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      {loading && <Loader />}
    </section>
  );
}
