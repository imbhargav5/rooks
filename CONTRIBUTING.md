# Contributing to Our Project

First of all, thank you for considering contributing to our project! We appreciate your time and effort. Here's a more elaborate guide on how to contribute effectively to our project.

## Creating a New Hook

### New Hook

To create a new hook, please follow these steps:

1. Ensure you are in the root of the project.
2. Run `yarn new` in your terminal. This command will start the process to create a new hook and set up the package for you.

### Updating Existing Hooks or Fixing Issues

In case you want to update an existing hook or fix any issues, please make sure you have Yarn package manager installed globally on your machine.

From the root of the project, perform the following steps:

1. Run `yarn install` to install all required dependencies.
2. Run `yarn build` to compile the project.

### Adding Changeset Information

Adding changeset information is crucial when you are making a change to `rooks` (your change could be a new feature or a bug fix). To add a changeset:

1. Run `yarn changeset` in the project root.
2. The CLI will guide you through selecting which packages need to be bumped and to which version.
3. After answering the questions, you will find your changeset information in the `.changeset` folder located in the root of the project.
4. Create a commit after adding the changeset information.

That's it! You've successfully added the changeset information.

## Contributing Guidelines

When adding a new hook, please ensure the following:

- All hooks must contain example sandboxes and test cases.
- Readmes must contain:
  - Usage snippets.
  - Codesandbox JSX embeds.
  - Arguments in a table format.
  - Return values.

We hope these guidelines help you contribute effectively to our project. Your contributions are highly valued, and we look forward to seeing your work. If you have any questions or need assistance, please do not hesitate to ask.

Once again, thank you for your contributions!
