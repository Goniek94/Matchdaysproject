import Navbar from "@/components/Navbar";
import ImageGallery from "@/components/auction/ImageGallery";
import CountdownTimer from "@/components/auction/CountdownTimer";
import BidPanel from "@/components/auction/BidPanel";
import SellerInfo from "@/components/auction/SellerInfo";
import BidHistory from "@/components/auction/BidHistory";
import ProductDetails from "@/components/auction/ProductDetails";
import InfoCards from "@/components/auction/InfoCards";
import Footer from "@/components/Footer";
import Link from "next/link";
import { mockAuctions, mockBidHistory } from "@/lib/mockData";

interface AuctionDetailPageProps {
  params: {
    id: string;
  };
}

export default function AuctionDetailPage({ params }: AuctionDetailPageProps) {
  // Get auction from mock data
  const auction =
    mockAuctions.find((a) => a.id === params.id) || mockAuctions[0];

  const productDetails = [
    { label: "Size", value: "Large (L)" },
    { label: "Condition", value: "Excellent" },
    { label: "Season", value: "2007/08" },
    { label: "Brand", value: "Nike" },
    { label: "Type", value: "Home Kit" },
    { label: "Country", value: "England" },
    { label: "Player", value: "No Name/Number" },
    { label: "Material", value: "100% Polyester" },
  ];

  const description =
    "Authentic Manchester United home shirt from the historic 2007/08 season when the Red Devils won both the Premier League and UEFA Champions League. This iconic Nike jersey features the classic red with black trim design and AIG sponsor. The shirt is in excellent condition with minimal signs of wear. All logos, badges, and prints are intact. Includes original tags and comes from a smoke-free, pet-free environment. A true collector's item from one of United's greatest seasons.";

  return (
    <main className="bg-white">
      <Navbar />

      <div className="pt-24 px-8">
        <div className="container-max">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-black transition-colors">
              Auctions
            </Link>
            <span>/</span>
            <Link href="#" className="hover:text-black transition-colors">
              Premier League
            </Link>
            <span>/</span>
            <span className="text-black">{auction.title}</span>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left: Image Gallery */}
            <div>
              <ImageGallery
                images={auction.images || [auction.image]}
                title={auction.title}
                verified={auction.verified}
                rare={auction.rare}
              />
            </div>

            {/* Right: Auction Details */}
            <div>
              {/* Title & Subtitle */}
              <h1 className="text-4xl font-light mb-2 tracking-tight">
                {auction.title}
              </h1>
              <p className="text-gray-600 mb-8">{auction.description}</p>

              {/* Countdown Timer */}
              <CountdownTimer initialSeconds={9234} />

              {/* Bid Panel */}
              <BidPanel
                currentBid={auction.currentBid}
                bidCount={auction.bidCount}
              />

              {/* Seller Info */}
              <SellerInfo seller={auction.seller} />

              {/* Bid History */}
              <BidHistory bids={mockBidHistory} />

              {/* Product Details */}
              <ProductDetails
                description={description}
                details={productDetails}
              />

              {/* Info Cards */}
              <InfoCards />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
