import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUser, faSignOutAlt, faPenToSquare, faTrashCan, faDoorOpen, faHouse, faChildren, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { logout } from './logout';
import { useNavigate } from 'react-router-dom';
import logo from '../../img/logo.png';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';

const Navbar = () => {
  const [showLinks, setShowLinks] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1300);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [deleteError, setDeleteError] = useState(null);
  const dropdownRef = useRef();

  const updateMedia = () => {
    setIsDesktop(window.innerWidth > 1300);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

  const deleteUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(API_BASE_URL + '/api/user/delete', { headers: { 'x-auth-token': token }, withCredentials: true });
      if (response.data.message === "Utilisateur supprimé avec succès. Le token doit être supprimé.") {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/');
      } else {
        throw new Error('Une erreur inattendue s\'est produite lors de la suppression du compte');
      }
    } catch (err) {
      setDeleteError(err.response ? err.response.data.message : err.message);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(API_BASE_URL + '/api/user/info', { headers: { 'x-auth-token': token }, withCredentials: true });
          setUser(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, [isAuthenticated]);

  return (
    <header className={`${(showLinks && !isDesktop) || isScrolling ? 'active' : ''}`}>
      <div className="logo-menu">
        <a onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" />
        </a>
        <button onClick={handleToggle}>
          <FontAwesomeIcon icon={showLinks ? faTimes : faBars} />
        </button>
      </div>
      {showLinks && (
        <div className="navlinks">
          <ul>
            <li><a href="/#acceuil" className='links'><FontAwesomeIcon icon={faHouse} /> <p>Home</p></a></li>
            <li><a href="/#qui-sommes-nous" className='links'><FontAwesomeIcon icon={faChildren} /> <p>Qui sommes-nous?</p></a></li>
            <li><a href="/#pourquoi-nous-rejoindre" className='links'><FontAwesomeIcon icon={faRightFromBracket} /> <p>Pourquoi nous rejoindre?</p></a></li>
            {isAuthenticated ? (
              <div className="dropdown" ref={dropdownRef}>
                <button onClick={toggleDropdown} className="dropbtn">
                  Mon Compte
                </button>
                {dropdownOpen && (
                  <div className="dropdown-content">
                    <div className="user">
                      <div className="user-info">
                        <p className='name'>{user?.firstname} {user?.lastname}</p>
                        <p className='email'>{user?.email}</p>
                      </div>
                      <div className="underline"></div>
                    </div>
                    <div className="options">
                      <a onClick={() => navigate("/edit-account")}><FontAwesomeIcon icon={faPenToSquare} /> Modifier</a>
                      <a onClick={deleteUser}><FontAwesomeIcon icon={faTrashCan} /> Supprimer</a>
                      <a onClick={handleLogout}><FontAwesomeIcon icon={faDoorOpen} /> Déconnexion</a>
                    </div>
                    {deleteError && <p className='error'>{deleteError}</p>}
                  </div>
                )}
              </div>
            ) : (
              <>
                <li>
                  <a onClick={() => navigate("/login")}>
                    <button>
                      <FontAwesomeIcon icon={faUser} /> Connexion
                    </button>
                  </a>
                </li>
                <li>
                  <a onClick={() => navigate("/inscription")}>
                    <button>
                      <FontAwesomeIcon icon={faSignOutAlt} /> Inscription
                    </button>
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;