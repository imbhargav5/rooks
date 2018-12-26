workflow "New workflow" {
  on = "push"
  resolves = ["Deploy"]
}

action "Install" {
  uses = "docker://culturehq/actions-yarn:latest"
  args = "install"
}

action "PrepareDeploy" {
  needs = "Install"
  uses = "docker://culturehq/actions-yarn:latest"
  args = "prepare:deploy"
}


action "PrepareDeploy" {
  needs = "Install"
  uses = "docker://culturehq/actions-yarn:latest"
  secrets = ["ZEIT_TOKEN"]
  args = "run deploy"
}
