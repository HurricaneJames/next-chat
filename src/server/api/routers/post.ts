import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    // limit to 3 posts in a 1 minute sliding window
    limiter: Ratelimit.slidingWindow(3, "1 m"),
    analytics: true,
    prefix: "next-chat-studio",
});

export const postRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.db.post.findMany({
            take: 100,
            orderBy: [
                { createdAt: 'desc' },
            ],
            include: {
                author: {
                    select: {
                        alias: true,
                        name: true,
                        image: true,
                    }
                },
            },
        });
    }),

    create: protectedProcedure.input(
        z.object({
            content: z.string().min(1).max(1500),
        })
    ).mutation(async ({ ctx, input }) => {
        const authorId = ctx.session.user.id;

        const { success } = await ratelimit.limit(authorId)
        if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

        const post = await ctx.db.post.create({
            data: {
                authorId,
                content: input.content,
            }
        });
        return post;
    }),

    delete: protectedProcedure.input(
        z.object({
            id: z.string(),
        }),
    ).mutation(async ({ ctx, input }) => {
        const authorId = ctx.session.user.id
        await ctx.db.post.delete({
            where: { id: input.id, authorId },
        });
    }),
});
