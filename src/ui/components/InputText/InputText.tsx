import React, { FunctionComponent, InputHTMLAttributes } from "react";

import $ from "./InputText.module.css";

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

const InputText: FunctionComponent<InputTextProps> = ({
  name,
  onChange,
  placeholder,
  value,
  ...rest
}) => {
  return (
    <input
      aria-label={name}
      className={$.inputText}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      type="text"
      value={value}
      {...rest}
    />
  );
};

export default InputText;
