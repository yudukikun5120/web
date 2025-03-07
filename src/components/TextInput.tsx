import clsx from "clsx";
import React, { forwardRef } from "react";

// eslint-disable-next-line react/display-name
export const TextInput = forwardRef<
  HTMLInputElement,
  Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "type"
  >
>(({ className, ...props }, ref) => {
  return (
    <input
      {...props}
      type={"text"}
      ref={ref}
      className={clsx(
        className,
        ["bg-slate-50"],
        ["outline-teal-300"],
        [["text-slate-900"], ["placeholder:text-slate-300"]],
        ["border", "border-gray-300", "rounded"]
      )}
    />
  );
});
