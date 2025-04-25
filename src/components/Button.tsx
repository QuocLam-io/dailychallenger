import React from "react";
import "./Button.scss";

interface ButtonProps {
  children: React.ReactNode;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({ children, icon, onClick, disabled = false }: ButtonProps) => {
  return (
    <button className="button" disabled={disabled} onClick={onClick}>
      {icon && <img src={icon} aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
};

export default Button;
