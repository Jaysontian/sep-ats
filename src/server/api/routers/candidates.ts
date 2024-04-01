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
  image: string,
}

async function getAirTableApplicants() : Promise<AirtableCandidate[]> {
  const newApplicants : AirtableCandidate[] = [];
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY! }).base('appwvp6CmaOAudTzJ');

  return new Promise((resolve, reject) => {
      base('Attendance').select({
        // Filters or options go here
      }).eachPage((records, fetchNextPage) => {
        
        records.forEach(record => {
          if (record.get('UID') && record.get('UID') != undefined){
            let img = "";
            if(!record.get("Photo") || record.get("Photo") == null || record.get("Photo") == undefined){
              img = "https://i.imgur.com/nz6BOUP.png";
            } else {
              img = record.get("Photo") as string;
            }
            console.log("Printing photo: ", img);
            const applicantData : AirtableCandidate = {
              uid: record.get('UID') as number,
              name: record.get('Name') as string,
              email: record.get('Email') as string,
              image: img,
            };
            newApplicants.push(applicantData);
          }
        });
        console.log("We are done");
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
      console.log(applicant);
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
              email: applicant.email,
              image: applicant.image,
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
    }),

    getFormApplicationData: publicProcedure.input(z.object({ uid: z.string() })).query(async ({input}) => {
        const doc = new GoogleSpreadsheet('1VSrx0O4Sa4i7atdKYpxnjFIKu_Ifs_w6cSTRmTzwsKY', {apiKey: process.env.GOOGLE_API_KEY!});
        await doc.loadInfo(); // loads document properties and worksheets
        console.log("DOCUMENT TITLE: " + doc.title);

        const sheet = doc.sheetsByIndex[0]
        const rows = await sheet?.getRows();

        console.log("UID OF ThE PERSON: ", input.uid);

        let appData = {
          submitted: false,
        }

        rows?.forEach((item) => {
          if (item._rawData[2] == input.uid){ // if we found an application with UID that matches the queried applicant UID
            console.log('FOUND SOMETHING');
            appData = {
              submitted: true,
              time: item._rawData[0],
              name: item._rawData[1],
              uid: item._rawData[2],
              phone: item._rawData[3],
              major: item._rawData[4],
              portfolio: item._rawData[5],
              year: item._rawData[6],
              grad: item._rawData[7],
              prompt1: item._rawData[8],
              prompt2: item._rawData[9],
              prompt3: item._rawData[10],
            }
          }
        });

        return appData;
    }),
});
