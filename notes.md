A few notes I had when looking at the code. I know the codebase is small, so I'm not going to be like nitpicky about the structure or anything like that. This
is basically how I used to set up small projects. As you build more, you'll happen upon a rough structure that works well for you and you'll start setting up 
all your projects with that in mind. 

## The Env File
Stick all your secrets and keys and stuff in here. No reason to have it in a separate JSON file, that's just an extra level of work that you don't need to put in.
`dotenv` is already doing all the heavy lifting, let it do more and you don't have to deal with `fs` (which isn't bad or anything, but it's yet another dependency you're pulling.)
Stick your port in the env file too. This gives you more flexibility when you inevitably run this in a separate environment (like a VPS or in AWS or something).

Basically, a lot of devs use port 3000 to run services locally, but what if you already have services running on port 3000 in prod? Instead of having to make another commit,
you just switch the port in the `.env` file and you don't have to worry about pushing another commit for something so inconsequential. Separation of concerns. Always a good
practice regardless of the size of the project.

## Classes vs. Module System (and Nomenclature)
If you notice, I've completely replaced the GoogleService class with a module system. In JS land, we're not stuck with OOP like we are in Python, so we get some more room
to explore what JS is actually good at (not a whole lot, but where there are strengths we use them). Classes in JS aren't really that bad 
(I mean, they kind of are, but that's a long topic), but an area where JavaScript excels is its module system, especially in the Node runtime. Use that to your advantage. The use case
you've used here is actually fine for classes (I personally do use classes when making services), so here it's more of a preference thing, but utilizing JS's module
system should always be on your mind. 

Let's talk nomenclature real quick, because this is stupid but important. I realize this is a small project, so the nomenclature really doesn't matter, but for working with other 
people, it starts to get *really* important. I figured I might as well throw this information out while we're here. In frontend projects (especially React, but I know this to be true Vue as well) lots of things get capitalized (though the folders typically don't). Pages, services, components, you name it, it's capitalized in a React/Vue/Svelte project
(but not in Angular...web dev is weird). In the backend world, lowercase is king. Why does this contrast exist? I can't speak for the frontend, I have no idea, but lowercasing 
everything in the backend is a Linux culture thing (where everything is lowercase as well). The less your hands move and the fewer keys you press, the better. Lower case everything
is just faster, and eventually became the norm because of this.

## Imports
When importing stuff, only import stuff. Look at this:

```js
const dotenv = require("dotenv").config();
const { google } = require("googleapis");
const sheets = google.sheets("v4");
const { JWT } = require("google-auth-library");
const fs = require("fs");
const env = process.env;
```

You're declaring variables and also importing stuff in the same block, it's a lot easier to see the flow of code and know what's going on when you separate these concerns out:

```js
const dotenv = require("dotenv").config();
const fs = require("fs");

const { google } = require("googleapis");
const { JWT } = require("google-auth-library");

const env = process.env;
const sheets = google.sheets("v4");
```

Bonus points for the following:
1. Alphabetizing your imports
2. Splitting up default imports and named imports

## Unused Vars and Unnecessary Vars
Take a look at the two code blocks: 

```js
app.get("/ara", async (req, res, next) => {
  try {
    const response = await googleService.getAraSheet();
    res.send(response);
  } catch (error) {
    console.error(error);
  }
});
```

```js
app.get("/ara", async (_, res) => {
  try {
    const response = await googleService.getAraSheet();
    res.send(response);
  } catch (error) {
    console.error(error);
  }
});
```

I replaced `req` with an underscore, and got rid of next. It's a convention in most mainstream languages (if not all of them, I personally haven't seen an exception) to replace
unused function params with an underscore. IDEs do make them dark to show they're being unused, but in software, we don't only write code to do stuff. Humans read code 
(including the people who wrote the code), so we also want to signal *intent* as much as we possibly can. Dark text shows the variable is unused. An underscore shows
that the variable is *supposed* to be unused. Quite the difference. And it's also easier to read. 

On the topic of `next`, only use that param when you need it. Here's an example:

```js
const securityCheck = (req, res, next) => {
  const cookie = extractCookieSomehow(req);
  if (cookieIsGood(cookie)) {
    return next();
  }

  return res.status(401).json({msg: "Your cookies are not welcome here!"});
}

app.get("/ara", [securityCheck] async (_, res) => {
  try {
    const response = await googleService.getAraSheet();
    res.send(response);
  } catch (error) {
    console.error(error);
  }
});
```

