import React, { useState } from "react";
import { useTheme } from "../ui/theme-provider";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";

function resetPassword() {
  const { theme, setTheme } = useTheme(); // Access the theme and setTheme from the theme provider
  const [email, setEmail] = useState(""); // State to store the email input
  const [message, setMessage] = useState(""); // State to store success/error messages
  const [loading, setLoading] = useState(false); // State to handle loading state

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark"); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Reset link sent successfully! Check your email.");
      } else {
        setMessage(`❌ ${data.message || "Failed to send reset link."}`);
      }
    } catch (error) {
      setMessage("❌ An error occurred. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        theme === "dark" ? "bg-black" : "bg-white"
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4"
        onClick={toggleTheme}
      >
        {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </Button>

      <div className="w-full max-w-lg border-4 border-blue-800 shadow-[0_0_15px_rgba(30,64,175,0.8)] rounded-lg bg-white dark:bg-black p-8">
        <h2 className="text-3xl text-blue-800 font-bold text-center mb-8">Reset Password</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-muted-foreground"
            >
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm ${
                theme === "dark" ? "bg-black text-white" : "bg-white text-black"
              }`}
              placeholder="Enter your email"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-800 text-white hover:bg-blue-900 py-3"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center ${
              message.startsWith("✅") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default resetPassword;