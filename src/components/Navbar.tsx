import { useState, useEffect, useRef } from "react";
import { scrollToSection } from "../utils/ScrollToSection";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

import { GiHamburgerMenu } from "react-icons/gi";

interface NavbarProps {
  pageType: "land" | "protected" | "login" | "signup" | "none";
}

const Navbar: React.FC<NavbarProps> = ({ pageType }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<any>(null);

  const goHome = () => {
    if (pageType == "none") {
      navigate("/landing");
    } else {
      navigate("/");
    }
  };
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  //@ts-ignore
  const handleClickOutside = (event: MouseEvent) => {
    if (sidebarRef.current != null) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav>
      <img src="/logo.png" alt="Logo" onClick={goHome} />
      <div className="nav-links">
        {pageType === "land" && (
          <>
            <a href="http://dev-dhawan.com/">About</a>
            <p onClick={() => scrollToSection("pricing")}>Pricing</p>
            <Link to="/contact/">Contact</Link>
          </>
        )}
        {pageType === "protected" && (
          <>
            <Link to="/create-form">Create Form</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/archive">Archive</Link>
          </>
        )}
      </div>
      <div className="nav-buttons">
        {pageType === "land" && (
          <>
            <button className="login-button" onClick={() => navigate("/login")}>
              Login
            </button>
            <button
              className="get-started-button"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          </>
        )}
        {pageType === "protected" && (
          <>
            <button
              className="get-started-button"
              onClick={() => navigate("/logout")}
            >
              Log Out
            </button>
          </>
        )}
        {pageType === "login" && (
          <>
            <button
              className="login-button"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </>
        )}
        {pageType === "signup" && (
          <>
            <button className="login-button" onClick={() => navigate("/login")}>
              Login
            </button>
          </>
        )}
      </div>
      {pageType !== "none" && (
        <GiHamburgerMenu
          className="hamburger-icon"
          size={"40px"}
          onClick={toggleSidebar}
        />
      )}
      <div className={`sidebar ${isOpen ? "open" : ""}`} ref={sidebarRef}>
        <br />
        <ul>
          {pageType === "land" && (
            <>
              <li>
                <a href="http://dev-dhawan.com/">About</a>
              </li>
              <li>
                <a onClick={() => scrollToSection("pricing")}>Pricing</a>
              </li>
              <li>
                <Link to="/contact/">Contact</Link>
              </li>
            </>
          )}
          {pageType === "protected" && (
            <>
              <li>
                <Link to="/">Home</Link>
              </li>

              <li>
                <Link to="/create-form">Create Form</Link>
              </li>

              <li>
                <Link to="/profile">Profile</Link>
              </li>

              <li>
                <Link to="/archive">Archive</Link>
              </li>
            </>
          )}
          {pageType === "land" && (
            <>
              <li>
                <button
                  className="login-button"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  className="get-started-button"
                  onClick={() => navigate("/signup")}
                >
                  Get Started
                </button>
              </li>
            </>
          )}
          {pageType === "protected" && (
            <>
              <li>
                <button
                  className="get-started-button"
                  onClick={() => navigate("/logout")}
                >
                  Log Out
                </button>
              </li>
            </>
          )}
          {pageType === "login" && (
            <>
              <li>
                <button
                  className="login-button"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </button>
              </li>
            </>
          )}
          {pageType === "signup" && (
            <>
              <button
                className="login-button"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
