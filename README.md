# Advent of Code Data Fetcher

A simple API to fetch Advent of Code input data by day and year.

## Usage

```javascript
const fetchData = require('./fetchData');

// fetchData always returns a Promise now
fetchData(1, 2023)
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });

// Or with async/await
async function main() {
  try {
    const data = await fetchData(1, 2023);
    console.log(data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Working with Solutions

### Setup

Before working on solutions, make sure to set your session token as described in `SETUP.md`.

### Creating a New Solution

To create a solution file for a new day:

```bash
# Default to 2024
DAY=2 YEAR=2024 npm run new-day

# For other years
DAY=1 YEAR=2023 npm run new-day
```

This will:

1. Create the year directory if it doesn't exist
2. Copy the template into `YEAR/dayDAY.js` (e.g., `2024/day2.js`)
3. Set the correct day and year values automatically

### Running a Solution

```bash
# Default to 2024
DAY=1 YEAR=2024 npm run solve

# For other years
DAY=25 YEAR=2023 npm run solve
```

### Solution Template

The template includes:

- Basic input parsing
- Function structure for both parts
- Error handling
- Async/await pattern for data fetching

## Features

- Direct data fetching without local caching
- Returns raw input data as a string
- Validates input parameters
