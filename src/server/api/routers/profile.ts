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
          name: true,
          image: true,
          posts: {
            take: 15,
            select: {
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
