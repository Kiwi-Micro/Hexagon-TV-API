# Contributing to Hexagon TV

If you wish to contribute, please make sure you follow the guidelines set below. There is a high chance we will not accept a pull request if it does not follow our guidelines.

---

## Documentation

Please read the [DOCUMENTATION.md](DOCUMENTATION.md).

---

## Tech Stack

The API is written in TypeScript with Express.js. The database is SQLite, libsql and Turso. For file uploads and hosting, we use UploadThing. For authentication, we use Clerk.

- TypeScript
- Express.js
- libsql, Turso and SQLite
- UploadThing
- Clerk

---

## Guidelines

- Write clear, concise commit messages.
- Ensure all tests pass before submitting a pull request.
- Make sure any changes you submit are tested properly!
- Our IDE of choice for this project is VS Code. If you use another IDE, do not include any of the project settings with your commits.

---

## Style Guide

- All indents are TAB characters, not spaces.
- Braces start on the same line end on a new-line (See Code Below).
- A function/if-else block containing only one statement should be surrounded by braces, unless it is a if-else block ONLY returning to escape a function (See Code Below).
- Ternary statements should be used where suiting (See Code Below).
- All names should be camelCase (See Code Below).
- If you are exporting a function or variable, it should be exported at definition (See Code Below).

```ts
export function getRating(ratingInfo) {
	if (ratingInfo == null || ratingInfo == "") return;

	return ratingInfo ? ratingInfo.description : "Rating not found";
}
```
