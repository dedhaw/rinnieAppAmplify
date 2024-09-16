import PricingCard from "./PricingCard";

function PricingSection() {
  return (
    <div id="pricing">
      <br />
      <h1>Pricing</h1>
      <div className="pricing-container">
        <PricingCard
          title="Trial Tier"
          discription="For agents wanting to test out Rinnie's capabilities."
          price="Free"
          features={[
            "2 free forms a month",
            "1.99 for additional forms",
            "Basic form generation",
            "Store up to 6 forms",
          ]}
        />

        <PricingCard
          title="Pro Tier"
          discription="For agents activily selling."
          price="$6.99/mo"
          features={[
            "Unlimited form generation a month",
            "Store up to 20 forms",
            "Email forms to clients for them to fill out",
            "Get emails with the completed form",
            "Receive instant notifications when clients begin filling out the form",
          ]}
          backgroundColor="#ff914b"
          isMiddleCard={true}
        />

        <PricingCard
          title="Premium Tier"
          discription="For agents looking to personalize their experience with Rinnie."
          price="$10.99/mo"
          features={[
            "All features listed in pro tier",
            "Store an additonal 70 forms",
            "Personalize forms through your colors, banners, and logos",
            "Additional AI features such as voice to form generation",
          ]}
        />
      </div>
    </div>
  );
}

export default PricingSection;
