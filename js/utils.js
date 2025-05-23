// Helper functions for file operations

// Format file size in human-readable form
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
}

// Format date from timestamp
function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toISOString().split("T")[0];
}

// Get expected file extension for encrypted files
function getEncryptedExtension(algo) {
  switch (algo) {
    case "aes":
      return ".aes";
    case "pgp":
      return ".gpg";
    case "zip":
      return ".zip";
    case "7zip":
      return ".7z";
    default:
      return ".enc";
  }
}
