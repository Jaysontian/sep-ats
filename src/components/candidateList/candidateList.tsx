import { type Payment, columns } from "./columns";
import { DataTable } from "./data-table";
import { api } from "~/trpc/server";

async function getData(): Promise<Payment[]> {
  const allApps = await api.candidate.getAllApps.query();
  // Fetch data from your API here
  return allApps;
}

export default async function CandidateList() {
  const data = await getData();

  return (
    <div className="py-10 w-full">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
