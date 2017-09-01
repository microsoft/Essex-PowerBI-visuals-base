#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const path = require('path');
const targz = require('targz');
const _ = require('lodash');
const Guid = require('guid');
const visualName = process.argv[2];

const BUNDLE_URL = 'https://essexpbipublic.blob.core.windows.net/create-powerbi-visual-bundles/newvizbundle.tar.gz';
const imageFileName = path.join(process.cwd(), "essex-pbi-visual.tar.gz");
const visualPath = path.join(process.cwd(), visualName);
const visualGuid = Guid.raw().replace(/-/g, '');
console.log("Creating Essex PowerBI Visual: %s", visualName, visualGuid);

function downloadNewVisualImage() {
    return new Promise((resolve, reject) => {
        const imageFile = fs.createWriteStream(imageFileName);
        const request = https.get(BUNDLE_URL, function(response) {
          response.pipe(imageFile);
          imageFile.on('finish', function() {
            imageFile.close(resolve);  // close() is async, call cb after close completes.
          });
        }).on('error', function(err) { // Handle errors
            fs.unlink(imageFileName); // Delete the file async. (But we don't check the result)
            reject(err);
        });
    });    
}

function decompressImage() {
    return new Promise((resolve, reject) => {
        targz.decompress({
            src: imageFileName,
            dest: visualPath,
        }, function(err) {
            if(err) {
                reject(err);
            } else {
                resolve();
            }        
        });
    });
}

function renderTemplates() {
    const renderTemplate = (file) => {
        const templatePath = path.join(visualPath, file);
        const templateContent = fs.readFileSync(templatePath, { encoding: 'utf-8' });
        const rendered = _.template(templateContent)({ 
            name: visualName,
            guid: visualGuid,
        });
        fs.writeFileSync(templatePath, rendered, { encoding: 'utf-8' });
    }
    
    renderTemplate('package.json');
    renderTemplate('pbiviz.json');
}

downloadNewVisualImage()
.then(() => decompressImage())
.then(() => renderTemplates());
