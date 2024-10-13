const fs = require('fs');
const path = require('path');

// Paths for build check
const distPath = path.join(__dirname, 'client', 'dist');
const srcPath = path.join(__dirname, 'client', 'src');

// Check if 'dist' exists and is newer than 'src'
if (fs.existsSync(distPath)) {
  const distModified = fs.statSync(distPath).mtime;
  const srcModified = fs.statSync(srcPath).mtime;

  if (distModified > srcModified) {
    console.log("Client build is up-to-date. Skipping build...");
    process.exit(0); // Exit successfully (skip build)
  }
}

console.log("Client needs to be built. Running build...");
process.exit(1); // Trigger build
