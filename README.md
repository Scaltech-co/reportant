# Reportant – Development Source Code

This repository contains the **human-readable development source code** used to generate the production JavaScript files distributed with the Reportant WordPress plugin.

The compiled production file used by the plugin is:

dist/app.js

## Build Tools

The production assets are generated using:

- Node.js / npm
- Vite (JavaScript bundler)

## Build Instructions

1. Clone the repository

git clone https://github.com/Scaltech-co/reportant.git

2. Install dependencies

npm install

3. Build the production assets

npm run build

After running the build command, the compiled production file will be generated at:

dist/app.js

## Source Structure

src/ – human readable source code  
dist/ – generated production files

## Dependencies

This project uses the following open source libraries:

- DOMPurify — Apache-2.0  
  https://github.com/cure53/DOMPurify

- JSZip — MIT  
  https://github.com/Stuk/jszip

- Metro UI CSS — MIT  
  https://github.com/olton/Metro-UI-CSS
