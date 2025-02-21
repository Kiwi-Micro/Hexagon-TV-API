# Contributing to Hexagon TV

If you wish to contribute, please make sure you follow the guidelines set below. There is a high chance we will not accept a pull request if it does not follow our guidelines.

---

## Documentation

Please read the [DOCUMENTATION.md](DOCUMENTATION.md).

---

## Tech Stack

- **Backend**: SQLite/Turso, TypeScript, Express, Clerk
- **Frontend**: React, TypeScript, CSS
- **Database**: SQL Lite (Via the Typscript - Turso API)
- **CDN**: UploadThing
- **Hosting**: Linode (API), Vercel (Site), Turso (Database), UploadThing (CDN)
- **Authentication**: TypeScript, Express, Clerk

---

## Guidelines

- Write clear, concise commit messages.
- Ensure all tests pass before submitting a pull request.
- Make sure any changes you submit are tested properly!
- Our IDE of choice for this project is VS Code. If you use another IDE, do not include any of the project settings with your commits, unless they are urgent!
- If you are fixing a bug please make sure there is an issue open in the correct project regarding the bug you are working on.

---

## Style Guide

- All indents are TAB characters, not spaces.
- Braces start on the same line end on a new-line (See Code Below).
- A function/if-else block containing only one statement should be surrounded by braces, unless it is a if-else block ONLY returning to escape a function (See Code Below).
- Ternary statements should be used where suiting (See Code Below).

### Example:

```ts
async function getRating(ratingInfo) {
	if (ratingInfo == null || ratingInfo == "") return;

	return ratingInfo ? ratingInfo.description : "Rating not found";
}
```
