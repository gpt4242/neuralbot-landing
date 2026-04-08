#!/bin/bash

# NeuralBot Landing — One-click deploy script
# Uses Netlify CLI if available, otherwise guides user

set -e

echo "⚡  NeuralBot Landing — Deploy Script"
echo "====================================="
echo ""

# Check if files exist
for file in index.html styles.css script.js; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing file: $file"
        exit 1
    fi
done

echo "✅ All files found"
echo ""

# Option 1: Netlify CLI
if command -v netlify &> /dev/null; then
    echo "🚀 Deploying via Netlify CLI..."
    echo ""
    netlify deploy --prod --dir=. "$@"
    exit $?
fi

# Option 2: Vercel CLI
if command -v vercel &> /dev/null; then
    echo "🚀 Deploying via Vercel CLI..."
    echo ""
    vercel deploy --prod "$@"
    exit $?
fi

# Option 3: Guide
echo "📋 No CLI tools found. Choose a deploy method:"
echo ""
echo "  1️⃣  Netlify Drop (easiest — drag & drop in browser)"
echo "  2️⃣  GitHub Pages (free, permanent URL)"
echo "  3️⃣  Vercel (free, fast)"
echo ""
read -p "Select (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📁 Step 1: Create a ZIP of your files:"
        echo "   zip -r neuralbot-site.zip index.html styles.css script.js"
        echo ""
        echo "🌐 Step 2: Go to https://app.netlify.com/drop"
        echo "   Drag and drop your files — that's it!"
        echo ""
        echo "✅ Your site will be live at: yoursite.netlify.app"
        ;;
    2)
        echo ""
        echo "📋 Steps:"
        echo "   1. Create a repo on github.com/new"
        echo "   2. Run:"
        echo "      git init"
        echo "      git add -A"
        echo "      git commit -m 'Initial commit'"
        echo "      git branch -M main"
        echo "      git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git"
        echo "      git push -u origin main"
        echo "   3. Go to repo Settings → Pages → Source: main → Save"
        echo ""
        echo "✅ Your site will be live at: YOUR_USERNAME.github.io/REPO_NAME"
        ;;
    3)
        echo ""
        echo "📋 Steps:"
        echo "   1. Run: npx vercel"
        echo "   2. Follow prompts (login with GitHub)"
        echo "   3. For subsequent deploys: npx vercel --prod"
        echo ""
        echo "✅ Your site will be live at: yoursite.vercel.app"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
