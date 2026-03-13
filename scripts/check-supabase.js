const { createClient } = require("@supabase/supabase-js");

const s = createClient(
  "https://kbrxpdibulijbljelvgp.supabase.co",
  "sb_publishable_qiAAgkOIQ9BGbnhu7X2LVg_eENp4amc",
);

async function check() {
  // List files in bucket
  const { data, error } = await s.storage
    .from("Matchdays")
    .list("listings", { limit: 5 });

  console.log("=== Supabase Storage Check ===");
  console.log("Error:", error);
  console.log("Files found:", data?.length || 0);

  if (data && data.length > 0) {
    data.forEach((file) => {
      const { data: urlData } = s.storage
        .from("Matchdays")
        .getPublicUrl(`listings/${file.name}`);
      console.log(`File: ${file.name} -> ${urlData.publicUrl}`);
    });
  }
}

check();
