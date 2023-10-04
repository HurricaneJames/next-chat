import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getProfileWithPosts: publicProcedure
    .input(z.object({ alias: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.user.findUnique({
        select: {
          id: true,
          alias: true,
          name: true,
          image: true,
          posts: {
            take: 15,
            select: {
              id: true,
              authorId: true,
              content: true,
              createdAt: true,
              // TODO - add a cursor to make it possible to load AFTER
            },
          },
        },
        where: { alias: input.alias },
      });
    }),
});
