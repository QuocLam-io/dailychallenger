import React from "react";
import "./Button.scss";

interface ButtonProps {
  children: React.ReactNode;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  iconPosition?: "left" | "right";
}

const Button = ({
  children,
  icon,
  onClick,
  disabled = false,
  className,
  iconPosition = "left",
}: ButtonProps) => {
  return (
    <button
      className={`button ${className ? className : ""}`}
      disabled={disabled}
      onClick={onClick}
      // data-icon-position={iconPosition}
    >
      {icon && iconPosition === "left" && <img src={icon} aria-hidden="true" />}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <img src={icon} aria-hidden="true" />
      )}
    </button>
  );
};

export default Button;
