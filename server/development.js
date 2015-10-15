/*
    These environment variables are not hardcoded so as not to put
    production information in a repo. They should be set in your
    heroku (or whatever VPS used) configuration to be set in the
    applications environment, along with NODE_ENV=production
 */

module.exports = {
    // "DATABASE_URI": process.env.MONGOLAB_URI,
    // "SESSION_SECRET": process.env.SESSION_SECRET,
    "AWS": {
        "clientID": 'AKIAJHA456NW2NEZW7FA',
        "clientSecret": "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",
        "bucketName": "commoncanvas"
    }
};