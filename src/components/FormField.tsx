import { type ReactNode } from "react";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  children: ReactNode;
  hint?: string;
};

export default function FormField({
  label,
  htmlFor,
  children,
  hint,
}: FormFieldProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[9rem_1fr] gap-1 sm:gap-x-4 sm:gap-y-0 items-center">
      <label className="label py-1 sm:py-2 sm:justify-end" htmlFor={htmlFor}>
        <span className="label-text font-medium">{label}</span>
      </label>
      <div>
        {children}
        {hint && (
          <p className="text-xs opacity-60 mt-1">{hint}</p>
        )}
      </div>
    </div>
  );
}
