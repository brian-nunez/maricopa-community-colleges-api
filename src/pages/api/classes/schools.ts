import { NextApiRequest, NextApiResponse } from 'next';
import schools from '../../../utils/classes/schools.json';

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  response.json({
    key: 'institutions[]',
    example: '?institutions[]=PCC01&institutions[]=GCC02',
    possibleValues: schools,
  });
}