import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Extract file name from req.body
    const { FileName } = req.body.FileName;
    console.log(FileName)

    // Ensure fileName is provided
    if (!FileName) {
      return res.status(400).json({ error: 'File name is required.' });
    }

    // External URL from where you want to download the file
    const externalUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/files/${FileName}`;
    console.log(externalUrl)

    const response = await fetch(externalUrl);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch file.' });
    }

    const filePath = path.join(process.cwd(), 'public', 'docs', FileName);
    const fileStream = fs.createWriteStream(filePath);

    response.body?.pipe(fileStream);

    await new Promise((resolve, reject) => {
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });

    res.status(200).json({ success: true, message: 'File downloaded successfully.' });
  } catch (error) {
    console.log(error)
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
