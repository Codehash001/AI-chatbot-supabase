import { exec } from 'child_process';
import { NextApiRequest, NextApiResponse } from 'next';
import { run } from '@/scripts/ingest-data';

const filePath = 'public/docs';

const privateKey = process.env.SUPABASE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_KEY`);

const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    (async () => {
      await run();
      return res.status(200).send('ingested');
    })();
  } else {
    return res.status(405).send('Method not allowed');
  }
}
