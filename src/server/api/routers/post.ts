import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

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
    ).mutation(async ({ctx, input}) => {
        const authorId = ctx.session.user.id;
        const post = await ctx.db.post.create({
            data: {
                authorId,
                content: input.content,
            }
        });
        return post;
    }),
});
