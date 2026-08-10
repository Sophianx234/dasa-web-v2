const fs = require('fs');
const path = require('path');

const srcProjectDir = 'C:/Users/Damian X/Documents/programming/Nextjs/dasa-web/src';
const destProjectDir = 'C:/Users/Damian X/Documents/programming/Nextjs/dasa-web-v2/src';

const homepagePath = path.join(srcProjectDir, 'features/pages/Homepage.tsx');

const visited = new Set();
const filesToCopy = [];

function resolveImportPath(currentFilePath, importPath) {
    if (importPath.startsWith('@/')) {
        return path.join(srcProjectDir, importPath.replace('@/', ''));
    }
    if (importPath.startsWith('.')) {
        return path.resolve(path.dirname(currentFilePath), importPath);
    }
    return null; // External module
}

function getFilePathsToTry(basePath) {
    return [
        basePath,
        basePath + '.tsx',
        basePath + '.ts',
        basePath + '.jsx',
        basePath + '.js',
        path.join(basePath, 'index.tsx'),
        path.join(basePath, 'index.ts'),
        basePath + '.css',
        basePath + '.scss'
    ];
}

function trace(filePath) {
    let resolvedPath = null;
    for (const p of getFilePathsToTry(filePath)) {
        if (fs.existsSync(p) && fs.statSync(p).isFile()) {
            resolvedPath = p;
            break;
        }
    }

    if (!resolvedPath || visited.has(resolvedPath)) {
        return;
    }
    visited.add(resolvedPath);
    filesToCopy.push(resolvedPath);

    // Only parse js/ts files for imports
    if (!resolvedPath.match(/\.(tsx?|jsx?)$/)) return;

    const content = fs.readFileSync(resolvedPath, 'utf8');
    const importRegex = /import\s+(?:.*?\s+from\s+)?['"](.*?)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        const nextPath = resolveImportPath(resolvedPath, importPath);
        if (nextPath) {
            trace(nextPath);
        }
    }
}

trace(homepagePath);

let modifiedFiles = 0;

filesToCopy.forEach(file => {
    const relativePath = path.relative(srcProjectDir, file);
    const destPath = path.join(destProjectDir, 'components', relativePath);
    
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    
    let content = fs.readFileSync(file, 'utf8');
    
    if (file.match(/\.tsx?$/)) {
        // Fix react-router-dom imports
        if (content.includes('react-router-dom')) {
            content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]react-router-dom['"];?/g, (match, imports) => {
                let newImports = [];
                let hasLink = false;
                let hasNav = false;
                
                if (imports.includes('Link') || imports.includes('NavLink')) hasLink = true;
                if (imports.includes('useNavigate') || imports.includes('useParams') || imports.includes('useLocation')) hasNav = true;
                
                let res = '';
                if (hasLink) res += `import Link from "next/link";\n`;
                if (hasNav) {
                    let navImports = imports.split(',').map(s => s.trim()).filter(s => ['useRouter', 'useParams', 'usePathname'].includes(s));
                    // Simple hack: map useNavigate to useRouter, useLocation to usePathname
                    if (imports.includes('useNavigate')) navImports.push('useRouter');
                    if (imports.includes('useLocation')) navImports.push('usePathname');
                    navImports = [...new Set(navImports)];
                    if (navImports.length > 0) res += `import { ${navImports.join(', ')} } from "next/navigation";\n`;
                }
                return res;
            });
            content = content.replace(/useNavigate\(\)/g, 'useRouter()');
            content = content.replace(/useLocation\(\)/g, 'usePathname()');
            content = content.replace(/<NavLink/g, '<Link');
            content = content.replace(/<\/NavLink>/g, '</Link>');
        }
        
        // Next.js components that use hooks need "use client"
        if (content.includes('useState') || content.includes('useEffect') || content.includes('useRef') || content.includes('useAppSelector') || content.includes('useAppDispatch') || content.includes('useRouter') || content.includes('usePathname') || content.includes('framer-motion')) {
            if (!content.includes('"use client"') && !content.includes("'use client'")) {
                content = '"use client";\n' + content;
            }
        }
    }
    
    fs.writeFileSync(destPath, content);
});

console.log(`Successfully copied ${filesToCopy.length} files to components folder.`);
