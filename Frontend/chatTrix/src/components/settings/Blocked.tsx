import { useState } from "react";
import { Input } from "@/components/ui/input";

export const Blocked = () => {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Blocked</h1>
      <p className="text-gray-500 mb-6">
        Once you block someone, that person can no longer see your posts or stories, find you, or message you on Instagram.
      </p>
      
      <div className="bg-white rounded-lg p-4">
        <Input 
          type="text" 
          placeholder="Search blocked accounts..." 
          className="w-full border-gray-300 mb-4" 
        />
        
        <div className="space-y-2 mt-4">
          <p className="text-gray-500 text-center py-8">
            You haven't blocked anyone.
          </p>
        </div>
      </div>
    </div>
  );
};
