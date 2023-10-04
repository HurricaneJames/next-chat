import { api } from "~/utils/api";

import Layout from "~/components/layout";
import { LoadingSpinner } from "~/components/loading";
import CreatePost from "~/components/createPost";
import PostView from "~/components/postView";

export default function Home() {
  return (
    <Layout>
      <CreatePost />
      <Posts />
    </Layout>
  );
}

function Posts() {
  const { data: posts, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-8">
      {posts?.map((post) => (
        <PostView key={post.id} post={post} author={post.author} />
      ))}
    </div>
  );
}
