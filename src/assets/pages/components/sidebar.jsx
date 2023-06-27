import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import { logout } from './logout';
import logo from '../../img/logo.png';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(token !== null);
        const fetchUser = async () => {
            try {
              if (token) {
                const response = await axios.get(API_BASE_URL + '/api/user/info', {
                  headers: { 'x-auth-token': token },
                  withCredentials: true
                });
                setUser(response.data);
              }
            } catch (err) {
              if (err.response && err.response.status === 404) {
                setUser(null);
                localStorage.removeItem('token');
              } else {
                console.log(err);
              }
            }
          };

        fetchUser();
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const response = await axios.get(API_BASE_URL + '/api/user/roles', { headers: { 'x-auth-token': localStorage.getItem('token') } });
                setRole(response.data.role);
            } catch (err) {
                console.log(err);
            }
        };

        if (isAuthenticated) {
            fetchRole();
        }
    }, [isAuthenticated]);


    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    }

    const handleLogout = () => {
        logout();
        setIsAuthenticated(false);
        navigate('/');
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div class="logo-details">
                <a onClick={() => navigate("/")}>
                    <img src={logo} className="logo_name" alt="Logo" />
                </a>
                <i class={`bx ${isOpen ? 'bx-menu-alt-right' : 'bx-menu-alt-left'}`} id="btn" onClick={toggleSidebar} ></i>
            </div>
            <ul class="nav-list">
                <li>
                    <a onClick={() => navigate("/#")}>
                        <i class='bx bx-home' ></i>
                        <span class="links_name">Acceuil</span>
                    </a>
                    <span class="tooltip">Acceuil</span>
                </li>
                <li>
                    <a href="#">
                        <i class='bx bx-news' ></i>
                        <span class="links_name">Articles</span>
                    </a>
                    <span class="tooltip">Articles</span>
                </li>
                {isAuthenticated ? (
                    <>
                        <li>
                            <a onClick={() => navigate("/account")}>
                                <i class='bx bx-user' ></i>
                                <span class="links_name">Mon compte</span>
                            </a>
                            <span class="tooltip">Mon compte</span>
                        </li>
                        <li class="profile">
                            <div class="profile-details">
                                <i class='bx bx-user' ></i>
                                <div class="name_job">
                                    <div class="name">{user?.firstname} {user?.lastname}</div>
                                    <div class="job">{user?.work}</div>
                                </div>
                            </div>
                            <a onClick={handleLogout}><i class='bx bx-log-out' id="log_out" ></i></a>
                        </li>

                        {isAuthenticated && role === 'admin' && (
                            <>
                                <div className="seperation">
                                    <div className="line"></div>
                                    <p>Admin</p>
                                </div>
                                <li>
                                    <a onClick={() => navigate("/admin/list-user")}>
                                        <i class='bx bx-user'></i>
                                        <span class="links_name">List users</span>
                                    </a>
                                    <span class="tooltip">List users</span>
                                </li>
                                <li>
                                    <a href="#">
                                        <i class='bx bx-news'></i>
                                        <span class="links_name">List articles</span>
                                    </a>
                                    <span class="tooltip">List articles</span>
                                </li>
                            </>
                        )}
                    </>
                ) : (
                    <li class="profile">
                        <div class="profile-details">
                            <div className="connect">
                                <a onClick={() => navigate("/login")}>
                                    <i class='bx bx-log-in' ></i>
                                    <span class="links_name">Se connecter</span>
                                </a>
                            </div>
                        </div>

                    </li>
                )}
            </ul>
        </div>
    );
}

export default Sidebar;
