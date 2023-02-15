## Getting Started
To get a copy of the repository locally:
```bash
git clone https://github.com/Hack4Impact-Princeton/alp-portal.git
```

### MongoDB Setup
Create a local environment file:
```bash
cp .env.local.example .env.local
```

The MONGODB_URI connection string should be: "mongodb+srv://<username>:<password>@alp-portal.hh41pen.mongodb.net/?retryWrites=true&w=majority"

## Contributing to the Repository
Create a new, local branch to make changes
```bash
git branch <name-issue number>
```
```bash
git switch <name-issue number>
```
To test locally: ```npm run dev```

Viewing all your local changes:
```bash
git checkout
```

Staging and Commiting:
```bash
git add <all files you made changes to>
```
```bash
git commit
```
Write your commit message
```bash
git -–set-upstream origin <branch-name>
```
