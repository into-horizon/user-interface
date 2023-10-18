import React from "react";
import { Rings } from "react-loader-spinner";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10% 0",
      }}
    >
      <Rings height="30rem" width="50rem" color="blue" />
    </div>
  );
};

export default Loader;
