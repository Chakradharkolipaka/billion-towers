const cloudinary = require("cloudinary");

const isHttpUrl = (str) => typeof str === "string" && /^https?:\/\//i.test(str);

const isCloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );

async function uploadImage(image, folder) {
  if (isHttpUrl(image)) {
    return {
      public_id: `external_${folder}_${Date.now()}`,
      url: image,
    };
  }

  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Provide an image URL or set CLOUDINARY_* env vars.",
    );
  }

  const result = await cloudinary.v2.uploader.upload(image, { folder });
  return {
    public_id: result.public_id,
    url: result.secure_url,
  };
}

async function destroyImage(publicId) {
  if (!publicId || publicId.startsWith("external_") || publicId === "default_avatar") {
    return;
  }

  if (!isCloudinaryConfigured()) {
    return;
  }

  try {
    await cloudinary.v2.uploader.destroy(publicId);
  } catch {
    // Ignore cleanup failures for missing assets.
  }
}

module.exports = {
  uploadImage,
  destroyImage,
  isHttpUrl,
  isCloudinaryConfigured,
};
