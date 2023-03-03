import type { NextApiRequest, NextApiResponse } from 'next';
// import path from 'path';
// import { promises as fs } from 'fs';
import { myServer } from '@/server/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // const jsonDirectory = path.join(process.cwd(), 'json');
  // const fileContents = await fs.readFile(`${jsonDirectory}/data.json`, 'utf8');
  // const { garage } = JSON.parse(fileContents);
  // console.log(garage);
  const test = myServer.get();
  console.log('rtest', test);
  res.status(200).json(test);
}
