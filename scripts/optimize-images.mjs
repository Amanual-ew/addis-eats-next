// scripts/optimize-images.mjs
//
// Finds oversized images in your public folder and (optionally) shrinks them.
//
//   node scripts/optimize-images.mjs             -> report only, changes nothing
//   node scripts/optimize-images.mjs --write     -> shrink the images
//
// Options:
//   <folder>            folder to scan (default: public/images)
//   --max-width=1200    widest an image is allowed to be, in pixels
//
// What --write does:
//   - keeps every file name and format, so you do NOT change any code
//   - saves your untouched originals to public-originals-backup/ first
//     (outside public/, so they are never deployed)
//   - only replaces a file when the new one is actually smaller

import { promises as fs } from "node:fs";
import path from "node:path";

let sharp;
try {
  ({ default: sharp } = await import("sharp"));
} catch {
  console.error('This script needs "sharp". Install it with:\n  npm install --save-dev sharp');
  process.exit(1);
}

const args = process.argv.slice(2);
const WRITE = args.includes("--write");
const MAX_WIDTH =
  Number((args.find((a) => a.startsWith("--max-width=")) ?? "").split("=")[1]) || 1200;
const DIR = args.find((a) => !a.startsWith("--")) ?? "public/images";

const ROOT = process.cwd();
const BACKUP_DIR = path.join(ROOT, "public-originals-backup");
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const BIG_FILE_KB = 300; // a dish card image should be well under this

const kb = (bytes) => Math.round(bytes / 1024);

async function findImages(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    console.error(`Folder not found: ${path.relative(ROOT, dir)}`);
    console.error("Run this from your project root, or pass the folder: node scripts/optimize-images.mjs public");
    process.exit(1);
  }
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await findImages(full)));
    else if (EXTENSIONS.has(path.extname(entry.name).toLowerCase())) files.push(full);
  }
  return files;
}

function encode(pipeline, ext) {
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return pipeline.jpeg({ quality: 78, mozjpeg: true });
    case ".webp":
      return pipeline.webp({ quality: 78 });
    default: // .png: lossless, so photos stay clean (resizing does most of the work)
      return pipeline.png({ compressionLevel: 9, effort: 10 });
  }
}

const files = (await findImages(path.resolve(ROOT, DIR))).sort();
if (files.length === 0) {
  console.log(`No images found in ${DIR}`);
  process.exit(0);
}

console.log(`${WRITE ? "Optimizing" : "Checking"} ${files.length} image(s) in ${DIR} (max width ${MAX_WIDTH}px)\n`);

let before = 0;
let after = 0;
let changed = 0;
const stillBig = [];

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const ext = path.extname(file).toLowerCase();
  const original = await fs.readFile(file);
  const meta = await sharp(original).metadata();
  const flags = [];
  if (original.length > BIG_FILE_KB * 1024) flags.push("TOO BIG");
  if (meta.width > MAX_WIDTH) flags.push("TOO WIDE");

  before += original.length;
  let finalSize = original.length;

  // Only touch images that are flagged. Re-compressing a file that is already
  // fine would just lose quality, so running --write twice is safe.
  if (WRITE && flags.length === 0) {
    flags.push("fine, left alone");
  } else if (WRITE) {
    const resized = sharp(original).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true });
    const output = await encode(resized, ext).toBuffer();

    if (output.length < original.length) {
      const backupPath = path.join(BACKUP_DIR, path.relative(ROOT, file));
      await fs.mkdir(path.dirname(backupPath), { recursive: true });
      // Never overwrite an existing backup: it holds the true original.
      await fs.copyFile(file, backupPath, fs.constants.COPYFILE_EXCL).catch((e) => {
        if (e.code !== "EEXIST") throw e;
      });
      await fs.writeFile(file, output);
      finalSize = output.length;
      changed++;
      flags.push(`now ${kb(finalSize)} KB`);
    } else {
      flags.push("already optimal");
    }
    if (finalSize > BIG_FILE_KB * 1024) stillBig.push(rel);
  }

  after += finalSize;
  console.log(
    `${rel.padEnd(46)} ${`${meta.width}x${meta.height}`.padEnd(11)} ${`${kb(original.length)} KB`.padStart(9)}  ${flags.join(", ")}`
  );
}

console.log("");
if (WRITE) {
  console.log(`Changed ${changed} file(s). Total ${kb(before)} KB -> ${kb(after)} KB (saved ${kb(before - after)} KB).`);
  if (changed > 0) console.log(`Originals are in public-originals-backup/ (add it to .gitignore).`);
  if (stillBig.length > 0) {
    console.log(`\nStill over ${BIG_FILE_KB} KB after resizing:\n  ${stillBig.join("\n  ")}`);
    console.log("These are probably photos saved as PNG. Re-save them as JPG or WebP (squoosh.app) and update the file name in your dishes data.");
  }
} else {
  console.log(`Total ${kb(before)} KB. Nothing was changed. Run again with --write to shrink the flagged images.`);
}
