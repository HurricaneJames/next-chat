import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getUserByAlias: publicProcedure
    .input(z.object({ alias: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.user.findFirst({ where: { alias: input.alias } }),
    ),
});
