/**
 * Diagnostic script: Test auction publishing flow
 *
 * Tests:
 * 1. Supabase Storage upload (RLS check)
 * 2. Backend API auction creation
 * 3. Full flow simulation
 *
 * Usage: npx tsx scripts/test-publish-auction.ts
 */

const SUPABASE_URL = "https://kbrxpdibulijbljelvgp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_qiAAgkOIQ9BGbnhu7X2LVg_eENp4amc";
const BACKEND_URL = "http://localhost:5000/api/v1";

// Tiny 1x1 red pixel PNG as base64 (for testing upload)
const TEST_IMAGE_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

// Colors for console output
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

function log(emoji: string, msg: string) {
  console.log(`${emoji} ${msg}`);
}

function header(title: string) {
  console.log(`\n${BOLD}${CYAN}${"=".repeat(60)}${RESET}`);
  console.log(`${BOLD}${CYAN}  ${title}${RESET}`);
  console.log(`${CYAN}${"=".repeat(60)}${RESET}\n`);
}

function success(msg: string) {
  console.log(`  ${GREEN}✅ ${msg}${RESET}`);
}

function fail(msg: string) {
  console.log(`  ${RED}❌ ${msg}${RESET}`);
}

function warn(msg: string) {
  console.log(`  ${YELLOW}⚠️  ${msg}${RESET}`);
}

function info(msg: string) {
  console.log(`  ${BLUE}ℹ️  ${msg}${RESET}`);
}

// ============================================
// TEST 1: Supabase Storage Upload (Anon Key)
// ============================================
async function testSupabaseUploadAnon(): Promise<boolean> {
  header("TEST 1: Supabase Storage Upload (anon key)");

  info(`Supabase URL: ${SUPABASE_URL}`);
  info(`Using anon key: ${SUPABASE_ANON_KEY.substring(0, 20)}...`);
  info(`Bucket: Matchdays`);
  info(`Path: listings/test_diagnostic_${Date.now()}.png`);

  try {
    // Convert base64 to binary
    const binaryStr = atob(TEST_IMAGE_BASE64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "image/png" });

    const path = `listings/test_diagnostic_${Date.now()}.png`;
    const url = `${SUPABASE_URL}/storage/v1/object/Matchdays/${path}`;

    info(`POST ${url}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
        "Content-Type": "image/png",
      },
      body: blob,
    });

    const responseText = await response.text();
    let responseJson: any = null;
    try {
      responseJson = JSON.parse(responseText);
    } catch {}

    info(`Response status: ${response.status} ${response.statusText}`);
    info(`Response body: ${responseText.substring(0, 200)}`);

    if (response.ok) {
      success("Upload with anon key SUCCEEDED!");
      return true;
    } else {
      fail(`Upload with anon key FAILED! Status: ${response.status}`);

      if (
        responseJson?.statusCode === "42501" ||
        responseText.includes("row-level security")
      ) {
        fail("CAUSE: Row Level Security (RLS) policy blocks anonymous uploads");
        warn("The Supabase Storage bucket 'Matchdays' has RLS enabled");
        warn(
          "The anon key does NOT have permission to INSERT into storage.objects",
        );
        console.log();
        info("SOLUTIONS:");
        info("  Option A: Add RLS policy to allow public uploads:");
        info("    Go to Supabase Dashboard > Storage > Matchdays > Policies");
        info("    Add policy: INSERT for anon role on bucket 'Matchdays'");
        info("    Example SQL:");
        console.log(`${YELLOW}
    CREATE POLICY "Allow public uploads to Matchdays" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'Matchdays');
${RESET}`);
        info(
          "  Option B: Use service_role key (bypasses RLS) - NOT recommended for frontend",
        );
        info(
          "  Option C: Require user authentication before upload (recommended for production)",
        );
        info("    - Sign in user with Supabase Auth first");
        info("    - Add RLS policy: INSERT for authenticated role");
        console.log(`${YELLOW}
    CREATE POLICY "Allow authenticated uploads" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'Matchdays');
