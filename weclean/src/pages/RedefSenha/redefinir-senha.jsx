import React from 'react';
import './redefinir-senha.css';
import { ToastContainer } from 'react-toastify';
import { PiPasswordFill } from "react-icons/pi";
import { RiLockPasswordFill } from "react-icons/ri";
import { PiPasswordDuotone } from "react-icons/pi";

function RedefinirSenha() {
  return (
    <div className='redef-senha-container'>
      <ToastContainer />
      <div className="redef-senha-content">
        <div className="img-top-rs">
            <PiPasswordDuotone className='rs-icon'/>
        </div>
        <br />
        <div className="top-row-rs">
          <h2>Defina sua nova senha!</h2>
          <span className="rs-subtext">
            Não use senhas muito pequenas! Para melhor segurança, utilize números e caracteres especiais.
          </span>
        </div>
        <form className='rs-form'>
          <input 
            type="password" 
            name="campoNovaSenha" 
            id="campoNovaSenha" 
            placeholder='Digite sua nova senha'
            className='form-control form-control-lg bg-light fs-6'
          />
          <input 
            type="password" 
            name="confirmarNovaSenha" 
            id="confirmarNovaSenha" 
            placeholder='Confirme sua nova senha'
            className='form-control form-control-lg bg-light fs-6'
          />
          <p className="error-message" style={{ color: 'red' }}>As senhas não coincidem.</p>
          <button type="submit" id='btnConfirmarNovaSenha'>Confirmar</button>
        </form>
      </div>
    </div>
  );
}

export default RedefinirSenha;
