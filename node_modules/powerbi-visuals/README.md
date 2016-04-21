# Microsoft Power BI visuals
[![Build status](https://ci.appveyor.com/api/projects/status/77d940234217vpap/branch/master?svg=true)](https://ci.appveyor.com/project/powerbi-gitbot/powerbi-visuals)
[![Build Status](https://travis-ci.org/Microsoft/PowerBI-visuals.svg?branch=master)](https://travis-ci.org/Microsoft/PowerBI-visuals)

The Microsoft Power BI visuals project provides high quality data visualizations that you can use to extend [Power BI](https://powerbi.microsoft.com/).  The project contains over 20 visualization types, the framework to run them, and the testing infrastructure that enables you to build high quality visualizations.  The framework provides all the interfaces you need to integrate fully with Power BI's selection, filtering, and other UI experiences.  The code is written in [TypeScript](http://www.typescriptlang.org/) so it's easier to build and debug. Everything compiles down to JavaScript and runs in modern web browsers.  The visuals are built using [D3](http://d3js.org/) but you can use your favorite technology like [WebGL](https://en.wikipedia.org/wiki/WebGL), [Canvas](https://en.wikipedia.org/wiki/Canvas_element), or [SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics). This gives you everything you need to build custom visualizations for Power BI.

## What is included

1. Source code of all the visuals used in Power BI.
2. A Playground app to help you try out the existing visuals, and experiment with the ones you have created.

## Getting Started

### Prerequisites

To build the library and run the sample application you will need:

- [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git#Installing-on-Windows)
- [Node.js](https://nodejs.org/download/)
- Recommended IDE - [Visual Studio Community 2015](https://www.visualstudio.com/vs-2015-product-editions) (Free for use)
 -  Be sure to install the "Microsoft Web Developer Tools" optional feature. To install, go to Add/Remove Programs, right-click on Visual Studio, select Change, then Modify. Check the "Microsoft Web Developer Tools" checkbox and finish the install. 
 -  You can install [VSIX Package](https://github.com/Microsoft/PowerBI-visuals/blob/master/tools/VSIXExtensions/VisualTemplate.vsix?raw=true) and use Visual Studio Template from it to create new Visual.

### One-Time Setup
In order to build the Power BI visuals, ensure that you have [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git#Installing-on-Windows) and [Node.js](http://nodejs.org/download/) installed.

Install gulp if not present:

```
npm install -g gulp
```

Clone a copy of the repo:

```
git clone https://github.com/Microsoft/PowerBI-visuals.git
```

Change to the PowerBI-visuals directory:

```
cd PowerBI-visuals
```

Install dev dependencies:

```
npm install  # This command will install all necessary modules
```

### Running PlayGround from Visual Studio

Make sure you first follow the [Prerequisites](https://github.com/Microsoft/PowerBI-visuals#prerequisites) & [Onetime Setup](https://github.com/Microsoft/PowerBI-visuals#one-time-setup)

To run sample app:

1. Open `src\PowerBIVisuals.sln` in Visual Studio then under `src\Clients\PowerBIVisualsPlayground`, right click on `index.html` file and select 'Set As Start Page'.

2. Right click on the project root folder then select 'Property Pages'. In the window opened select 'Build' and then in 'Before running startup page' select 'No Build'.

3. Task runner should have kicked off an incremental build task, which will build each time you make changes. **NOTE:** Sometimes the task runner might kick off two of these tasks at the same time, just close one of them.

4. Ctrl + F5 to launch the Playground.
 
### Running PlayGround without Visual Studio
 
Make sure you first follow the [Prerequisites](https://github.com/Microsoft/PowerBI-visuals#prerequisites) & [Onetime Setup](https://github.com/Microsoft/PowerBI-visuals#one-time-setup)
 
To run sample app:

1. Build the project

 ```
 gulp build
 ```
2. Run gulp task

 ```
 gulp run:playground
 ```
 
### Running Unit Tests

Use the following commands to build and run unit tests:
```
gulp test  # Build and run unit tests (requires 'PhantomJS', see below)
```

### Installing PhantomJS (non-Windows environment only)
To run unit tests on non-Windows environment you will need to
install [PhantomJS](http://phantomjs.org/) (PhantomJS is a headless WebKit scriptable with a JavaScript API. It has fast and native support for various web standards: DOM handling, CSS selector, JSON, Canvas, and SVG.).

On Windows PhantomJS is installed automatically as part of `gulp test` command.

## How to Engage, Contribute and Provide Feedback

There are many ways in which you can contribute to Power BI visuals:
* You can contribute fixes and new visuals to this repo, read the [contribution guidelines](https://github.com/Microsoft/PowerBI-visuals/blob/master/CONTRIBUTING.md).
* Submit bugs by opening a GitHub Issue [here](https://github.com/Microsoft/PowerBI-visuals/issues).
* Contribute to discussions on [StackOverflow](http://stackoverflow.com/questions/tagged/powerbidev).
* Follow the [Power BI Developer](http://blogs.msdn.com/powerbidev) blog for updates.
* Follow Power BI on Twitter [@mspowerbi](http://twitter.com/mspowerbi).

## Documentation

*  [Getting started](https://github.com/Microsoft/PowerBI-visuals/wiki)
*  [API specification](http://microsoft.github.io/PowerBI-visuals/interfaces/powerbi.ivisual.html)
*  [Power BI visuals playground (see our visuals live in action)](http://microsoft.github.io/PowerBI-visuals/playground/index.html)
*  [Power BI Homepage](https://powerbi.microsoft.com/)


### Copyrights

Copyright (c) 2015 Microsoft

See the [LICENSE](/LICENSE) file for license rights and limitations (MIT).
