workflow "New workflow" {
  on = "push"
  resolves = ["Deploy"]
}

action "Install" {
  uses = "docker://culturehq/actions-yarn:latest"
  args = "install"
}

action "Deploy" {
  needs = "Install"
  uses = "docker://culturehq/actions-yarn:latest"
  secrets = ["ZEIT_TOKEN"]
  args = "run deploy"
}
