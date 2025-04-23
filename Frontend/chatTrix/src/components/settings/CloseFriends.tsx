import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const CloseFriends = () => {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Close Friends</h1>
      <p className="text-gray-500 mb-6">
        People won't be notified when you add them to your close friends list. Only you can see your list.
      </p>
      
      <div className="bg-white rounded-lg p-4 mb-6">
        <Input 
          type="text" 
          placeholder="Search..." 
          className="w-full border-gray-300 mb-4" 
        />
        
        <div className="space-y-2 mt-4">
          <p className="text-gray-500 text-center py-4">
            Your close friends list is empty. Search for people to add.
          </p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button variant="outline" className="mr-2">Cancel</Button>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">Done</Button>
      </div>
    </div>
  );
};
