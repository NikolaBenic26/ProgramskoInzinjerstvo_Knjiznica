import React, { useState, useEffect } from 'react';
import './StranicaAdmin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const StranicaAdmin = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  

  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/prijava');
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.role === 'admin') {
          setIsAdmin(true);
          fetchMembers();
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        navigate('/prijava');
      }
    };

    checkAdmin();
  }, [navigate]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:8800/clanovi', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await axios.delete(`http://localhost:8800/clanovi/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchMembers();
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8800/clanovi/${editingMember.id_clan}`, editingMember, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEditingMember(null);
      fetchMembers();
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('token');
      navigate('/prijava');
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="admin-pageAdmin">
      <aside className="sidebarAdmin">
        <div>
          <div className="menu-headerAdmin">
            <h2>Administrator</h2>
          </div>
          <div className="menu-buttonsAdmin">
            <button>POSUDENE KNJIGE</button>
            <button>KUPLJENE KNJIGE</button>
            <button>ČLANOVI</button>
          </div>
          <div className="filtersAdmin">
            <button>IZMJENA</button>
            <button onClick={handleLogout}>ODJAVA</button>
          </div>
        </div>
      </aside>
      <main className="contentAdmin">
        <header className="headerAdmin">
          <h1>ČLANOVI</h1>
        </header>
        <table className="members-tableAdmin">
          <thead>
            <tr>
              <th>ID</th>
              <th>IME</th>
              <th>PREZIME</th>
              <th>ADRESA</th>
              <th>GRAD</th>
              <th>POŠTANSKI BROJ</th>
              <th>KONTAKT BROJ</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id_clan}>
                {editingMember && editingMember.id_clan === member.id_clan ? (
                  <>
                    <td>{member.id_clan}</td>
                    <td><input type="text" value={editingMember.ime_clana} onChange={e => setEditingMember({ ...editingMember, ime_clana: e.target.value })} /></td>
                    <td><input type="text" value={editingMember.prezime_clana} onChange={e => setEditingMember({ ...editingMember, prezime_clana: e.target.value })} /></td>
                    <td><input type="text" value={editingMember.adresa_clana} onChange={e => setEditingMember({ ...editingMember, adresa_clana: e.target.value })} /></td>
                    <td><input type="text" value={editingMember.grad_clan} onChange={e => setEditingMember({ ...editingMember, grad_clan: e.target.value })} /></td>
                    <td><input type="text" value={editingMember.postanski_broj} onChange={e => setEditingMember({ ...editingMember, postanski_broj: e.target.value })} /></td>
                    <td><input type="text" value={editingMember.kontakt_broj} onChange={e => setEditingMember({ ...editingMember, kontakt_broj: e.target.value })} /></td>
                    <td>
                      <button onClick={handleSave}>Save</button>
                      <button onClick={() => setEditingMember(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{member.id_clan}</td>
                    <td>{member.ime_clana}</td>
                    <td>{member.prezime_clana}</td>
                    <td>{member.adresa_clana}</td>
                    <td>{member.grad_clan}</td>
                    <td>{member.postanski_broj}</td>
                    <td>{member.kontakt_broj}</td>
                    <td>
                      <button onClick={() => handleEdit(member)}>Edit</button>
                      <button onClick={() => handleDelete(member.id_clan)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default StranicaAdmin;
