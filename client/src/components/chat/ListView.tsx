import React, { useState } from "react";
import Input from "../Custom/Input";

export default function ListView() {
  const [search, setSearch] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <Input
        handleChange={handleInputChange}
        value={search}
        inputType="search"
        name="input"
        placeholder="Search"
        otherClasses="w-1/3"
        type="text"
      />
      {Array(8)
        .fill(null)
        .map((item, index) => {
          return (
            <div key={index} className="w-1/3 border-b border-brand-dark-gray">
              <h1 className="hover:bg-brand-filled-blue hover:text-white text-brand-black hover:rounded-lg transition-all duration-100 p-2 my-1">
                Item {index + 1}
              </h1>
            </div>
          );
        })}
    </div>
  );
}
