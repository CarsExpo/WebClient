import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [editingUser, setEditingUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 800) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(4);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_BASE_URL + '/api/admin/fetch/allUser', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setError('API did not return an array');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(API_BASE_URL + '/api/admin/fetch/allRoles', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      if (Array.isArray(response.data)) {
        setRoles(response.data);
      } else {
        setError('API did not return an array');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteUser = (id) => {
    setEditingUser(null);
    setShowConfirmationModal(true);
    setUserIdToDelete(id);
  };

  const confirmDeleteUser = async () => {
    try {
      await axios.delete(API_BASE_URL + `/api/admin/deleteUser/${userIdToDelete}`);
      fetchUsers();
      setShowConfirmationModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelDeleteUser = () => {
    setShowConfirmationModal(false);
    setUserIdToDelete(null);
  };

  useEffect(() => {
    if (editingUser) {
      setPassword('');
    }
  }, [editingUser]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'password') {
      setPassword(value);
    } else {
      setEditingUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (editingUser.email && !emailRegex.test(editingUser.email)) {
      setErrorMessage('Veuillez entrer une adresse e-mail valide.');
      return;
    }

    try {
      const updatedUser = { ...editingUser };
      let updatedPassword = null;

      if (password.trim() !== '') {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{8,}$/;
        if (!passwordRegex.test(password)) {
          console.log('Mot de passe invalide');
          setErrorMessage(
            'Veuillez entrer un mot de passe valide. Le mot de passe doit contenir au moins 8 caractères, dont au moins une lettre et un chiffre.'
          );
          return;
        }
        updatedPassword = password;
      }

      await axios.put(API_BASE_URL + `/api/admin/updateUser/${editingUser._id}`, { user: updatedUser, password: updatedPassword });
      fetchUsers();
      setEditingUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRoleChange = (selectedRoleId) => {
    setEditingUser((prevUser) => ({
      ...prevUser,
      roles: selectedRoleId,
    }));
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.discord.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentUsers = filteredUsers.slice(firstIndex, lastIndex);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="fetch-alluser">
      <h1>Liste des utilisateurs</h1>
      {error && <p className="error-message">{error}</p>}
      <input
        type="search"
        placeholder="Chercher un utilisateur"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="search"
      />
      {filteredUsers.length === 0 ? (
        <p>Aucun utilisateur trouvé</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôles</th>
              <th>Métier</th>
              <th>Discord</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  {user.firstname} {user.lastname}
                </td>
                <td>{user.email}</td>
                <td>{user.roles}</td>
                <td>{user.work}</td>
                <td>{user.discord}</td>
                <td className="action">
                  <i className="bx bx-edit" onClick={() => setEditingUser(user)}></i>
                  <i className="bx bx-trash" onClick={() => deleteUser(user._id)}></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editingUser && (
        <div className="modal">
          <div className="modal-content">
            <h2>Modifier l'utilisateur</h2>
            <form>
              <div className="input-field">
                <div className="form__group field">
                  <input
                    type="input"
                    className="form__field"
                    placeholder="Prénom"
                    name="firstname"
                    value={editingUser.firstname}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="firstname" className="form__label">
                    Prénom
                  </label>
                </div>
                <div className="form__group field">
                  <input
                    type="input"
                    className="form__field"
                    placeholder="Nom"
                    name="lastname"
                    value={editingUser.lastname}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="lastname" className="form__label">
                    Nom
                  </label>
                </div>
              </div>
              <div className="input-field">
                <div className="form__group field">
                  <input
                    type="input"
                    className="form__field"
                    placeholder="Email"
                    name="email"
                    value={editingUser.email}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="email" className="form__label">
                    Email
                  </label>
                </div>
                <div className="form__group field">
                  <input
                    type="password"
                    className="form__field"
                    placeholder="Mot de passe"
                    name="password"
                    value={password}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="password" className="form__label">
                    Mot de passe
                  </label>
                </div>
              </div>
              <div className="input-field">
                <div className="form__group field">
                  <input
                    type="input"
                    className="form__field"
                    placeholder="Métier"
                    name="work"
                    value={editingUser.work}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="work" className="form__label">
                    Métier
                  </label>
                </div>
                <div className="form__group field">
                  <input
                    type="input"
                    className="form__field"
                    placeholder="Discord"
                    name="discord"
                    value={editingUser.discord}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="discord" className="form__label">
                    Discord
                  </label>
                </div>
              </div>
              <div className="select-menu">
                <div className="form__group field select-roles">
                  <select
                    name="roles"
                    id="roles"
                    value={editingUser.roles._id}
                    onChange={(event) => handleRoleChange(event.target.value)}
                  >
                    {roles.map((role) => (
                      <option key={role._id} value={role._id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="roles" className="form__label">
                    Rôles
                  </label>
                </div>
              </div>
              <p className="error-message">{errorMessage}</p>
              <div className="button-group">
                <button type="submit" className="btn btn-primary" onClick={handleUpdateUser}>
                  Sauvegarder
                </button>
                <button className="btn btn-secondary" onClick={() => setEditingUser(null)}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showConfirmationModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirmation de suppression</h2>
            <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
            <div className="button-group">
              <button className="btn btn-primary" onClick={confirmDeleteUser}>
                Oui
              </button>
              <button className="btn btn-secondary" onClick={cancelDeleteUser}>
                Non
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="pagination">
        {pageNumbers.map((number) => (
          <span key={number} className={currentPage === number ? 'active' : ''} onClick={() => paginate(number)}>
            {number}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ListUser;
