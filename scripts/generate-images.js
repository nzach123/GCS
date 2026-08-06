/**
 * Generate responsive image variants for GCS
 * Creates resized copies for srcset attributes.
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

const ASSETS = path.resolve(__dirname, '..', 'assets');

async function ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true });
}

async function resizeImage(srcPath, destPath, width) {
    await sharp(srcPath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(destPath);
    console.log(`  Created ${path.basename(destPath)} (${width}w)`);
}

async function main() {
    // 1. Hero logo (gsc-logo.png, 1080×1080) → 250w, 500w
    console.log('\n=== Hero Logo ===');
    const logoDir = path.join(ASSETS, 'logos');
    await ensureDir(logoDir);
    const logoPath = path.join(ASSETS, 'gsc-logo.png');
    await resizeImage(logoPath, path.join(logoDir, 'gsc-logo-250w.webp'), 250);
    await resizeImage(logoPath, path.join(logoDir, 'gsc-logo-500w.webp'), 500);

    // 2. Level Up badge (Level up logo.png, 2705×2475) → 120w, 240w, 350w
    console.log('\n=== Level Up Badge ===');
    const badgeDir = path.join(ASSETS, 'photos', 'levelup');
    const badgePath = path.join(badgeDir, 'Level up logo.png');
    await resizeImage(badgePath, path.join(badgeDir, 'levelup-badge-120w.webp'), 120);
    await resizeImage(badgePath, path.join(badgeDir, 'levelup-badge-240w.webp'), 240);
    await resizeImage(badgePath, path.join(badgeDir, 'levelup-badge-350w.webp'), 350);

    // 3. Carousel images (2557×1740) → 400w, 800w, 1200w
    console.log('\n=== Carousel Images ===');
    const photosDir = path.join(ASSETS, 'photos', 'levelup', 'photos');
    const files = await fs.readdir(photosDir);
    const webpFiles = files.filter(f => f.endsWith('.webp'));

    for (const file of webpFiles) {
        const baseName = path.parse(file).name;
        const srcPath = path.join(photosDir, file);
        console.log(`  Processing ${file}...`);
        await resizeImage(srcPath, path.join(photosDir, `${baseName}-400w.webp`), 400);
        await resizeImage(srcPath, path.join(photosDir, `${baseName}-800w.webp`), 800);
        await resizeImage(srcPath, path.join(photosDir, `${baseName}-1200w.webp`), 1200);
    }

    // 4. Controllers image (3300×2326) → 600w, 1200w
    console.log('\n=== Controllers Image ===');
    const ctrlDir = path.join(ASSETS, 'photos', 'levelup');
    const ctrlPath = path.join(ctrlDir, 'Controllers.png');
    await resizeImage(ctrlPath, path.join(ctrlDir, 'Controllers-600w.webp'), 600);
    await resizeImage(ctrlPath, path.join(ctrlDir, 'Controllers-1200w.webp'), 1200);

    console.log('\n✅ All variants generated!');
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});