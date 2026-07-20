const cloudinary = require("cloudinary");
const {
  isPinataConfigured,
  uploadImageToPinata,
  pinUrlMetadataToIpfs,
} = require("./pinataUpload");

const isHttpUrl = (str) => typeof str === "string" && /^https?:\/\//i.test(str);

const isCloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );

async function uploadImage(image, folder) {
  if (isHttpUrl(image)) {
    if (isPinataConfigured()) {
      try {
        const pinned = await pinUrlMetadataToIpfs(image, folder);
        return {
          public_id: pinned.public_id,
          url: image,
          ipfsHash: pinned.public_id,
          ipfsGatewayUrl: pinned.url,
        };
      } catch {
        // Fall back to storing the external URL directly.
      }
    }

    return {
      public_id: `external_${folder}_${Date.now()}`,
      url: image,
    };
  }

  if (isCloudinaryConfigured()) {
    const result = await cloudinary.v2.uploader.upload(image, { folder });
    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  if (isPinataConfigured()) {
    return uploadImageToPinata(image, folder);
  }

  throw new Error(
    "No media storage configured. Set PINATA_JWT or CLOUDINARY_* env vars, or provide an image URL.",
  );
}

async function destroyImage(publicId) {
  if (
    !publicId ||
    publicId.startsWith("external_") ||
    publicId === "default_avatar" ||
    publicId.startsWith("seed_")
  ) {
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
