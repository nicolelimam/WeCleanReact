import React, { useState } from 'react';
import './redefinir-senha.css';
import { ToastContainer, toast } from 'react-toastify';
import { PiPasswordFill } from "react-icons/pi";
import { RiLockPasswordFill } from "react-icons/ri";
import { PiPasswordDuotone } from "react-icons/pi";
import bcrypt from 'bcryptjs';
import { useSearchParams } from 'react-router-dom';
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../backend/firebase';
import { useNavigate } from 'react-router-dom';
import { verifyPasswordResetCode } from 'firebase/auth';


function RedefinirSenha() {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const auth = getAuth();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode'); 
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  React.useEffect(() => {
    const verifyCode = async () => {
      try {
        const userEmail = await verifyPasswordResetCode(auth, oobCode);
        setEmail(userEmail); // Armazena o email recuperado
      } catch (error) {
        console.error('Erro ao verificar o código de redefinição:', error);
        toast.error('Código de redefinição inválido ou expirado.');
      }
    };
  
    if (oobCode) verifyCode();
  }, [oobCode, auth]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }
  
    try {
      // Atualizar senha no Firebase Authentication
      await confirmPasswordReset(auth, oobCode, novaSenha);
  
      // Atualizar senha criptografada no Firestore
      const q = query(collection(db, 'usuarios'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const hashedPassword = await bcrypt.hash(novaSenha, 10); // Criptografar senha
        await updateDoc(userDoc.ref, { senha: hashedPassword });
      }
  
      toast.success('Senha redefinida com sucesso!');
      setNovaSenha('');
      setConfirmarSenha('');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      if (error.code === 'auth/invalid-action-code') {
        toast.error('Código de redefinição inválido ou expirado.');
      } else {
        toast.error('Erro ao redefinir senha. Tente novamente.');
      }
    }
  };
  

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
        <form className='rs-form' onSubmit={handleSubmit}>
          <input 
            type="password" 
            name="campoNovaSenha" 
            id="campoNovaSenha" 
            placeholder='Digite sua nova senha'
            className='form-control form-control-lg bg-light fs-6'
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            required
          />
          <input 
            type="password" 
            name="confirmarNovaSenha" 
            id="confirmarNovaSenha" 
            placeholder='Confirme sua nova senha'
            className='form-control form-control-lg bg-light fs-6'
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />
         {erro && <p className="error-message" style={{ color: 'red' }}>{erro}</p>}
          <button type="submit" id='btnConfirmarNovaSenha'>Confirmar</button>
        </form>
      </div>
    </div>
  );
}

export default RedefinirSenha;
