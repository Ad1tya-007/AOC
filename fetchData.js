const https = require('https');

/**
 * Fetches Advent of Code input data for a specific day and year
 * @param {number} day - Day number (1-25)
 * @param {number} year - Year (e.g., 2023)
 * @returns {Promise<string>} - Raw input data as a string
 */
function fetchData(day, year) {
  // Default to current year if not specified
  year = year || new Date().getFullYear();

  // Ensure day is valid
  if (day < 1 || day > 25) {
    throw new Error('Day must be between 1 and 25');
  }

  // Fetch data from AOC website
  const sessionToken = process.env.AOC_SESSION;
  if (!sessionToken) {
    throw new Error(
      'AOC_SESSION environment variable is required to fetch data'
    );
  }

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'adventofcode.com',
      path: `/${year}/day/${day}/input`,
      headers: {
        Cookie: `session=${sessionToken}`,
      },
    };

    https
      .get(options, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to fetch data: ${res.statusCode}`));
          return;
        }

        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(data);
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

module.exports = fetchData;
