import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { SocialLogin } from "../social-login";
import { LoadingButton } from "../loading-btn";
import Loader from "@/components/loading";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function LoginForm({ onSubmit, loading, handleSocialLogin }: any) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <section className="mx-auto grid w-[650px] gap-6">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-zinc-100 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center mb-2">
              Sign In
            </h1>
            <span className="text-center text-[#8a8988] m-2 ">
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Please sign in with your
              account
            </span>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 md:space-y-6"
              autoComplete="on"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  id="email"
                  placeholder="name@company.com"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  aria-invalid={errors.email ? "true" : "false"}
                  autoComplete="on"
                />
                {errors.email && (
                  <p className="error-message">
                    {String(errors.email?.message ?? "Unknown error")}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
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
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    aria-invalid={errors.password ? "true" : "false"}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && (
                  <p className="error-message">
                    {String(errors.password?.message ?? "Unknown error")}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <Link
                  href="/auth/forgotPassword"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </Link>
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
                  Sign in
                </button>
              )}
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                New user?
                <Link
                  href="/auth/signup"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  {" "}
                  Register
                </Link>
              </p>
            </form>
            {/* social logins */}
            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-400" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground z-100">
                  Or continue with
                </span>
              </div>
            </div>
            <SocialLogin
              loading={loading}
              type="google"
              handleSocialLogin={handleSocialLogin}
            /> */}
            {/* <SocialLogin type="facebook" /> */}
          </div>
        </div>
      </div>
      {loading && <Loader />}
    </section>
  );
}
