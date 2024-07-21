import React, { useState } from "react";
import Input from "../Custom/Input";
import Button from "../Custom/Button";
import { Link } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex justify-center items-center flex-col max-w-[50%] w-full rounded-xl shadow-lg my-16 lg:px-10 px-5 py-10">
        <h1 className="text-h1 text-gray-900 font-semibold">Login</h1>
        <form onSubmit={handleLogin} className="w-full">
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
          <Button
            loading={false}
            otherClasses="w-full mb-4"
            variant="blue-filled"
            type="submit"
          >
            Login
          </Button>
          <Link
            to="/auth?page=register"
            className="text-gray-600 cursor-pointer"
          >
            New here? Click to Register
          </Link>
        </form>
      </div>
    </div>
  );
};
export default Login;
