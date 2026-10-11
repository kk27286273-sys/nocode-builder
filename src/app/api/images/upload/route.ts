import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

const BUCKET = 'site-images';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const VARIANT_WIDTHS: Record<string, number[]> = {
  general: [640, 960, 1440, 1920],
  solution: [320, 480, 640],
  logo: [128, 256, 512],
};

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const rawSiteId = formData.get('siteId');
    const rawPurpose = formData.get('purpose');

    if (!(file instanceof File)) {
      return errorResponse('이미지 파일을 찾을 수 없습니다.', 400);
    }

    if (typeof rawSiteId !== 'string' || !rawSiteId.trim()) {
      return errorResponse('사이트 ID가 필요합니다.', 400);
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return errorResponse('JPG, PNG, WebP, GIF 파일만 업로드할 수 있습니다.', 400);
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return errorResponse('이미지는 10MB 이하만 업로드할 수 있습니다.', 400);
    }

    const siteId = rawSiteId.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!siteId) {
      return errorResponse('사이트 ID 형식이 올바르지 않습니다.', 400);
    }

    const purpose =
      typeof rawPurpose === 'string' && rawPurpose in VARIANT_WIDTHS
        ? rawPurpose
        : 'general';

    const supabase = createAdminClient();
    const input = Buffer.from(await file.arrayBuffer());
    const uploadId = `${Date.now()}-${crypto.randomUUID()}`;

    // GIF는 애니메이션 보존을 위해 원본 그대로 저장합니다.
    if (file.type === 'image/gif') {
      const path = `${siteId}/${uploadId}-original.gif`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, input, {
        cacheControl: '31536000',
        contentType: 'image/gif',
        upsert: false,
      });

      if (error) throw error;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

      return NextResponse.json({
        url: data.publicUrl,
        srcSet: null,
        width: null,
        height: null,
      });
    }

    const image = sharp(input, { failOn: 'error' });
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      return errorResponse('이미지 크기를 확인할 수 없습니다.', 400);
    }

    const widths = VARIANT_WIDTHS[purpose].filter(
      (width) => width <= metadata.width!,
    );

    // 원본 업로드와 변형본 생성이 분리돼 있어 원본도 보존합니다.
    const originalExtension =
      file.type === 'image/png'
        ? 'png'
        : file.type === 'image/webp'
          ? 'webp'
          : 'jpg';

    const originalPath = `${siteId}/${uploadId}-original.${originalExtension}`;
    const { error: originalError } = await supabase.storage
      .from(BUCKET)
      .upload(originalPath, input, {
        cacheControl: '31536000',
        contentType: file.type,
        upsert: false,
      });

    if (originalError) throw originalError;

    const generated: Array<{ width: number; url: string }> = [];

    // 원본 폭이 가장 작은 파생 폭보다 작아도 실제 크기의 WebP는 만듭니다.
    const outputWidths = widths.length > 0 ? widths : [metadata.width];

    for (const width of outputWidths) {
      const output = await sharp(input)
        .rotate()
        .resize({
          width,
          withoutEnlargement: true,
          fit: 'inside',
        })
        .webp({
          quality: purpose === 'logo' ? 88 : 82,
          effort: 5,
        })
        .toBuffer();

      const path = `${siteId}/${uploadId}-${width}.webp`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, output, {
        cacheControl: '31536000',
        contentType: 'image/webp',
        upsert: false,
      });

      if (error) throw error;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      generated.push({ width, url: data.publicUrl });
    }

    const largest = generated[generated.length - 1];

    return NextResponse.json({
      url: largest.url,
      srcSet: generated.map(({ width, url }) => `${url} ${width}w`).join(', '),
      width: metadata.width,
      height: metadata.height,
    });
  } catch (error) {
    console.error('[IMAGE_UPLOAD_ERROR]', error);
    return errorResponse(
      error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.',
      500,
    );
  }
}