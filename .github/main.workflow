workflow "New workflow" {
  on = "push"
  resolves = ["Deploy"]
}

action "Install" {
  uses = "docker://culturehq/actions-yarn:latest"
  args = "install"
}

action "Bootstrap" {
  needs = "Install"
  uses = "docker://culturehq/actions-yarn:latest"
  args = "bs"
}


action "Deploy" {
  needs = "Bootstrap"
  uses = "docker://culturehq/actions-yarn:latest"
  secrets = ["ZEIT_TOKEN"]
  args = "run deploy"
}
