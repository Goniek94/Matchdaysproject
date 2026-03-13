const { createClient } = require("@supabase/supabase-js");

// Use service role key to modify bucket settings
const s = createClient(
  "https://kbrxpdibulijbljelvgp.supabase.co",
  "sb_secret_d5cIAC6uSAXXvs-tYoaD0A_FpMZ5S7s",
);

async function fixBucket() {
  console.log("=== Making Matchdays bucket public ===");

  // Update bucket to be public
  const { data, error } = await s.storage.updateBucket("Matchdays", {
    public: true,
  });

  if (error) {
    console.error("Error updating bucket:", error);
  } else {
    console.log("Success! Bucket is now public:", data);
  }

  // Verify by fetching a file
  const { data: files } = await s.storage
    .from("Matchdays")
    .list("listings", { limit: 1 });

  if (files && files.length > 0) {
    const testUrl = `https://kbrxpdibulijbljelvgp.supabase.co/storage/v1/object/public/Matchdays/listings/${files[0].name}`;
    console.log("\nTest URL:", testUrl);
    console.log("Try opening this URL in browser to verify it works.");
  }
}

fixBucket();
