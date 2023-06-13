import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes, faRightToBracket, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import logo from '../../img/logo.png'
import { logout } from './logout';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [showLinks, setShowLinks] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1300);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const updateMedia = () => {
      setIsDesktop(window.innerWidth > 1300);
    };
  
    useEffect(() => {
      window.addEventListener("resize", updateMedia);
      return () => window.removeEventListener("resize", updateMedia);
    }, []);
  
    useEffect(() => {
      if (isDesktop) {
        setShowLinks(true);
      } else {
        setShowLinks(false);
      }

      const token = localStorage.getItem('token');
      setIsAuthenticated(token !== null);
    }, [isDesktop]);
  
    const handleToggle = () => {
      if (!isDesktop) {
        setShowLinks(!showLinks);
      }
    };

    const handleLogout = () => {
      logout();
      setIsAuthenticated(false);
      navigate('/');
    };

    return (
      <header>
        <div className="logo-menu">
            <a onClick={() => navigate("/")}><img src={logo} alt="Logo" /></a>
            <button onClick={handleToggle}>
              <FontAwesomeIcon icon={showLinks ? faTimes : faBars} />
            </button>
        </div>
        {showLinks && (
          <div className="navlinks">
            <ul>
              {isAuthenticated ? (
                <>
                  <li><a><button>Mon Compte</button></a></li>
                  <li><a onClick={handleLogout}><button>Déconnexion</button></a></li>
                </>
              ) : (
                <>
                  <li><a onClick={() => navigate("/login")}><button><FontAwesomeIcon icon={faRightToBracket}/> Connexion</button></a></li>
                  <li><a onClick={() => navigate("/inscription")}><button><FontAwesomeIcon icon={faRightFromBracket}/> Inscription</button></a></li>
                </>
              )}
            </ul>
          </div>
        )}
      </header>
    );
}

export default Navbar;