import React, { useState, useRef } from "react";

// Define the props type to accept the callback function
interface VerificationInputProps {
  onChangeCode: (code: string) => void;
}

const VerificationInput: React.FC<VerificationInputProps> = ({
  onChangeCode,
}) => {
  const [code, setCode] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return; // Only allow numeric input

    const newCode = [...code];
    newCode[idx] = value;

    setCode(newCode);
    onChangeCode(newCode.join("")); // Pass the updated code to the parent

    // Move to the next input if a digit is entered
    if (value && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text").slice(0, 6); // Limit to 6 characters
    if (!/^\d+$/.test(pastedText)) return; // Only allow numeric input

    const newCode = pastedText.split("");
    setCode(newCode);
    onChangeCode(newCode.join("")); // Pass the pasted code to the parent

    const lastFilledIdx = newCode.length - 1;
    inputRefs.current[lastFilledIdx]?.focus();
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
      {code.map((digit, idx) => (
        <input
          key={idx}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleBackspace(e, idx)}
          onPaste={handlePaste}
          ref={(el) => (inputRefs.current[idx] = el)}
          style={{
            width: "40px",
            height: "40px",
            fontSize: "24px",
            textAlign: "center",
          }}
        />
      ))}
    </div>
  );
};

export default VerificationInput;
