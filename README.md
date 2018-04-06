# Steemit.lol
You can use Steemit.LOL to create original memes and post them to the Steem Blockchain. Our in-house moderator team will determine which memes get published and which memes get hidden.  
Bring your dankest original memes and get published today!

## How to Contribute

Create a post on www.utopian.io containing either a New Development or Bug Hunting Contribution.  
There are other methods to contribute but for now we'd like to focus on development. See other contribution rules here www.utopian.io/rules

###  Development Rules
Acceptable submissions in the development category include (1)Bug Fixes; (2)New Features.

   * Contributions must have a comprehensible commit history. Projects or updates submitted in a single commit will not be accepted.
   * Outdated or low quality code will lead to rejection.
   * Generated code or other results of automated processes will not be accepted.
   * Submitted projects must have unique value. Redundant projects will not be accepted.
   * Trivial code snippets, example code or simple templates will not be accepted.
   * Bug Fixes and New Features must be submitted via Pull Requests. The Pull Request must have been merged within the past 14 days.
   * Updates on Own Projects can be committed directly, without a Pull Request. Commits must not be older than 14 days.
   * Bug Fixes for contributor�s Own Projects will not be accepted, unless the Bugs were caused by third party dependencies.
   * The repository must contain a readme file with usage and install instructions, as well as an appropriate open source license.

### Bug Hunting Rules
Acceptable contributions in this category must include Bug Reports for Steemit.lol.

   * The repository on GitHub must accept issues.
   * Bug Reports for projects in pre-alpha stage will not be accepted.
   * Cosmetic issues that do not affect the functionality of the software will not be accepted.
   * Submissions must include sufficient detail to reproduce the bug.
   * Submissions must Include information about the debugging technical environment such as Device, Operating System, Browser and Application versions used.
   * Submissions must refer to bugs on the latest released version of the application (not older versions).
   * Submission title must briefly describe the occuring issue and include searchable keywords.
   * Bug Reports previously submitted as issues on GitHub (either by the contribution author or another party), will not be accepted. Approved Bug Reports will automatically be published on GitHub.
   * Submissions should include screenshots, video recordings or animated GIFs if they can help to describe and understand the bug reported.

Be sure to include the github repository AND the related information necessary to be credited for your contribution.

## Steemit.lol Edits
- Authenticate with SteemConnect/Logout
- Trending + latest post feeds
// change to only show memes from steemit.lol
- Logged In user profile + 'my blog' feed
// change to show only published memes in feed
- @username page with profile info + blog feed
// Change to show only published memes in profile
- Create Top Level Post
// Add Meme Generator & memes
- Upvote Top Level Post from feed
// change to slider (-100 & +100; increments of 20%)
- Single Page for posts + comments thread
- Upvote + comment on single page

## Steemit.lol Updates
- All post submissions go to Pending category.
- Once voted by a moderator, send to Published
- Add Steemit.lol Votebot (Upvote Published Posts Only)

## setup & install
- install node.js & NPM - [https://nodejs.org/en/](https://nodejs.org/en/)
- clone repo
- Go to [https://v2.steemconnect.com/dashboard](https://v2.steemconnect.com/dashboard) and create a new app, it currently costs 3 STEEM.
- add the Redirect URI - http://localhost:3000/auth/
- open ```config.example.js``` and rename to ```config.js``` enter your ```client_id``` from steemconnect and redirect uri to 'http://localhost:3000/auth/', update the session secret to a new secure random string
- npm install // to download dependencies
- npm start // run the project on default port 3000
- navigate to localhost:3000 in your browser
- click on the blue 'login with steemconnect to authenticate your app'

