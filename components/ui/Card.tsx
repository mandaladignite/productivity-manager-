import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
  variant?: "default" | "elevated" | "outlined";
}

export default function Card({ 
  children, 
  className = "", 
  title, 
  action,
  variant = "default"
}: CardProps) {
  const variantStyles = {
    default: "bg-white border border-gray-200",
    elevated: "bg-white shadow-md border border-gray-200",
    outlined: "bg-transparent border-2 border-gray-200",
  };

  return (
    <div className={`rounded-xl ${variantStyles[variant]} ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={title || action ? "p-6" : "p-6"}>{children}</div>
    </div>
  );
}
