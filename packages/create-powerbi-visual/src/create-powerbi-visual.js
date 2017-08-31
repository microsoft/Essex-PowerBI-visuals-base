#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const targz = require('targz');
const _ = require('lodash');
const visualName = process.argv[2];

console.log("Creating Essex PowerBI Visual: %s", visualName);

// decompress files from tar.gz archive 
targz.decompress({
    src: path.join(__dirname, '../newvizbundle_0.0.1.tar.gz'),
    dest: visualName
}, function(err){
    if(err) {
        console.log(err);
    } else {
        const visualPath = path.join(process.cwd(), visualName);
        const pbivizJsonPath = path.join(visualPath, 'package.json');

        const renderTemplate = (file) => {
            const templatePath = path.join(visualPath, file);
            const templateContent = fs.readFileSync(templatePath, { encoding: 'utf-8' });
            const rendered = _.template(templateContent)({ name: visualName });
            fs.writeFileSync(templatePath, rendered, { encoding: 'utf-8' });
        }
        
        renderTemplate('package.json');
        renderTemplate('pbiviz.json');
    }
});
 