import { signIn, signOut, useSession } from "next-auth/react";
import type { PropsWithChildren } from "react";
import { LOGO } from "~/resources/logo";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Next <span className="text-fuchsia-500">Chat</span> {LOGO}
        </h1>
        <div className="flex flex-col items-center gap-2">
          <AuthShowcase />
        </div>
        {children}
      </div>
    </main>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
