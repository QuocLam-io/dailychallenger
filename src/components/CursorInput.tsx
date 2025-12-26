import { InputHTMLAttributes } from "react";
import "./CursorInput.scss";

interface CursorInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

const CursorInput = ({
  value,
  onChange,
  className = "",
  ...props
}: CursorInputProps) => {
  return (
    <div className={`cursor-input ${className}`}>
      <div className="cursor-input_overlay">
        <span className="cursor-input_mirror">{value}</span>
        <span className="cursor-input_caret"></span>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  );
};

export default CursorInput;
