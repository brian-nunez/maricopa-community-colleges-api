import axios from 'axios';
import { load } from 'cheerio';
import { NextApiRequest, NextApiResponse } from 'next';

type Params = {
  keywords?: string;
  subject_code?: string;
  all_classes?: boolean | 'true' | 'false';
  'institutions[]'?: string[];
}

const objectToQuery = (obj: Record<string, unknown>): string => {
  return Object.entries(obj)
    .map((curr) => `${curr[0]}=${curr[1]}`)
    .join('&');
};

type GeneratedURL = (data: Params) => string;

const generateURL: GeneratedURL = ({
  keywords = '',
  subject_code = '',
  all_classes = false,
  'institutions[]': institutions,
}) => {
  const domain = 'https://classes.sis.maricopa.edu';
  const params: Exclude<Params, 'institutions'> = {};
  if (keywords.length > 0) { params.keywords = keywords; }
  if (subject_code.length > 0) { params.subject_code = subject_code; }
  if (typeof all_classes === 'boolean' || typeof all_classes === 'string') { params.all_classes = `${all_classes}`; }
  const query = objectToQuery(params);
  const institutionsQuery = institutions?.map(i => `institutions[]=${i}`).join('&');

  return `${domain}?${query}${institutionsQuery && institutionsQuery.length > 0 ? `&${institutionsQuery}` : ''}`;
}

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  if (Object.keys(request.query).length === 0) {
    response.json({
      courseLength: 0,
      classLength: 0,
      data: [],
    });
    return;
  }

  const url = generateURL(request.query);
  console.log(url);
  const courseHTML = await axios.get(url);
  // fs.writeFileSync('./courses.html', courseHTML.data);

  // const $ = load(fs.readFileSync('./courses.html').toString());

  const $ = load(courseHTML.data);

  const classes = $('.course').toArray();

  if (classes.length === 0) {
    response.json({
      courseLength: 0,
      classLength: 0,
      data: [],
    });
    return;
  }

  const courseData = classes.map((c) => {
    const course = load(c);

    const title = course('h3').text().trim().replace(/\n.*/g, '');
    const credits = course('h3 span').text().replace(/( – )|( credits)/g, '');
    const description = course('p').text().replace(/\n/g, ' ').trim().replace(/ +/g, ' ');
    const sunId = course('.azsunid a').text().replace(/\n/g, '').trim();

    const tableHeading: string[] = [];
    const tableData: any[] = [];

    course('table thead tr.headings th').each(function () {
      tableHeading.push(course(this).text());
    });

    course('table tbody tr.class-specs').each(function () {
      const rowData: Record<string, string> = {};
      course(this).find('td').each(function (index) {
        // console.log(tableHeading[index], course(this).text().trim().replace(/ {1,}/g, ''));
        const rowKey = tableHeading[index];
        if (!rowKey) return;
        rowData[rowKey] = course(this)
          .text()
          .trim()
          .replace(/ {2,}/g, '')
          .replace(/\n/g, ' ');
      });
      tableData.push(rowData);
    });

    return {
      title,
      credits: Number(credits),
      description,
      sunId,
      tableData,
    };
  });

  const classLength = courseData.reduce((acc, curr) => acc + curr.tableData.length, 0);

  response.json({
    courseLength: courseData.length,
    classLength,
    data: courseData,
  });
}
