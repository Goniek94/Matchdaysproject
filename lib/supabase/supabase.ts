import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kbrxpdibulijbljelvgp.supabase.co";
const supabaseAnonKey = "sb_publishable_qiAAgkOIQ9BGbnhu7X2LVg_eENp4amc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadPhoto = async (
  file: string, // base64 string
  fileName: string,
  mimeType: string = "image/jpeg",
): Promise<string | null> => {
  try {
    // Konwertuj base64 na Blob
    const base64Data = file.startsWith("data:") ? file.split(",")[1] : file;

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Upload do Supabase Storage
    const path = `listings/${Date.now()}_${fileName}`;
    const { data, error } = await supabase.storage
      .from("Matchdays")
      .upload(path, blob, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      console.error("[Supabase] Upload error:", error);
      return null;
    }

    // Zwróć publiczny URL
    const { data: urlData } = supabase.storage
      .from("Matchdays")
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (err) {
    console.error("[Supabase] Upload failed:", err);
    return null;
  }
};

export const uploadPhotos = async (
  photos: Array<{ url: string; typeHint: string | null }>,
): Promise<Array<{ url: string; typeHint: string | null }>> => {
  const uploaded = await Promise.all(
    photos
      .filter((p) => p.url && p.url.startsWith("data:"))
      .map(async (photo, index) => {
        const mimeType = photo.url.match(/^data:([^;]+);/)?.[1] || "image/jpeg";
        const ext = mimeType.split("/")[1] || "jpg";
        const fileName = `${photo.typeHint || "photo"}_${index}.${ext}`;

        const publicUrl = await uploadPhoto(photo.url, fileName, mimeType);

        return {
          url: publicUrl || photo.url, // fallback na base64 jeśli upload się nie uda
          typeHint: photo.typeHint,
        };
      }),
  );

  return uploaded;
};
