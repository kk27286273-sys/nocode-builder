export async function compressImage(
  file: File,
  maxDimension = 1920,
  maxSizeBytes = 500 * 1024 // 500KB
): Promise<File> {
  // SVG나 이미 가벼운 파일은 압축 스킵
  if (file.type === "image/svg+xml" || file.size <= maxSizeBytes) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(img.src);

      let { width, height } = img;

      // 긴 축 기준 리사이징
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // 단계별 품질 압축 시도 (0.85 -> 0.65 -> 0.45)
      const tryCompress = (quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            if (blob.size <= maxSizeBytes || quality <= 0.45) {
              const compressedFile = new File(
                [blob],
                `${file.name.replace(/\.[^/.]+$/, "")}.webp`,
                { type: "image/webp" }
              );
              resolve(compressedFile);
            } else {
              tryCompress(quality - 0.2);
            }
          },
          "image/webp",
          quality
        );
      };

      tryCompress(0.85);
    };

    img.onerror = () => {
      reject(new Error("이미지 압축 처리 중 오류가 발생했습니다."));
    };
  });
}