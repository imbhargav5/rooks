workflow "New workflow" {
  on = "push"
  resolves = ["Deploy"]
}

action "Install" {
  uses = "actions/npm@e7aaefe"
  args = "install"
}

action "Deploy" {
  needs = "Install"
  uses = "actions/npm@e7aaefe"
  secrets = ["ZEIT_TOKEN"]
  args = "run deploy"
}
