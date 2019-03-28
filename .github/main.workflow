workflow "Update Zeit-Instance" {
  on = "push"
  resolves = ["GitHub Action for Zeit"]
}

action "GitHub Action for Zeit" {
  uses = "actions/zeit-now@666edee2f3632660e9829cb6801ee5b7d47b303d"
  secrets = ["ZEIT_TOKEN"]
}

action "alias" {
  needs = ["deploy"]
  uses = "actions/zeit-now@666edee2f3632660e9829cb6801ee5b7d47b303d"
  args = "alias"
  secrets = [
    "ZEIT_TOKEN",
  ]
}
