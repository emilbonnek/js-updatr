"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Copy } from "lucide-react";
import { useState } from "react";

interface ErrorPageProps {
  errorMessage: string;
}

export function InternalErrorPage({ errorMessage }: ErrorPageProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(errorMessage).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="flex h-screen bg-gray-100 p-6">
      <div className="flex flex-col w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between bg-red-600 p-4 text-white">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-6 w-6" />
            <h1 className="text-xl font-bold">Internal Error</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-white border-white hover:bg-red-700"
            onClick={copyToClipboard}
          >
            {isCopied ? "Copied!" : "Copy Error"}
            <Copy className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="flex-grow flex">
          <div className="w-1/3 p-6 border-r">
            <h2 className="text-lg font-semibold mb-4">Error Information</h2>
            <p className="text-gray-600 mb-4">
              An error occurred while executing an npm command. This could be
              due to various reasons such as network issues, package conflicts,
              or system limitations.
            </p>
            <h3 className="font-semibold mb-2">Possible Next Steps:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Check your internet connection</li>
              <li>Verify your npm configuration</li>
              <li>Clear npm cache and try again</li>
              <li>Check for conflicting dependencies</li>
              <li>Consult the error message for specific issues</li>
            </ul>
          </div>
          <div className="w-2/3 p-6">
            <h2 className="text-lg font-semibold mb-4">Error Details</h2>
            <ScrollArea className="h-[calc(100vh-220px)] w-full rounded border p-4">
              <pre className="font-mono text-sm whitespace-pre-wrap break-words">
                {errorMessage}
              </pre>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
