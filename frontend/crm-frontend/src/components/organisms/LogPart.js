"use client";

import styles from "../../app/login/index.module.css";
import Link from "next/link";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import AuthServices from "@/services/AuthServices";
import { useRouter } from "next/router"; // Corrected from 'next/navigation'

export default function LogPart() {
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await AuthServices.login({ username: email, password });
      if (data.isAuthenticated) {
        setUser(data.user);
        setIsAuthenticated(true);
        router.push("/");
      } else {
        alert("Login failed: " + data.message.msgBody);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login.");
    }
  };

  return (
    <div className={styles.logpart}>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          type="text"
        />
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          type="password"
        />
        <button className={styles.button} type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link href="/register">Register</Link></p>
    </div>
  );
}