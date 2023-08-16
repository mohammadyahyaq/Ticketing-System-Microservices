"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div className="grid place-content-center h-screen bg-slate-100">
      <form
        className="flex flex-col gap-3 px-6 py-9 mx-auto w-96 h-96 bg-white shadow-md rounded-md"
        onSubmit={async (e) => {
          e.preventDefault();
          
          const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (res.status === 201) {
            setIsSuccess(true);
          } else {
            setIsError(true);
          }
        }}
      >
        <h1 className="text-2xl text-center pb-4">Sign Up</h1>
        <div className="flex flex-col gap-1">
          <input
            id="email"
            name="email"
            className="border border-slate-400 rounded-lg px-3 py-3"
            placeholder="Email address"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <input
            id="password"
            name="password"
            className="border border-slate-400 rounded-lg px-3 py-3"
            placeholder="Password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {isSuccess && (
            <div className="bg-green-100 border border-green-700 p-2 rounded-md">
                <p className="text-green-700 text-sm">The email is created successfully</p>
            </div>
        )}
        {isError && (
            <div className="bg-red-100 border border-red-700 p-2 rounded-md">
                <p className="text-red-700 text-sm">The email is created successfully</p>
            </div>
        )}
        <button className="bg-blue-600 hover:bg-blue-500 text-white text-xl py-2 rounded-md mt-4" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}
