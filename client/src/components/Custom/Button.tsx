import clsx from "clsx";
import React from "react";
import Ring from "../Loaders/Ring";

interface ButtonProps {
  otherClasses?: string;
  variant?:
    | "blue-filled"
    | "blue-outline"
    | "black-filled"
    | "black-outline"
    | "green-filled"
    | "green-outline"
    | "yellow-filled"
    | "yellow-outline"
    | "red-filled"
    | "red-outline"
    | "orange-filled"
    | "orange-outline";
  type?: "reset" | "button" | "submit";
  loading?: boolean;
  loaderSize?: number;
  loaderColor?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  otherClasses,
  variant = "blue-filled",
  type = "button",
  loading = false,
  children,
  loaderColor = "white",
  loaderSize = 20,
}) => {
  const btnClasses = clsx(
    variant === "blue-filled" && "bg-blue-600 hover:bg-blue-500 text-white",
    variant === "blue-outline" &&
      "bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-transparent",
    variant === "black-filled" &&
      "bg-brand-black hover:bg-brand-black/90 text-white",
    variant === "black-outline" &&
      "bg-white border-2 border-brand-black text-brand-black hover:bg-brand-black hover:text-white hover:border-transparent",
    variant === "green-filled" &&
      "bg-brand-green hover:bg-brand-green/90 text-white",
    variant === "green-outline" &&
      "bg-white border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white hover:border-transparent",
    variant === "yellow-filled" &&
      "bg-brand-yellow hover:bg-brand-yellow/90 text-white",
    variant === "yellow-outline" &&
      "bg-white border-2 border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-white hover:border-transparent",
    variant === "orange-filled" &&
      "bg-brand-orange hover:bg-brand-orange/90 text-white",
    variant === "orange-outline" &&
      "bg-white border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white hover:border-transparent",
    variant === "red-filled" && "bg-brand-red hover:bg-brand-red/90 text-white",
    variant === "red-outline" &&
      "bg-white border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white hover:border-transparent",
    "rounded-xl w-fit p-4 transition-all duration-500 text-lg leading-[100%] font-semibold flex justify-center items-center",
    otherClasses
  );

  return (
    <button className={btnClasses} type={type}>
      {loading ? (
        <Ring size={loaderSize} color={loaderColor} />
      ) : (
        <> {children}</>
      )}
    </button>
  );
};
export default Button;
