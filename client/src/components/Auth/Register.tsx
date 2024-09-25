import React, { useState } from "react";
import Input from "../Custom/Input";
import Button from "../Custom/Button";
import api from "../../utils/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Register = () => {
  const router = useRouter();
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/signup", data);

      if (response.status === 201) {
        router.push("/");
      } else if (response.status === 401 || response.status === 400) {
        throw new Error();
      }
    } catch (error: any) {
      if (error.isAxiosError) {
        console.log(error);

        // setError("Invalid Credentaials");
      } else {
        setError("Invalid Credentaials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full md:px-10 px-2 bg-stone-50">
      <div className="flex justify-center items-center flex-col md:max-w-[50%] w-full rounded-xl shadow-lg my-16 md:px-10 px-5 py-10 bg-white">
        <h1 className="text-h1 text-gray-900 font-semibold">Register</h1>
        <form onSubmit={handleRegister} className="w-full">
          <label htmlFor="name">
            <h4 className="text-h4 text-gray-600 mb-3">Name</h4>
            <Input
              name="name"
              handleChange={handleInputChange}
              value={data.name}
              placeholder="Enter Name"
              type="text"
              otherClasses="w-full mb-3"
            />
          </label>
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
              placeholder="Confirm Password"
              type="password"
              otherClasses="w-full mb-3"
            />
          </label>
          <Button
            loading={loading}
            otherClasses="w-full mb-4"
            variant="blue-filled"
            type="submit"
          >
            Register
          </Button>
          <Link href="/auth/login" className="text-gray-600 cursor-pointer">
            Already a user? Login here
          </Link>
        </form>
      </div>
    </div>
  );
};
export default Register;
