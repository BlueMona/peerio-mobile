const fs = require('fs');
const glob = require('glob');

const keys = JSON.parse(fs.readFileSync('locales/el.json'));


glob('app/components/**/*.js', (err, files) => {
    for (const i of files) {
        const file = fs.readFileSync(i, 'utf8');
        const re = /[^r]t\('(.*?)'/gm;
        let matches = re.exec(file);
        console.log(i);
        while (matches != null) {
            if (typeof keys[matches[1]] === 'undefined') {
                console.log(matches[1]);
            }
            matches = re.exec(file);
        }
    }
});

