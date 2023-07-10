require('dotenv').config({ path: './.env' });

const express = require('express');
const axios = require('axios');
const { isLocalHost } = require('./helpers');

const hosts = JSON.parse(process.env.HOSTS || '[]').map((host) => host.toLowerCase());

function isServerHost(host) {
    return isLocalHost(host) || hosts.includes(host.toLowerCase());
}

const app = express();
app.disable('x-powered-by');

// disable cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/proxy/*', function (req, res) {
    const url = req.params[0];
    console.log('url', url);

    const headers = req.headers;

    // Only rewrite the host header if the req host does not match the server host
    if (isServerHost(headers.host)) headers.host = req.params.host;

    axios({
        method: req.method,
        url: url,
        headers: req.headers,
        data: req.body,
        params: req.query
    }).then((response) => {
        res.status(response.status).send(response.data);
    }).catch((err) => {
        res.status(err?.response?.status || 500).send(err?.response?.data);
    });
});

app.listen(process.env.PORT || 3838, () => {
    console.log('Server running on: http://localhost:3838');
});