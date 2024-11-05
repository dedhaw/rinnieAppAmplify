import { useNavigate } from "react-router-dom";

interface NavbarProps {
  backgroundColor: string;
  secondaryColor: string;
  logo?: Blob | null;
}

const Navbar: React.FC<NavbarProps> = ({
  backgroundColor,
  secondaryColor,
  logo,
}) => {
  const navigate = useNavigate();
  return (
    <nav
      style={{
        backgroundColor: backgroundColor,
        borderBottom: "1px solid " + secondaryColor,
      }}
    >
      {!logo && (
        <img src="/logo.png" alt="Logo" onClick={() => navigate("/landing/")} />
      )}
    </nav>
  );
};

export default Navbar;
