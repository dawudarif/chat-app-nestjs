import React, { useState } from "react";
import Input from "../Custom/Input";
import { Link } from "react-router-dom";
import Button from "../Custom/Button";

const Register = () => {
  const [data, setData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex justify-center items-center flex-col max-w-[50%] w-full rounded-xl shadow-lg my-16 lg:px-10 px-5 py-10">
        <h1 className="text-h1 text-gray-900 font-semibold">Register</h1>
        <form onSubmit={handleRegister} className="w-full">
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
          <Button
            loading={false}
            otherClasses="w-full mb-4"
            variant="blue-filled"
            type="submit"
          >
            Register
          </Button>
          <Link to="/auth" className="text-gray-600 cursor-pointer">
            Already a user? Login here
          </Link>
        </form>
      </div>
    </div>
  );
};
export default Register;
