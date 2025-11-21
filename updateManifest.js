import fs from "fs";

const distDir = "./dist/assets";
const manifestPath = "./dist/manifest.json";
const files = fs.readdirSync(distDir);
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

if (Array.isArray(manifest.content_scripts)) {
  manifest.content_scripts.forEach((script) => {
    script.js = script.js.map((jsFile) => {
      const baseName = jsFile.replace("assets/", "").replace(".js", "");
      const matchedFile = files.find((file) => file.startsWith(`${baseName}-`));
      return matchedFile ? `assets/${matchedFile}` : jsFile;
    });
  });
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
