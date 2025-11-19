import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import url from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, "../public/images");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png"]);

const toWebpPath = (file) => {
  const parsed = path.parse(file);
  return path.join(parsed.dir, `${parsed.name}.webp`);
};

const needsUpdate = async (source, target) => {
  try {
    const [srcStat, targetStat] = await Promise.all([stat(source), stat(target)]);
    return srcStat.mtimeMs > targetStat.mtimeMs;
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return true;
    }
    throw error;
  }
};

const run = async () => {
  const files = await readdir(imagesDir);
  let converted = 0;

  for (const file of files) {
    const fullPath = path.join(imagesDir, file);
    const ext = path.extname(file).toLowerCase();
    if (!supportedExtensions.has(ext)) continue;

    const webpPath = toWebpPath(fullPath);
    const shouldProcess = await needsUpdate(fullPath, webpPath);
    if (!shouldProcess) continue;

    await sharp(fullPath)
      .webp({ quality: 82, effort: 4 })
      .toFile(webpPath);

    converted += 1;
    console.log(`Converted ${path.basename(fullPath)} → ${path.basename(webpPath)}`);
  }

  if (converted === 0) {
    console.log("All images already optimized.");
  } else {
    console.log(`Optimized ${converted} image${converted === 1 ? "" : "s"}.`);
  }
};

run().catch((error) => {
  console.error("Image optimization failed", error);
  process.exitCode = 1;
});
