const path = require('path');
const targz = require('targz');
const version = require("../package.json").version;

// compress files into tar.gz archive 
targz.compress({
    src: path.join(__dirname, '../empty-visual'),
    dest: path.join(__dirname, `../newvizbundle_${version}.tar.gz`),
}, function(err){
    if (err) {
        console.log(err);
    } else {
        console.log("Done!");
    }
});
