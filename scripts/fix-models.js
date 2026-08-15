const fs = require('fs');
const path = require('path');

const modelsDir = path.join(process.cwd(), 'src', 'models');
const files = fs.readdirSync(modelsDir);

files.forEach(file => {
    if (file.endsWith('.ts')) {
        let content = fs.readFileSync(path.join(modelsDir, file), 'utf8');
        
        // Fix mongoose.model( "Name", schema ) -> mongoose.models.Name || mongoose.model( "Name", schema )
        // Using a regex to find model declarations
        content = content.replace(/const (\w+) = (?:mongoose\.)?model<[^>]+>\(\s*["']([^"']+)["']\s*,\s*(\w+)\s*\)/g, (match, p1, p2, p3) => {
            return `const ${p1} = (mongoose.models && mongoose.models.${p2}) ? mongoose.models.${p2} : mongoose.model("${p2}", ${p3})`;
        });
        
        fs.writeFileSync(path.join(modelsDir, file), content, 'utf8');
    }
});
console.log('Fixed models for hot reloading');
