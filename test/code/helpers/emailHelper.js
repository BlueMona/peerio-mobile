const quotedPrintable = require('quoted-printable');
const https = require('https');
const request = require('request');

function getUrl(url) {
    console.log('Requesting url', url);
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            const { statusCode } = res;
            let error;
            if (statusCode !== 200) {
                error = new Error(`${url} request fail. Status Code: ${statusCode}`);
            }
            if (error) {
                console.error(error.message);
                res.resume();
                reject(error);
                return;
            }
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                resolve(rawData);
            });
        }).on('error', (e) => {
            console.error(e);
            reject(e);
        });
    });
}

function deleteRequest(url) {
    console.log('Sending delete request', url);
    return new Promise((resolve, reject) => {
        request.del(url, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

/**
 * Retrieves inbox items
 * @param {string} name - mailbox name
 * @returns {Promise<object>}
 */
function getInbox(name) {
    console.log(`maildrop: requesting inbox ${name}`);
    return getUrl(`https://maildrop.peerio.com/api/inbox/${name}`)
        .then(JSON.parse);
}

/**
 * Retrieves an email
 * @param {string} name - mailbox name
 * @param {string} id - received email id
 * @returns {Promise<object>}
 */
function getEmail(name, id) {
    console.log(`maildrop: requesting email ${id} in inbox ${name}`);
    return getUrl(`https://maildrop.peerio.com/api/inbox/${name}/${id}`)
        .then(JSON.parse)
        .then(email => {
            email.body = quotedPrintable.decode(email.body);
            return email;
        });
}

function deleteEmail(name, id) {
    name = normalizeName(name); // eslint-disable-line no-param-reassign
    return deleteRequest(`https://maildrop.peerio.com/api/inbox/${name}/${id}`);
}

/**
 * Finds and returns latest email with specific subject.
 * @param {string} name - mailbox name
 * @param {string} subject
 * @returns {Promise<?object>}
 */
function findEmailWithSubject(name, subject) {
    return getInbox(name).then(inbox => {
        for (let i = 0; i < inbox.length; i++) {
            if (inbox[i].subject === subject) return inbox[i].id;
        }
        return null;
    });
}

function normalizeName(name) {
    if (name.includes('@')) {
        return name.substring(0, name.indexOf('@'));
    }
    return name;
}
/**
 * Makes several attempts to retrieve an email with specific subject during set timeout
 * @param {string} name - mailbox name or full email
 * @param {string} subject
 * @param {number} [timeout=60000]
 */
function waitForEmail(name, subject, timeout = 60000) {
    name = normalizeName(name); // eslint-disable-line no-param-reassign
    const start = Date.now();
    return new Promise((resolve, reject) => {
        function makeAttempt() {
            console.log(`Attempting to find an email with subject: '${subject}' in mailbox '${name}'`);
            findEmailWithSubject(name, subject)
                .then((id) => {
                    if (id) return getEmail(name, id).then(resolve);
                    if (Date.now() - start > timeout) {
                        console.log('Email not arrived. Giving up.');
                        reject(new Error('Email not arrived. Giving up.'));
                    } else {
                        console.log('Email not arrived yet, waiting.');
                        setTimeout(makeAttempt, 1000);
                    }
                    return null;
                })
                .catch(reject);
        }
        makeAttempt();
    });
}

module.exports = { waitForEmail, getUrl };
