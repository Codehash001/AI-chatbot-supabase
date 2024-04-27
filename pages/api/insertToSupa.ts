// api/insertDocuments.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabase-client'; // Update the path

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { allfiles } = req.body;
    console.log('files are ',allfiles)

    const insertPromises = allfiles.map(async (docname: string) => {
      const { data, error } = await supabase
        .from('documents')
        .insert([{ docname : docname }]);

      if (error) {
        throw error;
      }

      return data;
    });

    const results = await Promise.all(insertPromises);

    res.status(200).json({ success: true, results });
  } catch (error: any) {
    console.error('Error inserting data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
