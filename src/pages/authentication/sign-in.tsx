/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

// URL API - domyślnie localhost:3001
const API_URL = "http://localhost:3001";

const SignInPage: FC = function () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Zapisz rolę użytkownika i email w localStorage
        localStorage.setItem("userRole", data.userRole);
        localStorage.setItem("username", email); // Zapisz email do wyświetlenia w navbarze
        // Przekieruj do strony głównej
        navigate("/");
      } else {
        setError(data.error || "Błąd logowania. Sprawdź dane i spróbuj ponownie.");
      }
    } catch (err) {
      setError("Problem z połączeniem do serwera. Spróbuj ponownie później.");
      console.error("Błąd logowania:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12">
      <a href="/" className="my-6 flex items-center gap-x-1 lg:my-0">
        <img
          alt="Flowbite logo"
          src="https://flowbite.com/docs/images/logo.svg"
          className="mr-3 h-10"
        />
        <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
          Flowbite
        </span>
      </a>
      <Card
        horizontal
        imgSrc="/images/authentication/login.jpg"
        imgAlt=""
        className="w-full md:max-w-[1024px] md:[&>*]:w-full md:[&>*]:p-16 [&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0 lg:[&>img]:block"
      >
        <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
          Zaloguj się do platformy
        </h1>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900 dark:text-red-200">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col gap-y-3">
            <Label htmlFor="email">Twój email</Label>
            <TextInput
              id="email"
              name="email"
              placeholder="imie@firma.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="password">Twoje hasło</Label>
            <TextInput
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              <Checkbox id="rememberMe" name="rememberMe" />
              <Label htmlFor="rememberMe">Zapamiętaj mnie</Label>
            </div>
            <a
              href="/authentication/forgot-password"
              className="w-1/2 text-right text-sm text-primary-600 dark:text-primary-300"
            >
              Zapomniałeś hasła?
            </a>
          </div>
          <div className="mb-6">
            <Button type="submit" className="w-full lg:w-auto" disabled={loading}>
              {loading ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Nie masz konta?&nbsp;
            <a href="/authentication/sign-up" className="text-primary-600 dark:text-primary-300">
              Utwórz konto
            </a>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default SignInPage;
