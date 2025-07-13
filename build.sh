#!/bin/bash

# Build script for KatoKits
echo "🚀 Building KatoKits..."

# Create dist directory
mkdir -p dist dist/js dist/images dist/products dist/netlify/functions

# Copy HTML files
echo "📄 Copying HTML files..."
cp *.html dist/ 2>/dev/null || true

# Copy and process CSS
echo "🎨 Processing CSS..."
if command -v cleancss &> /dev/null; then
    cleancss -o dist/styles.min.css styles.css
    # Update HTML to use minified CSS
    sed -i 's/styles\.css/styles.min.css/g' dist/*.html 2>/dev/null || true
else
    cp styles.css dist/
fi

# Copy and process JavaScript
echo "📜 Processing JavaScript..."
cp -r js/* dist/js/ 2>/dev/null || true
if command -v terser &> /dev/null; then
    terser js/main.js -o dist/js/main.min.js
    # Update HTML to use minified JS
    sed -i 's/js\/main\.js/js\/main.min.js/g' dist/*.html 2>/dev/null || true
fi

# Copy static assets
echo "🖼️ Copying assets..."
cp -r images/* dist/images/ 2>/dev/null || true
cp -r products/* dist/products/ 2>/dev/null || true
cp manifest.json dist/ 2>/dev/null || true
cp service-worker.js dist/ 2>/dev/null || true
cp robots.txt dist/ 2>/dev/null || true
cp sitemap.xml dist/ 2>/dev/null || true

# Copy Netlify functions
echo "⚡ Copying Netlify functions..."
cp -r netlify/* dist/netlify/ 2>/dev/null || true

echo "✅ Build complete! Files are in the dist/ directory."