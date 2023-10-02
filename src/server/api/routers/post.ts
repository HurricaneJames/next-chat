import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany();
  }),

  getViewerPosts: protectedProcedure.query(({ctx}) => {
    // TODO - return viewer posts
    return ctx.db.post.findMany();
  }),
});
