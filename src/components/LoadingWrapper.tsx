import React, { useState, useEffect } from "react";

interface LoaderWrapperProps {
  loadFn: () => Promise<boolean>;
  fallback: React.ReactNode;
  children: React.ReactNode;
}
/* -------------------------------------------------------------------------- */

const LoaderWrapper: React.FC<LoaderWrapperProps> = ({
  loadFn,
  fallback,
  children,
}) => {
  const [loading, setLoading] = useState(true);
console.log(loading, "loading");
  useEffect(() => {
    console.log("LoaderWrapper useEffect");
    loadFn().then(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default LoaderWrapper;
