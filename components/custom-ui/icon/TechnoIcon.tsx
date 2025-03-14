import React from "react";

export default function TechnoIcon({
    type,
    children,
    className = "",
}: {
    type?: "button";
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`flex items-center justify-center ${type === "button" ? "bg-white text-primary rounded-lg p-2" : ""} ${className}`}
        >
            {children}
        </div>
    );
}

