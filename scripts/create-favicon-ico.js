const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if the favicon.png exists
const pngPath = path.join(__dirname, '../public/favicon.png');

if (fs.existsSync(pngPath)) {
  console.log('Converting favicon.png to favicon.ico...');
  
  try {
    // Create the favicon.ico in the public folder
    const icoPath = path.join(__dirname, '../public/favicon.ico');
    
    // This is a simple approach using sharp via CLI
    // You can install sharp globally with: npm install -g sharp-cli
    execSync(`npx sharp "${pngPath}" -o "${icoPath}" --format ico`);
    
    console.log('Favicon.ico created successfully!');
  } catch (error) {
    console.error('Error creating favicon.ico:', error.message);
    
    // Fallback method - copy the PNG as ICO if conversion fails
    try {
      console.log('Using fallback method...');
      fs.copyFileSync(pngPath, path.join(__dirname, '../public/favicon.ico'));
      console.log('Created favicon.ico (copied PNG)');
    } catch (fallbackError) {
      console.error('Fallback method failed:', fallbackError.message);
    }
  }
} else {
  console.error('Error: favicon.png not found in public folder');
} 