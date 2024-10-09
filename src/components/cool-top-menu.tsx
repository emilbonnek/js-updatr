"use client";

import { Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function CoolTopMenu({
  currentDirectory,
  selectCurrentDirectory,
}: {
  currentDirectory?: string | null;
  selectCurrentDirectory: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
      <div className="flex items-center space-x-4">
        <svg
          className="h-10 w-auto"
          viewBox="0 0 120 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="logo-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <text
            x="5"
            y="30"
            fontFamily="Arial, sans-serif"
            fontSize="24"
            fontWeight="bold"
            fill="url(#logo-gradient)"
          >
            js-updatr
          </text>
        </svg>
      </div>
      <div className="flex items-center space-x-4">
        {currentDirectory ? (
          <div className="bg-gray-800 rounded-lg px-3 py-1 max-w-md overflow-hidden">
            <div className="relative">
              <p
                className="text-sm font-mono text-gray-300 whitespace-nowrap overflow-hidden overflow-ellipsis"
                style={{ maxWidth: "200px" }}
              >
                {currentDirectory}
              </p>
              <div className="absolute inset-0 flex items-center justify-start text-sm font-mono text-gray-300 opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out whitespace-nowrap overflow-x-auto">
                {currentDirectory}
              </div>
            </div>
          </div>
        ) : null}
        <Button
          variant="outline"
          size="icon"
          onClick={selectCurrentDirectory}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all duration-300 ${
            isHovered ? "animate-pulse" : ""
          }`}
          aria-label="Open folder"
        >
          <Folder className="h-5 w-5 text-blue-400" />
          <div
            className={`absolute inset-0 bg-blue-400 rounded-full filter blur-md transition-opacity duration-300 ${
              isHovered ? "opacity-20" : "opacity-0"
            }`}
          ></div>
        </Button>
      </div>
    </div>
  );
}
