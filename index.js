const sslCertificate = require('get-ssl-certificate')

var path = require('path');
const express = require('express')
const app = express()
const port = 8443

app.get('/', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/favicon.ico', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname + '/favicon.ico'))
})

app.use('/assets', express.static('assets'))

app.get('/cert/:certUrl', function (req, res) {
    url = req.params.certUrl;

    cert = sslCertificate.get(url);

    sslCertificate.get(url).then(function (certificate) {
        res.status(200)
        var certData = {
            fingerprint: certificate.fingerprint,
            pem: certificate.pemEncoded,
            raw: certificate.raw
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(certData));
    }).catch(function (error) {
        res.status(404)
        res.send('URL not found or service not encrypted')
    });
})

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)

    }
})

module.exports = app