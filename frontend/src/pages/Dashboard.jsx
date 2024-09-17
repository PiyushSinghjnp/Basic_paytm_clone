import { useEffect, useState } from "react";
import { Appbar } from "../component/AppBar";
import { Balance } from "../component/Balance";
import { Users } from "../component/Users";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const [bal, setBal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalance = async () => {
      const userToken = localStorage.getItem("token");

      if (!userToken) {
        // Redirect if token is missing
        navigate("/signin");
      } else {
        try {
          const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
            headers: {
              Authorization: "Bearer " + userToken,
            },
          });
          
          // Check if balance exists in the response and update state
          if (response.data && response.data.balance) {
            setBal(response.data.balance);
          } else {
            navigate("/signin"); // If response is unexpected, navigate to sign-in
          }
        } catch (error) {
          console.error("Error fetching balance:", error);
          navigate("/signin"); // Redirect on error
        }
      }
    };

    // Fetch balance once on component mount
    fetchBalance();
  }, [navigate]);

  return (
    <div>
      <Appbar />
      <div className="m-8">
        <Balance value={bal} />
        <Users />
      </div>
    </div>
  );
};