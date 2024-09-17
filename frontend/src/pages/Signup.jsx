import { BottomWarning } from "../component/BottomWarning";
import { Button } from "../component/Button";
import { Heading } from "../component/Heading";
import { InputBox } from "../component/InputBox";
import { SubHeading } from "../component/SubHeading";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const  Signup =  ()=>{
    const[firstName,setFirstName]=useState("");
    const[lastName,setLastName]=useState("");
    const[username,setUsername]=useState("");
    const[password,setPassword]=useState("");
    const [error,setError]=useState("");
    const navigate = useNavigate();
    return (
    <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Sign up"} />
                <SubHeading label={"Enter your infromation to create an account"} />
                <InputBox onChange={(e)=>{setFirstName(e.target.value)}} placeholder="FirstName"label={"First Name"}/>
                <InputBox onChange={(e)=>{setLastName(e.target.value)}}placeholder="LastName"label={"Last Name"}/>
                <InputBox onChange={(e)=>{setUsername(e.target.value)}} placeholder="Email"label={"Email"}/>
                <InputBox onChange={(e)=>{setPassword(e.target.value)}} placeholder="Password"label={"Password"}/>
                <div className="pt-4">
                    <Button  onClick={async()=>{
                        // console.log()
                        try{
                        const response = await axios.post("http://localhost:3000/api/v1/user/signup",{
                            username,
                            lastName,
                            firstName,
                            password
                        });
                        console.log('response is'+response);
                         localStorage.setItem("token",response.data.token); 
                         alert("Signup successful!");
                         navigate('/dashboard');
                    }
                        catch(error){
                            console.log('hiii'+error.response.data);
                            if(error.response && error.response.data){
                                const { message, errors } = error.response.data;
                                setError(message); // Set error message
                                if (errors) {
                                    console.error("Validation errors:", errors); // Log detailed validation errors in the console
                                  }
                                  alert(message); 
                            }else {
                                alert("An unexpected error occurred."); // Fallback for network or other errors
                              }
                        }
                    }}label={"Sign up"}/>
                </div>
                <BottomWarning label={"Already have an account?"}buttonText={"Sign in"}to={"/signin"}/>
            </div>
        </div>
    </div>
)}
