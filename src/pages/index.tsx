import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";

import Layout from "~/components/layout";
import { LoadingSpinner } from "~/components/loading";
import CreatePost from "~/components/createPost";
import { LOGO } from "~/resources/logo";
import PostView from "~/components/postView";

export default function Home() {
  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Next <span className="text-fuchsia-500">Chat</span> {LOGO}
        </h1>
        <div className="flex flex-col items-center gap-2">
          <AuthShowcase />
        </div>
        <CreatePost />
        <Posts />
      </div>
    </Layout>
  );
}

function Posts() {
  const { data: posts, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-8">
      {posts?.map((post) => <PostView key={post.id} post={post} />)}
    </div>
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
