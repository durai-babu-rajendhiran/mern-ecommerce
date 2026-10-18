import React from "react";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";

const UserRoute = ({ Component, children, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }));

  if (!user || !user.token) {
    return <LoadingToRedirect />;
  }

  if (Component) return <Component {...rest} />;
  return children || null;
};

export default UserRoute;