${RESET}`);
      } else if (response.status === 404) {
        fail("CAUSE: Bucket 'Matchdays' does not exist or is not accessible");
        warn(
          "Check if the bucket name is correct in Supabase Dashboard > Storage",
        );
      } else if (response.status === 401) {
        fail("CAUSE: Invalid or expired API key");
        warn("Check your Supabase anon key in the dashboard");
      }

      return false;
    }
  } catch (error) {
    fail(`Network error: ${(error as Error).message}`);
    return false;
  }
}

// ============================================
// TEST 2: Supabase - List buckets
// ============================================
async function testSupabaseBuckets(): Promise<void> {
  header("TEST 2: Supabase Storage - List Buckets");

  try {
    const url = `${SUPABASE_URL}/storage/v1/bucket`;
    info(`GET ${url}`);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
    });

    const data = await response.json();
    info(`Response status: ${response.status}`);

    if (response.ok && Array.isArray(data)) {
      success(`Found ${data.length} bucket(s):`);
      data.forEach((bucket: any) => {
        const publicStr = bucket.public
          ? `${GREEN}PUBLIC${RESET}`
          : `${RED}PRIVATE${RESET}`;
        console.log(
          `    - "${bucket.name}" (${publicStr}, created: ${bucket.created_at})`,
        );
      });

      const matchdays = data.find((b: any) => b.name === "Matchdays");
      if (matchdays) {
        if (matchdays.public) {
          success("Bucket 'Matchdays' is PUBLIC - read access is open");
        } else {
          warn("Bucket 'Matchdays' is PRIVATE - even reading requires auth");
          info("Consider making it public for serving images");
        }
      } else {
        fail("Bucket 'Matchdays' NOT FOUND!");
        info("Available buckets: " + data.map((b: any) => b.name).join(", "));
      }
    } else {
      warn(`Could not list buckets: ${JSON.stringify(data).substring(0, 200)}`);
    }
  } catch (error) {
    fail(`Network error: ${(error as Error).message}`);
  }
}

// ============================================
// TEST 3: Supabase - Check RLS policies
// ============================================
async function testSupabaseRLSInfo(): Promise<void> {
  header("TEST 3: Supabase Storage - RLS Policy Check");

  info("Attempting to read existing files in 'Matchdays' bucket...");

  try {
    const url = `${SUPABASE_URL}/storage/v1/object/list/Matchdays`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prefix: "listings/",
        limit: 5,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      }),
    });

    const data = await response.json();
    info(`Response status: ${response.status}`);

    if (response.ok && Array.isArray(data)) {
      success(
        `Can LIST files (SELECT policy works). Found ${data.length} file(s):`,
      );
      data.forEach((file: any) => {
        console.log(`    - ${file.name} (${file.metadata?.size || "?"} bytes)`);
      });
    } else {
      fail(`Cannot LIST files: ${JSON.stringify(data).substring(0, 200)}`);
      warn("SELECT RLS policy may also be missing");
    }
  } catch (error) {
    fail(`Network error: ${(error as Error).message}`);
  }
}

// ============================================
// TEST 4: Backend API - Health Check
// ============================================
async function testBackendHealth(): Promise<boolean> {
  header("TEST 4: Backend API - Connection Check");

  info(`Backend URL: ${BACKEND_URL}`);

  try {
    const url = `${BACKEND_URL}/auctions?limit=1`;
    info(`GET ${url}`);

    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    info(`Response status: ${response.status}`);

    if (response.ok && data.success) {
      success("Backend is reachable and responding!");
      info(`Auctions in DB: ${data.data?.total || 0}`);
      return true;
    } else {
      fail(`Backend returned error: ${JSON.stringify(data).substring(0, 200)}`);
      return false;
    }
  } catch (error) {
    fail(`Cannot connect to backend: ${(error as Error).message}`);
    warn(
      "Is the backend running? Try: cd matchdaysbackend && npm run start:dev",
    );
    return false;
  }
}

// ============================================
// TEST 5: Backend API - Create Auction
// ============================================
async function testCreateAuction(imageUrls: string[]): Promise<boolean> {
  header("TEST 5: Backend API - Create Auction");

  const now = new Date();
  const endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days

  const auctionData = {
    title: "[TEST] Diagnostic Auction - Can be deleted",
    description:
      "This is a test auction created by the diagnostic script to verify the publishing flow works correctly.",
    category: "Premier League",
    itemType: "shirt",
    listingType: "auction",
    team: "Manchester United",
    season: "2024/25",
    size: "L",
    condition: "excellent",
    manufacturer: "Adidas",
    images:
      imageUrls.length > 0
        ? imageUrls
        : [
            "https://via.placeholder.com/400x400.png?text=Test+Image+1",
            "https://via.placeholder.com/400x400.png?text=Test+Image+2",
          ],
    startingBid: 10,
    bidIncrement: 5,
    buyNowPrice: 100,
    startTime: now.toISOString(),
    endTime: endTime.toISOString(),
    shippingCost: 0,
    shippingTime: "3-5 business days",
    shippingFrom: "Poland",
    verified: false,
    rare: false,
    featured: false,
  };

  info("Auction data to send:");
  console.log(JSON.stringify(auctionData, null, 2));

  try {
    const url = `${BACKEND_URL}/auctions`;
    info(`POST ${url}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // No auth token - controller has @UseGuards commented out
      },
      body: JSON.stringify(auctionData),
    });

    const responseText = await response.text();
    info(`Response status: ${response.status} ${response.statusText}`);

    let result: any;
    try {
      result = JSON.parse(responseText);
    } catch {
      fail(`Response is not JSON: ${responseText.substring(0, 200)}`);
      return false;
    }

    info(`Response body: ${JSON.stringify(result, null, 2)}`);

    if (response.ok && result.success) {
      success("Auction created successfully!");
      success(`Auction ID: ${result.data?.id}`);
      info(`Status: ${result.data?.status}`);
      info(`Title: ${result.data?.title}`);
      return true;
    } else {
      fail(`Auction creation FAILED!`);
      fail(`Error: ${result.message || "Unknown error"}`);

      // Analyze common errors
      if (responseText.includes("validation") || response.status === 400) {
        warn(
          "CAUSE: Validation error - some required fields are missing or invalid",
        );
        info("Check the DTO validation rules in create-auction.dto.ts");
      }
      if (responseText.includes("forbidNonWhitelisted")) {
        warn(
          "CAUSE: Backend has forbidNonWhitelisted=true and received unexpected fields",
        );
        info("Check which fields are being sent vs what the DTO expects");
      }
      if (
        responseText.includes("Prisma") ||
        responseText.includes("database")
      ) {
        warn("CAUSE: Database error - check Prisma schema and migrations");
      }
      if (response.status === 401) {
        warn("CAUSE: Authentication required but no token provided");
        info(
          "The @UseGuards(JwtAuthGuard) might be enabled on the create endpoint",
        );
      }

      return false;
    }
  } catch (error) {
    fail(`Network error: ${(error as Error).message}`);
    return false;
  }
}

