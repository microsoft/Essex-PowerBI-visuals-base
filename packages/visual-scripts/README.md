
# @essex/powerbi-visual-scripts

This package contains scripts for building PowerBI visuals using the Essex PowerBI build system.
This build system is designed to emulate the high-level features of the PowerBI-visuals-tools, including the developer visual and bundling capabilities, but using webpack and more normative Typescript idioms (e.g. excluding namespaces, allowing imports).

The scripts here are automatically included when executing `create-powerbi-visual <name>`. To add them manually:

`npm install @essex/powerbi-visual-scripts --save-dev`

Edit package.json:
```
{
  "scripts" : {
    "install-certificate": "essex-powerbi-visual-scripts install-certificate",
    "start": "essex-powerbi-visual-scripts start",
    "package": "essex-powerbi-visual-scripts package"
  }
}
```

The certificate used by this tool is the same as in the official PowerBI-visuals-tools project. To install the certs, execute: `npm run install-certificate`. The certificate should be added to your cert-store and trusted in order to use the PowerBI developer visual.