"use client";

import { useEffect, useState } from "react";

export default function UploadImage() {
  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string>("");

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Allowed image types
    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedImageTypes.includes(file.type)) {
      alert(
        "Only JPG, PNG, and WEBP images are allowed"
      );

      event.target.value = "";

      return;
    }

    // Maximum file size: 5 MB
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        "Image size must be less than 5 MB"
      );

      event.target.value = "";

      return;
    }

    // Store selected image
    setSelectedImage(file);

    // Create preview URL
    const preview = URL.createObjectURL(file);

    setPreviewUrl(preview);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl("");
  };

  // Cleanup temporary preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div>
      <h2>Upload Image</h2>

      {/* Select Image */}

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleImageChange}
      />

      {/* Selected Image Name */}

      {selectedImage && (
        <p>
          Selected Image:{" "}
          {selectedImage.name}
        </p>
      )}

      {/* Image Preview */}

      {previewUrl && (
        <div>
          <h3>Image Preview</h3>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Selected image preview"
            width={300}
            height={300}
            style={{
              objectFit: "contain",
              border: "1px solid #ccc",
            }}
          />

          <br />

          <button
            type="button"
            onClick={handleRemoveImage}
          >
            Remove Image
          </button>
        </div>
      )}
    </div>
  );
}