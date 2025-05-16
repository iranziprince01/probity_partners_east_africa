const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const imagesToOptimize = [
  "001.jpg",
  "002.jpg",
  "003.jpg",
  "004.jpg",
  "005.jpg",
  "about-hero.jpg",
  "services-hero.jpg",
];

const optimizeImage = async (imagePath) => {
  try {
    const inputPath = path.join(__dirname, "assets", imagePath);
    const outputPath = path.join(__dirname, "assets", "optimized", imagePath);

    // Create optimized directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, "assets", "optimized"))) {
      fs.mkdirSync(path.join(__dirname, "assets", "optimized"));
    }

    // Optimize image
    await sharp(inputPath)
      .resize(1200, 800, {
        // Resize to reasonable dimensions
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 80, // Reduce quality
        progressive: true, // Use progressive loading
      })
      .toFile(outputPath);

    console.log(`Optimized ${imagePath}`);
  } catch (error) {
    console.error(`Error optimizing ${imagePath}:`, error);
  }
};

// Optimize all images
Promise.all(imagesToOptimize.map(optimizeImage))
  .then(() => console.log("All images optimized successfully"))
  .catch((error) => console.error("Error optimizing images:", error));
