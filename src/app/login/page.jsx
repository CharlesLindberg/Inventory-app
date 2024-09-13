"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Importera useRouter

export default function AuthPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLogin, setIsLogin] = useState(true); // State för att växla mellan login och register
  const router = useRouter(); // Initiera useRouter

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     setError(null);
  //     setSuccess(null);

  //     const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
  //     const body = isLogin
  //       ? { email: formData.email, password: formData.password }
  //       : formData;

  //     try {
  //       const res = await fetch(endpoint, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(body),
  //       });

  //       const data = await res.json();

  //       if (!res.ok) {
  //         throw new Error(
  //           data.error || `Failed to ${isLogin ? "login" : "register"}`
  //         );
  //       }

  //       if (isLogin) {
  //         router.push("/items/list"); // Omdirigera till landningssidan om login lyckas
  //       } else {
  //         setSuccess("User registered successfully! You can now log in.");
  //       }
  //     } catch (err) {
  //       setError(err.message);
  //     }
  //   };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || `Failed to ${isLogin ? "login" : "register"}`
        );
      }

      if (isLogin) {
        // **Save the token to localStorage**
        localStorage.setItem("token", data.token);

        router.push("/items/list"); // Redirect to items list after successful login
      } else {
        setSuccess("User registered successfully! You can now log in.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>{isLogin ? "Login" : "Register"}</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required={!isLogin}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>

      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Register here" : "Login here"}
        </button>
      </p>
    </div>
  );
}
