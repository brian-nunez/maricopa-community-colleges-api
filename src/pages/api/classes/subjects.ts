import { NextApiRequest, NextApiResponse } from 'next';
import subjects from '../../../utils/classes/class-subjects.json';

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  response.json({
    key: 'subject_code',
    example: '?subject_code=AGB',
    possibleValues: subjects,
  });
}
