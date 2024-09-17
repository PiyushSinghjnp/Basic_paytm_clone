import { BottomWarning } from "../component/BottomWarning";
import { Button } from "../component/Button";
import { Heading } from "../component/Heading";
import { InputBox } from "../component/InputBox";
import { SubHeading } from "../component/SubHeading";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
export const  Signin = ()=>{
    const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError]=useState("");

  const navigate = useNavigate();

//   useEffect(() => {
//     const userToken = localStorage.getItem("token");

//     // Check if token exists in local storage
//     if (userToken) {
//       navigate("/dashboard"); // Redirect to dashboard page if token exists
//     }
//   }, []);
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="Email"
            label={"Email"}
          />
          <InputBox
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
            label={"Password"}
          />
          <div className="pt-4">
            <Button
              onClick={ async () => {
                try{
                // console.log("Sign in button clicked!");
                const response = await axios.post(
                    "http://localhost:3000/api/v1/user/signin",
                  {
                    username,
                    password,
                  }
                );
                localStorage.setItem("token", response.data.token);
                navigate("/dashboard");
              }
              catch(error){
                  console.log('hiii'+error.response.data);
                  if(error.response && error.response.data){
                      const { message, errors } = error.response.data;
                      // console.log(message);
                      setError(message); // Set error message
                      if (errors) {
                          console.error("Validation errors:", errors); // Log detailed validation errors in the console
                        }
                        alert(message); 
                  }else {
                      alert("An unexpected error occurred."); // Fallback for network or other errors
                    }
              }
              }
            }
              label={"Sign in"}
            />
          </div>
          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/"}
          />
        </div>
      </div>
    </div>
  );
};