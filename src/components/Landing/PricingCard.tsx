import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa6";
import "../../styles/pricing.css";

interface PricingCardProps {
  title: string;
  price: string;
  discription: string;
  features: string[];
  backgroundColor?: string;
  isMiddleCard?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  discription,
  features,
  backgroundColor = "#ebebeb",
  isMiddleCard = false,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`pricing-card ${isMiddleCard ? "middle-card" : ""}`}
      style={{ backgroundColor }}
    >
      <h2 className="price">
        <strong>{title}</strong>
      </h2>
      <h3 className="title">{price}</h3>
      <p>{discription}</p>
      <div className="buttons bottom-line" style={{ marginTop: "-20px" }}>
        <button className="price-button" onClick={() => navigate("/signup/")}>
          Get Started
        </button>
      </div>
      <br />
      {isMiddleCard && (
        <>
          <br />
        </>
      )}
      <ul className="features">
        {features.map((feature, index) => (
          <li key={index}>
            <FaCheck style={{ paddingTop: "3px" }} /> {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PricingCard;