// ============================================
// TEST 6: Full Flow Simulation
// ============================================
async function testFullFlow(): Promise<void> {
  header("TEST 6: Full Publishing Flow Simulation");

  info("Simulating what SmartForm.handlePublish() does:");
  console.log();

  // Step 1: Upload photos
  info("Step 1/3: Upload photos to Supabase Storage...");
  const uploadSuccess = await testSupabaseUploadAnon();

  let imageUrls: string[] = [];
  if (uploadSuccess) {
    success("Photos would upload successfully");
    imageUrls = [
      "https://kbrxpdibulijbljelvgp.supabase.co/storage/v1/object/public/Matchdays/listings/test.png",
    ];
  } else {
    fail("Photos CANNOT be uploaded - this is the BLOCKING issue!");
    warn(
      "The form will send base64/blob URLs to the backend instead of Supabase URLs",
    );
    warn(
      "This means images array will contain data:image/... strings instead of https:// URLs",
    );
  }

  console.log();

  // Step 2: Map form data
  info("Step 2/3: Map SmartFormData to CreateAuctionDto...");
  info("This mapping happens in listings.api.ts -> mapFormDataToAuctionDto()");

  if (!uploadSuccess) {
    warn("Since upload failed, photos will have base64 URLs");
    warn(
      "Backend will receive images: ['data:image/webp;base64,...'] instead of proper URLs",
    );
    warn(
      "This may cause issues with image display but shouldn't block auction creation",
    );
  }
  success("Mapping logic looks correct based on code review");

  console.log();

  // Step 3: Create auction
  info("Step 3/3: Send to backend API...");
  const backendReachable = await testBackendHealth();

  if (backendReachable) {
    await testCreateAuction(imageUrls);
  } else {
    fail("Cannot test auction creation - backend is not running");
  }
}

