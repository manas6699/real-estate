import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as parser from "@babel/parser";
import traverseModule from "@babel/traverse";
const traverse = traverseModule.default;

// --- Setup ---
// __dirname workaround in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_DIR = path.join(__dirname, "src", "app");
const COMPONENTS_DIR = path.join(__dirname, "src", "components");
const CONFIG_API_PATH = "@/config/api"; // The alias used in imports
const OUTPUT_FILE = path.join(__dirname, "DOCUMENTATION.md");

/**
 * Utility: recursively get files
 * @param {string} dir Directory to search
 * @returns {string[]} Array of file paths
 */
function getFilesRecursively(dir) {
  let results = [];
  try {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      // Recursively check directories
      if (stat.isDirectory()) {
        results = results.concat(getFilesRecursively(filePath));
      } 
      // Only process JS/TS/JSX/TSX files
      else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
        results.push(filePath);
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  return results;
}

/**
 * Resolve local component file path from import statement
 * @param {string} importPath The path from the import statement (e.g., '@/components/Button' or '../utils')
 * @param {string} currentFile The file where the import is being made
 * @returns {string | null} Relative path from the project root (or null if not found)
 */
function resolveLocalComponent(importPath, currentFile) {
  let absPath = importPath;

  // Handle alias imports (e.g., @/components/Button)
  if (importPath.startsWith("@/")) {
    absPath = path.join(__dirname, "src", importPath.replace("@/", ""));
  } 
  // Handle relative imports (e.g., ../utils/file)
  else if (importPath.startsWith(".")) {
    absPath = path.resolve(path.dirname(currentFile), importPath);
  }

  // File extension candidates (Next.js automatically handles this)
  const fileCandidates = [
    absPath,
    `${absPath}.tsx`,
    `${absPath}.ts`,
    `${absPath}.jsx`,
    `${absPath}.js`,
    path.join(absPath, "index.tsx"),
    path.join(absPath, "index.ts"),
    path.join(absPath, "index.jsx"),
    path.join(absPath, "index.js"),
  ];

  for (const candidate of fileCandidates) {
    if (fs.existsSync(candidate)) {
      // Return path relative to the project root for clean documentation
      return path.relative(path.join(__dirname, 'src'), candidate);
    }
  }

  return null;
}

/**
 * Analyzes a single file to extract dependencies and API calls
 * @param {string} filePath Path to the file
 */
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const ast = parser.parse(content, {
    sourceType: "module",
    // Ensure all necessary plugins for Next.js/React/TypeScript are enabled
    plugins: ["jsx", "typescript", "classProperties", "asyncGenerators", "dynamicImport"],
  });

  const configImports = {}; // Map of { 'CONSTANT_NAME': '@config/api' }
  const externalComponents = [];
  const localComponents = [];
  const apis = [];

  traverse(ast, {
    // 1. Track Imports
    ImportDeclaration({ node }) {
      const importPath = node.source.value;

      // Track constants imported from the API config file
      if (importPath.includes(CONFIG_API_PATH)) {
        node.specifiers.forEach(specifier => {
          if (specifier.type === 'ImportSpecifier') {
            // Store the local name of the constant
            configImports[specifier.local.name] = importPath;
          }
        });
      }

      // Track all local imports (starting with '.' or '@/')
      if (importPath.startsWith(".") || importPath.startsWith("@/")) {
        // Exclude the API config file from the list of 'Local Components'
        if (importPath.includes(CONFIG_API_PATH)) {
            // Already handled in configImports, do nothing for localComponents list
            return;
        }

        const resolved = resolveLocalComponent(importPath, filePath);
        if (resolved) localComponents.push(resolved);
      } 
      // Track external npm package imports
      else {
        externalComponents.push(importPath);
      }
    },
    
    // 2. Track API Calls (fetch and axios)
    CallExpression({ node }) {
      let urlArgument = null;
      let method = null;
      let isAxios = false;

      // --- Handling fetch(URL) ---
      if (node.callee.name === "fetch" && node.arguments.length > 0) {
        urlArgument = node.arguments[0];
        method = 'fetch';
      } 
      // --- Handling axios.method(URL) ---
      else if (
        node.callee.type === "MemberExpression" &&
        node.arguments.length > 0 &&
        (node.callee.object.name === "axios" || node.callee.object.name === "Axios") // Check for axios variable name
      ) {
        urlArgument = node.arguments[0];
        method = node.callee.property.name;
        isAxios = true;
      }

      if (urlArgument && method) {
        let urlDescription = '';
        
        // Case A: Imported API Constant (e.g., CREATE_CAMPAIGN)
        if (urlArgument.type === 'Identifier') {
          const identifierName = urlArgument.name;
          if (configImports[identifierName] && configImports[identifierName].includes(CONFIG_API_PATH)) {
            urlDescription = `[Config Constant] ${identifierName}`;
          } else {
            urlDescription = `[Identifier] ${identifierName} (Likely Dynamic/Local Var)`;
          }
        } 
        // Case B: Literal URL String (e.g., "/api/users")
        else if (urlArgument.type === 'StringLiteral') {
          urlDescription = urlArgument.value;
        } 
        // Case C: Template String (e.g., `/api/users/${id}`)
        else if (urlArgument.type === 'TemplateLiteral') {
          urlDescription = 'Template String (Dynamic URL)';
        }

        if (urlDescription) {
            apis.push(`${isAxios ? 'axios.' : ''}${method} → ${urlDescription}`);
        }
      }
    },
  });

  return { externalComponents, localComponents, apis };
}

/**
 * Main function to run the documentation generation
 */
function generateDocs() {
  const files = getFilesRecursively(APP_DIR).concat(getFilesRecursively(COMPONENTS_DIR));

  let markdown = "# 📘 Project Documentation\n\n";
  markdown += `*Analysis performed on ${files.length} files in 'src/app' and 'src/components'*\n\n---\n\n`;

  files.forEach((file) => {
    const relativePath = path.relative(__dirname, file);
    try {
        const { externalComponents, localComponents, apis } = analyzeFile(file);

        markdown += `## 📄 \`${relativePath}\`\n\n`;

        markdown += `### External Dependencies (npm packages):\n`;
        markdown += externalComponents.length
          ? externalComponents.map((c) => `- \`${c}\``).join("\n") + "\n"
          : "- None\n";

        markdown += `\n### Local Components & Utilities:\n`;
        markdown += localComponents.length
          ? localComponents.map((c) => `- \`${c}\``).join("\n") + "\n"
          : "- None\n";

        markdown += `\n### 🔗 API Calls Detected:\n`;
        markdown += apis.length
          ? apis.map((a) => `- \`${a}\``).join("\n") + "\n"
          : "- None\n";

        markdown += `\n---\n\n`;

    } catch (e) {
        markdown += `## 📄 \`${relativePath}\`\n\n`;
        markdown += `**ERROR:** Could not analyze file due to parsing error. Check file syntax.\n\n---\n\n`;
        console.error(`Error analyzing ${file}:`, e.message);
    }
  });

  fs.writeFileSync(OUTPUT_FILE, markdown, "utf-8");
  console.log(`\n✅ Documentation successfully generated at ${OUTPUT_FILE}`);
}

generateDocs();
