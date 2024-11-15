"use client";
import { useSession, signIn } from "next-auth/react";
import FractalLanding from "../components/MandelbrotSet";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated") {
    return (
      <main className="h-screen w-screen overflow-hidden">
        <FractalLanding />
      </main>
    );
  }

  return (
    <div>
      <button onClick={() => signIn()}>Sign in</button>
      <FractalLanding />
    </div>
  );
}
