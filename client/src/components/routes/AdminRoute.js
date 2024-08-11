import React, { useEffect, useState } from "react";
import { Route, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";
import {CURRENT_ADMIN} from "../../functions/ApiRoute";
import FetchData from "../../functions/FetchApi"
const AdminRoute = (Component) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.token) {
        try {
          const res = await FetchData(CURRENT_ADMIN, "POST", null, user.token, false);
          if (res) {
            console.log("CURRENT ADMIN RES", res);
            setOk(true);
          } else {
            console.log("No response data");
            setOk(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setOk(false);
        }
      }
    };
  
    fetchUserData();
  }, [user]);

  return ok ? <Component /> : <LoadingToRedirect />;
};

export default AdminRoute;
