import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
// import Link from "next/link";

import { RouterOutputs, api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Layout from "~/components/layout";
import { LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { TrashButton } from "~/components/trashButton";
dayjs.extend(relativeTime);

const LOGO = "→";

export default function Home() {
  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Next <span className="text-fuchsia-500">Chat</span> {LOGO}
        </h1>
        <CreatePost />
        <Posts />
        <div className="flex flex-col items-center gap-2">
          <AuthShowcase />
        </div>
      </div>
    </Layout>
  );
}

function CreatePost() {
  const ctx = api.useContext();
  const { mutate, isLoading: isMutating } = api.post.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.post.invalidate();
    },
    onError: (error) => {
      const contentError = error.data?.zodError?.fieldErrors.content;
      if (contentError && contentError.length > 0) {
        return toast.error(contentError[0] ?? "");
      }
      if (error.message == "TOO_MANY_REQUESTS") {
        return toast.error(
          "Too many posts. Please wait a while and try again.",
        );
      }

      return toast.error("Something went wrong. Please try again later");
    },
  });
  const [input, setInput] = useState("");

  const { data: sessionData } = useSession();
  const user = sessionData?.user;
  if (!user) return null;

  return (
    <div className="flex flex-row gap-4">
      <img
        src={user.image ?? ""}
        alt="Profile image"
        className="h-16 w-16 rounded-full"
      />
      <input
        placeholder="What's on your mind?"
        className="bg-transparent"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isMutating}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
      />
      {isMutating && (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      {!isMutating && (
        <button
          className={input.length < 1 ? "opacity-50" : ""}
          disabled={input.length < 1}
          onClick={() => {
            mutate({ content: input });
          }}
        >
          {LOGO}
        </button>
      )}
    </div>
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
type Post = RouterOutputs["post"]["getAll"][number];
function PostView({ post }: { post: Post }) {
  const ctx = api.useContext();
  const { data: sessionData } = useSession();
  const { mutate, isLoading: isMutating } = api.post.delete.useMutation({
    onSuccess: () => {
      void ctx.post.invalidate();
    },
    onError: (error) => {
      return toast.error("Something went wrong. Please try again later");
    },
  });

  return (
    <div className="flex max-w-md flex-row gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20">
      <img
        src={post.author.image ?? ""}
        alt="Profile image"
        className="h-12 w-12 rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex flex-row gap-2">
          <span className="text-fuchsia-500">{`${LOGO}${post.author.name}`}</span>
          <span>{`·`}</span>
          <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
        </div>
        <span>{post.content}</span>
      </div>
      {!!sessionData?.user && (
        <div className="ml-auto">
          <TrashButton
            onClick={() => {
              if (isMutating) return;
              mutate({ id: post.id });
            }}
          />
        </div>
      )}
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
