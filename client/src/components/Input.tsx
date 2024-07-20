import clsx from "clsx";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps {
  value: string | number;
  type: "text" | "number" | "password";
  placeholder?: string;
  otherClasses?: string;
  iconSize?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  otherClasses,
  type = "",
  value,
  handleChange,
  iconSize = 30,
  placeholder = "Enter Text",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const color = "#222";

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const classes = clsx(
    "rounded-lg p-2 text-base focus:outline-none border-2 border-gray-500 placeholder:text-gray-600 text-gray-700 w-fit",
    otherClasses
  );

  if (type === "password") {
    return (
      <div
        className={clsx(
          "flex justify-center items-center gap-4 border-2 border-gray-500",
          classes
        )}
      >
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="focus:outline-none"
        />
        {showPassword ? (
          <EyeOff size={iconSize} color={color} onClick={handleShowPassword} />
        ) : (
          <Eye size={iconSize} color={color} onClick={handleShowPassword} />
        )}
      </div>
    );
  } else {
    return (
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className={classes}
      />
    );
  }
};
export default Input;
