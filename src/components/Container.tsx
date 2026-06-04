import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`max-w-6xl mx-auto px-6 md:px-10 w-full ${className}`.trim()}>
      {children}
    </div>
  );
}
