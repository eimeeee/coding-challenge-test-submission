import { ButtonType, ButtonVariant } from "@/types";
import React, { FunctionComponent } from "react";

import $ from "./Button.module.css";

interface ButtonProps {
  onClick?: () => void;
  type?: ButtonType;
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
}) => {
  return (
    <button
      className={`${$.button} ${variant ? $[variant] : ''}`}
      type={type}
      onClick={onClick}
    >
      {loading ? <span data-testid="loading-spinner" className={$.spinner}></span> : children}
    </button>
  );
};

export default Button;
