import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useState } from "react";

import { api } from "~/utils/api";
import { LoadingSpinner } from "./loading";
import { LOGO } from "~/resources/logo";

export default function CreatePost() {
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