The `next` function simply calls the next middleware until the end of the chain. If there's no more middleware (i.e. you're fulfilling the end of the request), `next` has no purpose.
If that makes absolutely no sense, that is okay. Express middleware is honestly something you could get a PhD in, it can get really complex and hard to figure out. The only
reason I've ever had to learn it is because Astria had multiple levels of authentication and the only sane way to handle that was a bunch of security middleware
(which is what most middleware is for anyway).

## Required to Use `require`?
Don't use `require`. That's all.

Okay, kidding, but like...not actually? `require` is a bit of a relic from the past (remember, 1 real life year is 40 JavaScript years, which means we stopped 
using `require` 160 years ago, in the trenches of 2019). In order to make the JS world a little more consistent, the NodeJS Foundation (now known as the OpenJS Foundation,
the trenches of 2019 merged the NodeJS Foundation and the JS Foundation into one) decided it would be cool if NodeJS supported all the new and fancy ECMAScript standards
for browsers. And it **was** cool. Now we can used named imports in NodeJS! And default imports as well, though that's not too different from `require`, but under the hood,
performance is generally better (gets better with bigger modules). Use ES6 modules (import and export), they're better than `require` in every way, except one:

You can't compute exports during runtime. The last time you had to do that was never, so it's really not a problem.

How many times have I tried to compute exports? Once, but only because I thought it was cool. It ended up being a total pain in the ass. Don't be like me.

## Prepping for Deployment and Folder Structure
`npm test` is typically reserved excusively for testing, again, another convention. But where there are conventions, there are reasons people cared so much. Predictability
is the name of the game in software, so having your start scripts in `start` or even something like `dev` and `prod` is more predictable than having it in `test`, which
is used for E2E and unit testing and such. 

Also, upon cloning, `npm i` did not install any of the dependencies, because none of them were in the `package.json`. We always
want dependencies to be in the `package.json` so that we manage them project by project instead of globally. On a personal computer, somebody could have Express 4.7.5 installed,
while the production machine might have Express 3 or maybe even not have a global copy at all (more likely). If you deploy your project on that machine, it's not going to 
work until you've installed Express 4. But if you install Express 4 globally, then you might break the other software on the prod machine that relied on Express 3. Instead of messy
dependency management, we instead opt to install dependencies locally unless they're a literal runtime (like Node, TS-Node, or Nodemon). Everytime you want a new dependency,
go to the project root directory, type `npm i dependencyname` and it'll automatically be added to the `package.json`. Then, when you deploy the project, you can just run `npm i`
in the root directory after you clone it, and you'll have all your dependencies installed! EZ.

As far as folder structure goes, like I said, this is isn't super strict, but at the very least, you'll want all the actual source code in the `src` folder. Keeps
things nice and tidy, and you don't have to worry about conflicts with your typical root stuff (config files and such) and the actual source code. Also makes it easier
to set up all the nice things like a `jsconfig.json` and just saying "yeah, all my source is in this one folder and now that's the only path I have to specify".

Also, commit your `package-lock.json` (this is automatically generated after you install a package).

## Commit the Package Lock?
Yep. Commit that shit. Upon a package installation, the `package.json` will contains all the dependencies, but will put fancy characters next to the versions. 
Take a look at these deps (I made them up, most installs will only have the `^` character next to them):

```json
"dependencies": {
  "dotenv": "^16.1.4",
  "express": "~4.18.2",
}
```

Look at the `dotenv` version number: 16.1.4

It has a major version, a minor version, and a patch number. The `^` character locks the major version, so if you run `npm update dotenv`, it'll only update
to the highest minor version and patch number, but if major version 17 is out, it won't update to that. The `~` character locks the major AND minor versions,
so `npm update` is only going to update the patch number. This is a handy system, but what if you need to build the dependency chains? It doesn't say
anything about those. That's where the `package-lock.json` comes in. It says exactly what the dependency chains are for each package, so if you commit that,
You know that you're using the same exact dependencies in dev and prod. So say you're using `dotenv` 4.18.2, but had to update one of its dependencies
because of a security hole. If you want production to use that same updated dependency, you'll commit your package lock.
