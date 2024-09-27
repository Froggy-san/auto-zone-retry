import React from "react";

interface TemplateProps {
  children: React.ReactNode;
}

const Template: React.FC<TemplateProps> = ({ children }) => {
  return (
    <div
      className="
      h-screen
      p-6 flex 
       items-center
      justify-center"
    >
      {children}
    </div>
  );
};

export default Template;
