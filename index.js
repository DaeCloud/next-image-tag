//express server
const express = require('express');
const app = express();
const port = 3000;
const request = require('request');

// .env
require('dotenv').config();

app.get('/:image', (req, res) => {
    const image = req.params.image;

    // get request to docker registry for image tags with basic auth
    request.get({
        url: `${process.env.DOCKER_REGISTRY}/v2/${image}/tags/list`,
        auth: {
            username: process.env.DOCKER_USERNAME,
            password: process.env.DOCKER_PASSWORD
        },
        json: true
    }, (error, response, body) => {
        if(body.tags){
            tags = body.tags;
            
            // remove "latest" tag from array
            tags.pop(tags.indexOf('latest'));

            tags.sort((a, b) => {
                const [majorA, minorA, patchA] = a.split('.').map(Number);
                const [majorB, minorB, patchB] = b.split('.').map(Number);
              
                if (majorA !== majorB) {
                  return majorB - majorA;
                } else if (minorA !== minorB) {
                  return minorB - minorA;
                } else {
                  return patchB - patchA;
                }
            });

            res.send(tags[0]);
        } else {
            res.send(body);
        }
        
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});