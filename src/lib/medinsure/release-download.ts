import { createAdminClient } from '@/lib/supabase/admin';
import { noReleaseCache, releaseBucket } from '@/lib/medinsure/releases';
import { createReleaseDownload } from '@/lib/medinsure/r2';

export async function redirectRelease(objectPath: string, filename: string) {
  let location: string;
  if (objectPath.startsWith('r2/')) {
    location = await createReleaseDownload(objectPath, filename);
  } else {
    const { data, error } = await createAdminClient().storage.from(releaseBucket)
      .createSignedUrl(objectPath, 60, { download: filename });
    if (error) throw error;
    location = data.signedUrl;
  }
  return new Response(null, { status: 302, headers: { ...noReleaseCache, Location: location } });
}
