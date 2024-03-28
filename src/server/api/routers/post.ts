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
      vote: z.number(),
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
          vote: input.vote,
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

  getRecentByID: publicProcedure // get all recent posts by Signed in Active
    .input(z.object({ID: z.string()}))
    .query(({ ctx, input }) => {

      return ctx.db.post.findMany({
        orderBy:[{
          createdAt:"desc"
        }],
        include: {
          applicant: {
            include: {
              profile: true, // nested relations query
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
  getApplicantByID: publicProcedure // get all recent posts by Signed in Active
    .input(z.object({
      ID: z.string(), // ID = Active Logged in ID,
      ApplicantID: z.string(), // Queried Applicant ID
    }))  
    .query(({ ctx, input }) => {

      return ctx.db.post.findMany({
        orderBy:[{
          createdAt:"desc"
        }],
        include: {
          applicant: {
            include: {
              profile: true, // nested relations query
            }
          },
        },
        where: {
          authorId:{
            equals: input.ID,
          },
          applicant_id:{
            equals: input.ApplicantID,
          }
        }
      });
  }),
});
