const PINATA_API_URL = "https://api.pinata.cloud/pinning";

function isPinataConfigured() {
  return Boolean(process.env.PINATA_JWT);
}

function pinataHeaders() {
  return {
    Authorization: `Bearer ${process.env.PINATA_JWT}`,
  };
}

function decodeDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    return null;
  }

  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

async function pinBufferToIpfs(buffer, filename, mimeType = "application/octet-stream") {
  const formData = new FormData();
  formData.append("file", new Blob([buffer], { type: mimeType }), filename);

  const response = await fetch(`${PINATA_API_URL}/pinFileToIPFS`, {
    method: "POST",
    headers: pinataHeaders(),
    body: formData,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || payload.message || "Pinata upload failed");
  }

  return {
    public_id: payload.IpfsHash,
    url: `https://gateway.pinata.cloud/ipfs/${payload.IpfsHash}`,
  };
}

async function pinUrlMetadataToIpfs(url, folder) {
  const response = await fetch(`${PINATA_API_URL}/pinJSONToIPFS`, {
    method: "POST",
    headers: {
      ...pinataHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pinataContent: {
        sourceUrl: url,
        folder,
        pinnedAt: new Date().toISOString(),
      },
      pinataMetadata: {
        name: `${folder}_${Date.now()}`,
      },
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || payload.message || "Pinata metadata pin failed");
  }

  return {
    public_id: payload.IpfsHash,
    url: `https://gateway.pinata.cloud/ipfs/${payload.IpfsHash}`,
    sourceUrl: url,
  };
}

async function uploadImageToPinata(image, folder) {
  const decoded = decodeDataUrl(image);
  if (decoded) {
    const extension = decoded.mimeType.split("/")[1] || "bin";
    return pinBufferToIpfs(
      decoded.buffer,
      `${folder}.${extension}`,
      decoded.mimeType,
    );
  }

  throw new Error("Pinata expects a base64 data URL for direct uploads.");
}

module.exports = {
  isPinataConfigured,
  uploadImageToPinata,
  pinUrlMetadataToIpfs,
};
