"use client";
import { useSession, signIn } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated") {
    return (
      <div>
        <h1>Welcome, {session.user?.name}!</h1>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
}