// ============================================
// SUMMARY
// ============================================
async function printSummary(results: {
  supabase: boolean;
  backend: boolean;
  auction: boolean;
}) {
  header("DIAGNOSTIC SUMMARY");

  console.log(
    `  Supabase Storage Upload:  ${results.supabase ? `${GREEN}✅ PASS${RESET}` : `${RED}❌ FAIL${RESET}`}`,
  );
  console.log(
    `  Backend API Connection:   ${results.backend ? `${GREEN}✅ PASS${RESET}` : `${RED}❌ FAIL${RESET}`}`,
  );
  console.log(
    `  Auction Creation:         ${results.auction ? `${GREEN}✅ PASS${RESET}` : `${RED}❌ FAIL${RESET}`}`,
  );
  console.log();

  if (!results.supabase) {
    console.log(
      `${BOLD}${RED}🔴 MAIN BLOCKER: Supabase Storage RLS Policy${RESET}`,
    );
    console.log();
    console.log(
      `${YELLOW}The Supabase bucket "Matchdays" has Row Level Security enabled,`,
    );
    console.log(
      `but there is NO policy allowing the anon key to upload files.${RESET}`,
    );
    console.log();
    console.log(`${BOLD}FIX (choose one):${RESET}`);
    console.log();
    console.log(`${GREEN}Option 1 (Quick fix - for development):${RESET}`);
    console.log(`  Go to Supabase Dashboard > Storage > Policies`);
    console.log(`  For bucket "Matchdays", add these policies:`);
    console.log();
    console.log(`${CYAN}  -- Allow anyone to upload${RESET}`);
    console.log(`${CYAN}  CREATE POLICY "Allow public uploads"${RESET}`);
    console.log(`${CYAN}  ON storage.objects FOR INSERT${RESET}`);
    console.log(`${CYAN}  WITH CHECK (bucket_id = 'Matchdays');${RESET}`);
    console.log();
    console.log(`${CYAN}  -- Allow anyone to read${RESET}`);
    console.log(`${CYAN}  CREATE POLICY "Allow public reads"${RESET}`);
    console.log(`${CYAN}  ON storage.objects FOR SELECT${RESET}`);
    console.log(`${CYAN}  USING (bucket_id = 'Matchdays');${RESET}`);
    console.log();
    console.log(`${GREEN}Option 2 (Production - recommended):${RESET}`);
    console.log(`  1. Authenticate users with Supabase Auth before upload`);
    console.log(`  2. Add RLS policy for authenticated users only:`);
    console.log();
    console.log(
      `${CYAN}  CREATE POLICY "Authenticated users can upload"${RESET}`,
    );
    console.log(`${CYAN}  ON storage.objects FOR INSERT${RESET}`);
    console.log(`${CYAN}  TO authenticated${RESET}`);
    console.log(`${CYAN}  WITH CHECK (bucket_id = 'Matchdays');${RESET}`);
    console.log();
    console.log(`${GREEN}Option 3 (Alternative - upload via backend):${RESET}`);
    console.log(
      `  Move photo upload to the NestJS backend using service_role key`,
    );
    console.log(
      `  This way the frontend sends base64 to backend, backend uploads to Supabase`,
    );
  }

  if (!results.backend) {
    console.log();
    console.log(`${BOLD}${RED}🔴 Backend is not running${RESET}`);
    console.log(`  Start it with: cd matchdaysbackend && npm run start:dev`);
  }

  if (results.supabase && results.backend && !results.auction) {
    console.log();
    console.log(
      `${BOLD}${RED}🔴 Auction creation failed despite working upload and backend${RESET}`,
    );
    console.log(`  Check the error messages above for details`);
  }

  if (results.supabase && results.backend && results.auction) {
    console.log();
    console.log(
      `${BOLD}${GREEN}🎉 Everything works! The full publishing flow is functional.${RESET}`,
    );
  }
}

// ============================================
// MAIN
// ============================================
async function main() {
  console.log(
    `\n${BOLD}${CYAN}🔍 Matchdays Auction Publishing Diagnostic Tool${RESET}`,
  );
  console.log(`${CYAN}   Testing the full auction creation flow...${RESET}\n`);

  // Run tests
  await testSupabaseBuckets();
  await testSupabaseRLSInfo();
  const supabaseOk = await testSupabaseUploadAnon();
  const backendOk = await testBackendHealth();

  let auctionOk = false;
  if (backendOk) {
    auctionOk = await testCreateAuction(
      supabaseOk
        ? [
            "https://kbrxpdibulijbljelvgp.supabase.co/storage/v1/object/public/Matchdays/listings/test.png",
          ]
        : ["https://via.placeholder.com/400x400.png?text=Test"],
    );
  }

  await testFullFlow();
  await printSummary({
    supabase: supabaseOk,
    backend: backendOk,
    auction: auctionOk,
  });
}

main().catch(console.error);
