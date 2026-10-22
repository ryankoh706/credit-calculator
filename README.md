# Credit Calculator

A practice project for the AI video editor. It prices the app's credit system: pick a plan, enter what a creator does in a month, and it shows the credits used, what the AI costs us, the profit, and which features make or lose money.

We use this project to practice the GitHub testing routine we'll follow for the full app.

## What's in here

| File | What it is |
| --- | --- |
| `index.html` | The page you see in the browser |
| `credits.js` | The pricing "brain": every plan, price and credit cost lives here |
| `credits.test.js` | 11 automatic checks that `credits.js` does the math right |
| `package.json` | Tells GitHub how to run the tests (`npm test`) |
| `.github/workflows/test.yml` | Tells GitHub to run the tests on every change |

## Our testing routine

1. **Every change gets tested automatically.** When anyone changes a file, GitHub runs the 11 tests. Check the **Actions** tab: a green ✓ means everything passed; a red ✗ means something broke, and the log says which test failed.
2. **Big changes go through a pull request.** Make the change on a new branch, open a pull request, and wait for the green ✓ before clicking **Merge**. Never merge a red ✗.
3. **Check the live page after merging.** GitHub Pages updates the website a minute or two after a merge.

## See it live

Settings → Pages → Source: **Deploy from a branch** → Branch: **main**, folder **/(root)** → Save. The link appears at the top of that page after a minute or two.

## Change a price

Open `credits.js` and edit a number in `PLANS` or `ACTIONS`. If a test fails afterwards, either the change was a mistake, or the price changed on purpose and the test needs updating to match.
