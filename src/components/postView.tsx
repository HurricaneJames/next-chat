import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { TrashButton } from "~/components/trashButton";
import { LOGO } from "~/resources/logo";
import { RouterOutputs, api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
dayjs.extend(relativeTime);

type Post = RouterOutputs["post"]["getAll"][number];

export default function PostView({ post }: { post: Post }) {
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

  const authorSlug = post.author.alias ?? post.authorId;

  return (
    <div className="flex max-w-md flex-row gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20">
      <img
        src={post.author.image ?? ""}
        alt="Profile image"
        className="h-12 w-12 rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex flex-row gap-2">
          <Link
            className="text-fuchsia-500"
            href={`/u/${authorSlug}`}
          >{`${LOGO}${post.author.name}`}</Link>
          <span>{`·`}</span>
          <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
        </div>
        <span>{post.content}</span>
      </div>
      {sessionData?.user && sessionData.user.id === post.authorId && (
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
