# GovTech Take Home Assignment

## Introduction

This is Tan Jing Sheng's implementation of the [GovTech SWE Take Home Assignment](https://github.com/bryanlohxz/swe-take-home-assignment).

Done on 5th March 2025

## Assumptions and Interpretations

1. Sorting Criteria

Ambiguity: Sorting is only mentioned as NAME or SALARY, always in ascending order. There is no mention of whether sorting can be combined (e.g., sorting first by SALARY and then by NAME in case of ties).

Assumption: If more than one sort key is provided (e.g., ["SALARY", "NAME"]), we apply sorting in the order given, prioritising the first key before moving to the next.

e.g. /users?sort=NAME&sort=SALARY will sort by NAME then SALARY is there is a tie.

2. Salary Range Handling

Ambiguity: The default values are 0.0 for min and 4000.0 for max. However, it's not explicitly stated what happens if min > max (e.g., /users?min=5000&max=4000).

Assumption: If min > max, return an empty list ("results": []), not an error.

3. Offset and Limit Behaviour

Ambiguity: There is no mentioning of behaviour when the offset exceeds the number of available records.

Assumption: If offset is greater than the available results, return an empty list ("results": []), not an error.

4. Concurrency and Scaling

Ambiguity: The requirement states that concurrent uploads are desirable but does not specify the expected behaviour when two uploads update the same user.

Assumption: The last successful upload overwrites the previous one (last write wins).

5. HTTP Response Codes

Ambiguity: Which HTTP status codes should be used for specific failures?

Assumption:

- `200 OK` → Successful operations.
- `500 Internal Server Error` → Unexpected failures.

## Setup

### Prerequisites

To set up and run the project, you need the following:

- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [pnpm](https://pnpm.io/) (Package manager, install via `npm install -g pnpm`)

Ensure that these dependencies are installed before proceeding with the setup.

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/tjingsheng/swe-take-home-assignment.git
   cd swe-take-home-assignment
   ```

2. Install dependencies using `pnpm`:

   ```sh
   pnpm install
   ```

3. Seed the database:

   ```sh
   pnpm run seed
   ```

   This will populate the database with initial test data.

   > Note: This shoud run automatically after `pnpm install`

4. Start the development server:

   ```sh
   pnpm run dev
   ```

This will run the application in development mode with live reload.

## API Endpoints

### Fetch Users

You can fetch user data using the following `curl` command:

```sh
curl -G "http://localhost:3000/users" \
     --data-urlencode "min=1000" \
     --data-urlencode "max=5000" \
     --data-urlencode "offset=10" \
     --data-urlencode "limit=50" \
     --data-urlencode "sort=NAME"
```

This request retrieves users whose salary falls between 1,000 and 5,000, with pagination controls (`offset=10`, `limit=50`) and sorted by name.

### Upload a CSV File

To upload a CSV file containing user data, use:

```sh
curl -X POST http://localhost:3000/upload \
     -H "Content-Type: application/x-www-form-urlencoded" \
     --data-urlencode "file=name,salary%0AAlex,3000.0%0ABryan,3500.0"
```

```sh
curl -X POST "http://localhost:3000/upload" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@./data/data.csv"
```

This sends a CSV file located at `./data/data.csv` to the server for processing.

## Explanation of Scripts

- **`pnpm run postinstall`**

  - Automatically runs the `seed` script after dependencies are installed, ensuring the database is populated without manual intervention.

- **`pnpm run dev`**

  - Starts the development server with `tsx watch`, which enables live reloading for TypeScript changes.
  - Uses `cross-env` to ensure the `NODE_ENV=development` variable is set across different OS environments.

- **`pnpm run seed`**

  - Runs the `seed.ts` script to populate the database with fake user data for testing.
  - Uses `faker-js` to generate realistic test data.

## Dependencies Overview

- **[`express`](https://expressjs.com/)**: Lightweight web framework for building APIs.
- **[`fast-csv`](https://c2fo.github.io/fast-csv/)**: Handles CSV parsing and processing.
- **[`multer`](https://github.com/expressjs/multer)**: Middleware for handling file uploads.
- **[`zod`](https://zod.dev/)**: Schema validation library for input validation.
- **[`@faker-js/faker`](https://fakerjs.dev/)**: Generates random test data.
- **[`tsx`](https://github.com/esbuild-kit/tsx)**: Runs TypeScript files without needing compilation.
- **[`cross-env`](https://github.com/kentcdodds/cross-env)**: Allows setting environment variables in a cross-platform manner.

# README.md from the original repositiory

## SWE Take Home Assignment

The goal of this task is to help us better understand your abilities, including how you think through problems, implement solutions, and approach challenges. It’s not just about completing the assignment but about demonstrating your technical strengths and creativity.

You have up to **5 days** to complete the assignment, starting from when you receive it. There’s no pressure to finish the entire assignment. Focus on showcasing your best work and the areas where you feel most confident.

Adapted from [GovTech ACE Hiring](https://github.com/GovTechSG/ace-hiring/blob/master/cds/swe-take-home.md)

## BACKGROUND

Develop a web application with the following HTTP endpoints.

> Path: `/users`
>
> Method: `GET`
>
> Params:
>
> - `min` - minimum salary. Optional, defaults to 0.0.
> - `max` - maximum salary. Optional, defaults to 4000.0.
> - `offset` - first result among set to be returned. Optional, defaults to 0.
> - `limit` - number of results to include. Optional, defaults to no limit.
> - `sort` - `NAME` or `SALARY`, non-case sensitive. Optional, defaults to no sorting. Sort only in ascending sequence.
>
> Description:
>
> Return list of users that match specified criteria and ordering. in JSON form:
>
> ```json
> {
>   "results": [
>     { "name": "Alex", "salary": 3000.0 },
>     { "name": "Bryan", "salary": 3500.0 }
>   ]
> }
> ```

> Path: `/upload`
>
> Method: `POST`
>
> Params:
>
> - Content Type: `application/x-www-form-urlencoded`
> - Form field name: `file`
> - Contents: CSV data. See below.
>
> Description:
>
> Return success or failure. 1 if successful and 0 if failure. If failure, HTTP status code should not be HTTP_OK.
> File upload is an all-or-nothing operation. The entire file’s changes are only applied after the whole file passes validation. If the file has an error, none of its rows should be updated in the database.
>
> ```json
> { "success": 1 }
> ```

- Both HTTP endpoints return `application/json` content type, and `HTTP_OK` if successful.
- If there is an error processing HTTP request, appropriate HTTP status code should be returned with the result body of the form `{ "error": "..." }` to include additional error description.
- CSV file is structured as follows.
  - **Two columns `NAME` and `SALARY`**
    - Name is text.
    - Salary is a floating point number, You do not need to ensure a specific number of decimal points.
    - Salary must be >= 0.0. All rows with salary &lt; 0.0 are ignored.
  - First row of the CSV file is always **ignored** and treated as a header row.
  - If there is a formatting error (ie. salary number cannot be parsed), or incorrect number of columns during input, the CSV file should be rejected. However, rows with salary &lt; 0.0 are skipped, without skipping the entire file.
- Names **must be unique** in the system. If there is already another user with the same name in the database during loading, the record in the database is replaced with the data from the file.
- The database should be **pre-loaded** with seed data on first invocation of the application.
- Bonus: It is not required but desirable to be able to process concurrent upload requests simultaneously.

These are not part of the requirements, but do keep these in mind, and also be prepared to explain your approach on the following:

- What kind of testing would you perform on the application in addition to unit testing?
- How would you scale up the system to handle potentially millions of files?
- CSV files can be very large and take a long time to process. This can be a problem using HTTP POST calls. How would you update the design to handle HTTP POST requests that can potentially take a long time to execute?

**Acceptance Criteria 1**

- When the application starts up, it should be pre-loaded with testable data.
- Expose `/users` endpoint that returns users with valid salary (`0` &lt;= salary &lt;= `4000`)
- Example json response:

```json
{
  "results": [
    { "name": "Alex", "salary": 3000.0 },
    { "name": "Bryan", "salary": 3500.0 }
  ]
}
```

- Additional sub-criterias:
  - 1.1: `min` and `max`
  - 1.2: `sort`. Also include illegal order parameters.
  - 1.3: `offset` and `limit`

**Acceptance Criteria 2**

- Upload with a properly structured CSV file. You may include any data in the csv file.
- File should include some new data that is not in the database, and some that overwrites the database.
- File should include rows with negative and 0.00 salary.
- `/users` should work as expected after the upload and that there are new results returned as well as previous results that have been overwritten. Negative rows should be ignored in the input and 0.0 should be updated and returned.

Example csv file:

```
Name, Salary
John, 2500.05
Mary Posa, 3000.00
```

**Acceptance Criteria 3**

- Uploads with an improperly structured CSV file that should contain at least some good rows.
- File should be rejected and none of the good rows should have been applied.

## TASK

Use [express](https://expressjs.com/) for the project. You may use JavaScript or TypeScript.

## APPROACH

This is a simple assignment, so please feel free to apply coding best practices and technical designs that can demonstrate your understanding.

## SUBMISSION

Please upload your code to GitHub and email us the link of the public repository. You can also include other documents that you deem necessary for the submission, good luck! ☺
