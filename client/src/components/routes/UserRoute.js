import React from "react";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";


const UserRoute = (Component) => {
  const { user } = useSelector((state) => ({ ...state }));
  return user && user.token ? (
    <Component />
  ) : (
    <LoadingToRedirect />
  );
};

export default UserRoute;
