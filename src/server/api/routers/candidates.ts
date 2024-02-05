import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import Airtable from "airtable"
import { Candidate } from "@prisma/client";
import { create } from "domain";

/*
const Airtable = require('airtable');
const base = new Airtable({ apiKey: 'YOUR_API_KEY' }).base('YOUR_BASE_ID');
*/

export interface AirtableCandidate {
  uid: number,
  name: string,
  email: string,
}

async function getAirTableApplicants() : Promise<AirtableCandidate[]> {
  const newApplicants : AirtableCandidate[] = [];
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY! }).base('appwvp6CmaOAudTzJ');

  return new Promise((resolve, reject) => {
      base('Attendance').select({
        // Filters or options go here
      }).eachPage((records, fetchNextPage) => {
        records.forEach(record => {
          const applicantData : AirtableCandidate = {
            uid: record.get('UID') as number,
            name: record.get('Name') as string,
            email: record.get('Email') as string,
          };
          newApplicants.push(applicantData);
        });
        fetchNextPage();
      }, err => {
        if (err) {
          console.error('Error retrieving records:', err);
          reject(err);
        } else {
          resolve(newApplicants);
        }
      });
    });
};



export const candidateRouter = createTRPCRouter({

  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),

  getAllApps: publicProcedure.query(({ ctx }) => {
    return ctx.db.candidate.findMany({
      include: {
        profile: true,
      },
    });
  }),

  fetchNewApps: publicProcedure.mutation(async ({ctx}) => {
    const newApplicants = await getAirTableApplicants();
    const promises = [];

    for (const applicant of newApplicants) {
      const promise = ctx.db.candidate.upsert({
        where: {
          uid: applicant.uid.toString()
        },
        update: {},
        create: {
          uid: applicant.uid.toString(),
          profile: {
            create: {
              name: applicant.name,
              email: applicant.email
            }
          }
        },
      });
      promises.push(promise);
    }
    
    Promise.all(promises)
      .then(results => {
        console.log("All applicants have been processed successfully.", results);
      })
      .catch(error => {
        console.error("An error occurred while processing applicants.", error);
      });

      return newApplicants;
      // const doc = new GoogleSpreadsheet('1Haqj7suQ38DgTXnLkum9Wi8csYXcbWxeOs1910gJd0k', {apiKey: process.env.GOOGLE_API_KEY!});
      // await doc.loadInfo(); // loads document properties and worksheets
      // console.log("DOCUMENT TITLE: " + doc.title);
      // return doc.title;
    }),
});
