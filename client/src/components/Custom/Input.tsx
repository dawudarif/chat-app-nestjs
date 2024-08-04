import clsx from "clsx";
import React, { useState } from "react";
import { Eye, EyeOff, Search } from "lucide-react";

interface InputProps {
  value: string | number;
  type: "text" | "number" | "password" | "email";
  inputType?: "text" | "number" | "password" | "email" | "search";
  placeholder?: string;
  otherClasses?: string;
  iconSize?: string;
  name: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  otherClasses,
  type = "",
  inputType = "search",
  value,
  handleChange,
  iconSize = "1.5rem",
  placeholder = "Enter Text",
  name,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const color = "#272727";

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const classes = clsx(
    "rounded-lg p-3 text-base font-semibold focus:outline-none border-2 border-gray-500 text-gray-700 w-fit",
    otherClasses
  );

  switch (inputType) {
    case "password":
      return (
        <div
          className={clsx(
            "flex justify-center items-center gap-4 border-2 border-gray-500",
            classes
          )}
        >
          <input
            type={showPassword ? "text" : "password"}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="focus:outline-none w-[95%]"
          />
          <span className="w-[5%]">
            {showPassword ? (
              <EyeOff
                size={iconSize}
                color={color}
                onClick={handleShowPassword}
              />
            ) : (
              <Eye size={iconSize} color={color} onClick={handleShowPassword} />
            )}
          </span>
        </div>
      );
    case "search":
      return (
        <div
          className={clsx(
            "flex justify-center items-center gap-4 border-2 border-gray-500",
            classes
          )}
        >
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="focus:outline-none w-[95%]"
          />
          <span className="w-[5%]">
            <Search
              size={iconSize}
              color={color}
              onClick={handleShowPassword}
            />
          </span>
        </div>
      );
    default:
      return (
        <input
          type={type}
          value={value}
          name={name}
          placeholder={placeholder}
          onChange={handleChange}
          className={classes}
        />
      );
  }
};
export default Input;
