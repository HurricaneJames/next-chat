import type { PostViewProps } from "./postView";
import PostView from "./postView";
import { api } from "~/utils/api";
import { LoadingSpinner } from "./loading";

type Props = {
  authorAlias?: string;
  batchSize: number;
};

export default function PostFeed({ authorAlias, batchSize }: Props) {
  const { data, fetchNextPage, isFetchingNextPage, isLoading } =
    api.post.infinitePosts.useInfiniteQuery(
      {
        authorAlias,
        limit: batchSize,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  if (isLoading) return <LoadingSpinner />;
  if (data == null) return <p>No Posts Found</p>;

  return (
    <div className="container flex flex-col items-center justify-center gap-8">
      {data.pages.map(({ posts }, pageIdx) => (
        <FeedPage key={pageIdx} posts={posts} shouldLoadMore={fetchNextPage} />
      ))}
      {isFetchingNextPage && <LoadingSpinner />}
    </div>
  );
}

type FeedPageProps = {
  posts: Post[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shouldLoadMore: () => any;
};
type Post = {
  id: string;
} & PostViewProps["post"];

function FeedPage({ posts, shouldLoadMore }: FeedPageProps) {
  const lastPost = posts.length - 1;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-8">
      {posts.map((post, idx) =>
        idx !== lastPost ? (
          <PostView key={post.id} post={post} />
        ) : (
          <PostView key={post.id} post={post} onObserve={shouldLoadMore} />
        ),
      )}
    </div>
  );
}
