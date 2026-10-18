import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";
import { getCurrentAdmin } from "../../utils/ApiRoute";

const AdminRoute = ({ Component, children, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.token) {
      if (user.role === "admin") {
        setOk(true);
        setLoading(false);
        return;
      }
      getCurrentAdmin(user.token)
        .then((res) => {
          if (res?.data || res?.role === "admin" || res?.email) {
            setOk(true);
          } else {
            setOk(false);
          }
        })
        .catch((error) => {
          console.error("Error verifying admin role:", error);
          setOk(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setOk(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-crimson" role="status"></div>
        <p className="mt-2 text-muted small">Verifying admin credentials...</p>
      </div>
    );
  }

  if (!ok) {
    return <LoadingToRedirect />;
  }

  if (Component) return <Component {...rest} />;
  return children || null;
};

export default AdminRoute;
