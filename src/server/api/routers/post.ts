import { z } from "zod";


import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({
      content: z.string().min(1),
      authorId: z.string().min(1),
      authorName: z.string().min(1),
      applicant: z.string().length(9),
    }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          content: input.content,
          authorId: input.authorId,
          authorName: input.authorName,
          applicant_id: input.applicant,
        },
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany();
  }),

  getRecentByID: publicProcedure
    .input(z.object({ID: z.string()}))
    .query(({ ctx, input }) => {

      return ctx.db.post.findMany({
        orderBy:[{
          createdAt:"desc"
        }],
        include: {
          applicant: {
            include: {
              profile: true,
            }
          },
        },
        where: {
          authorId:{
            equals: input.ID
          }
        }
      });
  }),
});
