# Github Greeter

Greets users when they make there first issues. Forked from [`actions/first interaction`](https://github.com/actions/first-interaction)

# Usage

See [this file for an example](https://github.com/JJ/dummy-actions-3/blob/master/.github/workflows/pr-greeting.yaml)

```yaml
name: "Issue Greeter"
on: [issues]

jobs:
  issue-greeter:
    runs-on: ubuntu-latest
    steps:
      - name: "Greeter"
        uses: anishanne/greeter@releases/v0
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          pr-message: "![](https://cdn.anishdoes.dev/githublight.png)\nHey @{user}! Welcome to the **Greeter** repo on **Github**. If you have a question sure to check out our [wiki](https://github.com/anishanne/
```

This action will check if its a users first issue to the rep and if it is, greet them. It comes prepackaged with 2 "welcome" images as well as a basic welcome message to get you started. 

## Welcome Images
This action comes with 2 welcome images, you can also substitute in your own image or compeltly remove the image feature.
- Light Theme (Available at `cdn.anishdoes.dev/githublight.png`)
![](https://cdn.anishdoes.dev/githublight.png)
- Dark Theme (Available at `cdn.anishdoes.dev/githubdark.png`)
![](https://cdn.anishdoes.dev/githubdark.png)

## Example
![First Issue Greeting](img/example.png)


# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
