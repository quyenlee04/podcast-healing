import React from "react";

const Button = ({ text, onClick, type = "button", className = "" }) => {
  return (
    <button className={`btn ${className}`} type={type} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
