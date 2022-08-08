# Contributing

## Creating a new hook

### New hook

From the root of the project run `yarn new`. This should start the process to create a new hook and set up the package.

### Current hooks fixes / updates

Make sure you have Yarn package manager installed globally on your machine.

From the root of the project:

- run `yarn install`
- run `yarn build`

### Adding Changeset information

- Changeset information is a **must** when you are making a change to `rooks`(your change can be a new feature or a bug fix).
- To add a changeset -> run `yarn changeset` in the project root.
- It lets you to select _which packages needs to be bumped into which version_.
- After answering the questions in the cli, you can see your changeset information in the `.changeset` folder in the root of our project folder.
- Create a commit after adding the changeset information.
- It's that simple.

## Contributing Guidelines

When adding a new hook, please make sure that

- All hooks must contain example sandboxes and test cases

- Readmes must contain usage snippets, codesandbox JSX embeds, arguments in a table format and must contain return values
