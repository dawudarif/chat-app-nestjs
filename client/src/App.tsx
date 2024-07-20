import { useState } from "react";
import Input from "./components/Input";
import "./index.css";

function App() {
  const [inputvalue, setInputValue] = useState("second");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  return (
    <div className=" h-[100vh] w-full">
      <Input
        type="password"
        value={inputvalue}
        handleChange={handleInputChange}
        iconSize="1rem"
        otherClasses="font-semibold"
      />
      <Input
        type="text"
        value={inputvalue}
        handleChange={handleInputChange}
        otherClasses=""
      />
      <Input
        type="text"
        value={inputvalue}
        handleChange={handleInputChange}
        otherClasses=""
      />
      hhj
    </div>
  );
}

export default App;
