workflow "Deploy on Now" {
  on = "push"
  resolves = ["release"]
}

action "yarn-install" {
  uses = "borales/actions-yarn@master"
  args = "install"
}

action "cdwebsite" {
  needs = "yarn-install"
  uses = "actions/bin/sh@master"
  args = ["cd packages/website"]
}

action "updateDeps" {
  needs = "cdwebsite"
  uses = "borales/actions-yarn@master"
  args = "run update-deps"
}

action "preparewebsite"{
  needs = "updateDeps"
  uses = "actions/bin/sh@master"
  args = ["cd ../.."]
}

# Deploy, and write deployment to file
action "deploy" {
  needs = "preparewebsite"
  uses = "actions/zeit-now@master"
  args = "deploy  --no-clipboard  packages/website --team react-hooks > $HOME/$GITHUB_ACTION.txt"
  secrets = ["ZEIT_TOKEN"]
}

# Always create an alias using the SHA
action "alias" {
  needs = "deploy"
  uses = "actions/zeit-now@master"
  args = "alias --team react-hooks `cat /github/home/deploy.txt` $GITHUB_SHA"
  secrets = ["ZEIT_TOKEN"]
}

# Filter for master branch
action "master-branch-filter" {
  needs = "alias"
  uses = "actions/bin/filter@master"
  args = "branch master"
}

# Requires now.json in repository
action "release" {
  needs = "master-branch-filter"
  uses = "actions/zeit-now@master"
  secrets = ["ZEIT_TOKEN"]
  args = "alias --team react-hooks --local-config=./packages/website/now.json"
}