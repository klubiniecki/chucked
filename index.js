#!/usr/bin/env node
const fs = require("fs");
const fetch = require("node-fetch");
const colors = require('colors');
const appRoot = require('app-root-path');
const [,, ...args] = process.argv;

// Get all files in a given directory.
const getFiles = (dir, files_) => {
    const files = fs.readdirSync(dir);
    for (const i in files) {
        const name = dir + "/" + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
};

// Helper function to wrap strings at 80 characters.
const wrap = (s) => s.replace(new RegExp(`(?![^\\n]{1,80}$)([^\\n]{1,80})\\s`, 'g'), '$1\n');

// Get all files in /src dir or dir passed as an argument to cli.
const files = getFiles(`${appRoot}/${args.length > 0 ? args : 'src'}`, []);

// Select a random file.
const randomFile = files[Math.floor(Math.random() * files.length)];

(async () => {
    const categories = ['animal', 'career', 'dev', 'fashion', 'history', 'money', 'movie', 'political', 'science', 'travel'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const url = `https://api.chucknorris.io/jokes/random?category=${randomCategory}`;
    try {
        const response = await fetch(url);
        const json = await response.json();
        // Turn a Chuck Norris joke api response into a comment.
        const chuckJoke = `
/*
${json.value}
*/
 `;

        const chuckLog = colors.bold.green(`
  +--^----------,--------,-----,--------^-,
 |  🤠 Chuck is hiding in your code! 👊   O
 \`+---------------------------^----------|
   \`\\_,---------,---------,--------------'
     / XXXXXX /'|       /'
    / XXXXXX /  \`\\    /'
   / XXXXXX /\`-------'
  / XXXXXX /
 / XXXXXX /
(________(                
 \`------'     
`);
        // Append fetched joke to a random file and log chuck-awesome message.
        fs.appendFile(randomFile, wrap(chuckJoke), "utf8", () => { console.log(chuckLog) });
    } catch (err) {
        console.log(err);
    }
})();
