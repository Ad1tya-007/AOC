# Setup Guide

## Environment Setup

To use the API for fetching Advent of Code input data, you need to set your session token as an environment variable:

### Option 1: Set in your shell

```bash
export AOC_SESSION=your_session_token_here
```

You can add this to your `.zshrc` or `.bash_profile` to make it persistent.

### Option 2: Create a .env file (recommended)

Create a `.env` file in the root directory with the following content:

```
AOC_SESSION=your_session_token_here
```

Then install and use the dotenv package:

```bash
npm install dotenv
```

And add at the top of your solution files:

```javascript
require('dotenv').config();
```

## Finding Your Session Token

1. Log in to [Advent of Code](https://adventofcode.com/)
2. In your browser, open Developer Tools (F12 or Right-click > Inspect)
3. Go to the Application/Storage tab
4. Look for Cookies and find the "session" cookie for adventofcode.com
5. Copy the value as your token

This token is personal and should not be shared or committed to version control.
