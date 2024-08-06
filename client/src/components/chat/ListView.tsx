import React, { useState } from "react";
import Input from "../Custom/Input";

export default function ListView() {
  const [search, setSearch] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex flex-col justify-start items-center w-1/4 p-2 border-r border-brand-black h-[100vh]">
      <Input
        handleChange={handleInputChange}
        value={search}
        inputType="search"
        name="input"
        placeholder="Search"
        otherClasses="w-full border-l-0 border-t-0 border-r-0 rounded-none"
        type="text"
      />
      {Array(8)
        .fill(null)
        .map((item, index) => {
          return (
            <div key={index} className="w-full border-b border-brand-dark-gray">
              <h1 className="hover:bg-brand-filled-blue hover:text-white text-brand-black hover:rounded-lg transition-all duration-100 p-2 my-1">
                Item {index + 1}
              </h1>
            </div>
          );
        })}
    </div>
  );
}
