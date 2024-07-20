import React, { useState } from "react";
import Input from "../Custom/Input";

interface RegisterProps {
  setPageType: () => void;
}

const Register: React.FC<RegisterProps> = ({ setPageType }) => {
  const [data, setData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex justify-center items-center flex-col max-w-[50%] w-full rounded-xl shadow-lg my-16 lg:px-10 px-5 py-10">
        <h1 className="text-h1 text-gray-900 font-semibold">Register</h1>
        <div className="w-full">
          <label htmlFor="email">
            <h4 className="text-h4 text-gray-600 mb-3">Email</h4>
            <Input
              name="email"
              handleChange={handleInputChange}
              value={data.email}
              placeholder="Enter Email"
              type="email"
              otherClasses="w-full mb-3"
            />
          </label>
          <label htmlFor="username">
            <h4 className="text-h4 text-gray-600 mb-3">Username</h4>
            <Input
              name="username"
              handleChange={handleInputChange}
              value={data.username}
              placeholder="Enter Username"
              type="text"
              otherClasses="w-full mb-3"
            />
          </label>
          <label htmlFor="password">
            <h4 className="text-h4 text-gray-600 mb-3">Password</h4>
            <Input
              name="password"
              handleChange={handleInputChange}
              value={data.password}
              placeholder="Enter Password"
              type="password"
              otherClasses="w-full mb-3"
            />
          </label>
          <label htmlFor="confirmPassword">
            <h4 className="text-h4 text-gray-600 mb-3">Confirm Password</h4>
            <Input
              name="confirmPassword"
              handleChange={handleInputChange}
              value={data.confirmPassword}
              placeholder="Enter ConfirmPassword"
              type="password"
              otherClasses="w-full mb-3"
            />
          </label>
          <button
            className="w-full rounded-xl bg-blue-500 text-white font-semibold py-3 hover:bg-blue-600 mt-4"
            type="submit"
          >
            Register
          </button>
          <p
            onClick={setPageType}
            className="mt-4 text-gray-600 cursor-pointer"
          >
            Already a user? Login here
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;
