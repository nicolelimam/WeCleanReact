import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './login.css'; 
import imgLogin from '../../assets/images/prodlimpeza.svg';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { query, where, getDocs, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { signInWithPopup } from 'firebase/auth';
import { db, auth, provider } from '../../backend/firebase';
import { FaGoogle } from "react-icons/fa6";
import bcrypt from 'bcryptjs';
import { saveUserSession } from '../../utils/session';
import { setDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

function Login() {
  const [showRedef, setShowRedef] = useState(false);
  const [showSucesso, setShowSucesso] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleRedefClose = () => setShowRedef(false);
  const handleRedefShow = () => setShowRedef(true);
  const handleSucessoClose = () => setShowSucesso(false);
  const handleSucessoShow = () => setShowSucesso(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    handleRedefClose();
    navigate('/redefinir-senha');
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const q = query(collection(db, 'usuarios'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
  
        // Verifica a senha
        const passwordMatch = await bcrypt.compare(password, userData.senha);
        if (passwordMatch) {
          if (userData.funcao === 'funcionario') {
            // Obtém o documento da subcoleção 'funcionarios'
            const funcionariosRef = collection(db, `usuarios/${userDoc.id}/funcionarios`);
            const funcionariosSnapshot = await getDocs(funcionariosRef);
  
            if (!funcionariosSnapshot.empty) {
              const funcionarioData = funcionariosSnapshot.docs[0].data();
  
              // Verifica o status
              if (funcionarioData.status !== 'ativo') {
                toast.error(
                  'Acesso não autorizado: Sua conta foi desativada. Contate o suporte da WeClean para mais informações.'
                );
                return;
              }
            } else {
              toast.error('Funcionário não encontrado na subcoleção.');
              return;
            }
          }
  
          // Salva a sessão e redireciona com base na função
          saveUserSession(userDoc.id);
          switch (userData.funcao || 'cliente') {
            case 'cliente':
              navigate('/home-cliente');
              break;
            case 'adm':
              navigate('/home-adm');
              break;
            case 'funcionario':
              navigate('/home-funcionario');
              break;
            default:
              toast.error('Função de usuário inválida ou não definida.');
          }
        } else {
          toast.error('Senha incorreta.');
        }
      } else {
        toast.error('Usuário não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao fazer login: ', error);
      toast.error('Erro ao fazer login. Tente novamente.');
    }
  };
  
  

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { user } = result;
  
      const userRef = doc(db, 'usuarios', user.uid);
      const userSnapshot = await getDoc(userRef);
  
      if (!userSnapshot.exists()) {
        await setDoc(userRef, {
          email: user.email,
          funcao: 'cliente', 
          criado_em: serverTimestamp(),
          atualizado_em: serverTimestamp(),
        });
      }
  
      saveUserSession(user.uid);
      navigate('/home-cliente'); 
    } catch (error) {
      console.error('Erro ao fazer login com Google: ', error);
      toast.error('Erro ao fazer login com o Google. Tente novamente.');
    }
  };

  const handleRedefSubmit = async (e) => {
    e.preventDefault();
    try {
      const q = query(collection(db, 'usuarios'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const auth = getAuth(); // Certifique-se de inicializar corretamente o objeto auth
        await sendPasswordResetEmail(auth, email); // Envia o email de redefinição de senha
        toast.success('Um email de redefinição foi enviado! Verifique sua caixa de entrada.');
        handleRedefClose(); // Fechar modal após sucesso
      } else {
        toast.error('E-mail não encontrado no sistema.');
      }
    } catch (error) {
      console.error('Erro ao enviar email de redefinição:', error);
      toast.error('Erro ao processar sua solicitação. Tente novamente.');
    }
  };
  
  
  
  return (
   <div className="login-page-container">
    <ToastContainer />
     <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 login-page-content">
      <Row className="border rounded-5 p-3 bg-white shadow box-area">
        <Col md={6} className="rounded-4 d-flex justify-content-center align-items-center flex-column left-box" style={{ background: '#3F1651' }}>
          <div className="featured-image mb-3">
            <img src={imgLogin} alt="Imagem login" className="img-fluid" style={{ width: '250px' }} />
          </div>
          <p className="text-white f2-2">ENTRE EM SUA CONTA</p>
          <small className="text-white text-wrap text-center">E tenha acesso a todos os recursos que nosso sistema oferece.</small>
        </Col>

        <Col md={6} className="right-box">
          <Row className="align-items-center">
            <div className="header-text mb-4">
              <h2>Bem vindo(a) de volta!</h2>
            </div>
            {/* <Form.Group className="mb-3">
              <Form.Control type="email" className="form-control-lg fs-6 campotxt" placeholder="Email" />
            </Form.Group> */}
              <Form.Control 
                type="email" 
                name="email" 
                className="form-control-lg bg-light fs-6 campotxt"  
                placeholder="Email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />

            {/* <Form.Group className="mb-1">
              <Form.Control type="password" className="form-control-lg fs-6 campotxt" placeholder="Senha" />
            </Form.Group> */}
            <br /> <br /><br />
            <Form.Control 
              type="password" 
              name="password" 
              className="form-control-lg bg-light fs-6 campotxt" 
              placeholder="Senha"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />

            <div className="input-group mb-5 d-flex redefinir">
              <small>
                <Button variant="link" className="btn-link" onClick={handleRedefShow}>
                  Esqueceu a senha?
                </Button>
              </small>
            </div>
            <Form.Group className="mb-3">
              <Button className="btn-login" onClick={handleLogin}>
                Login
              </Button>
              <button className="btn-login-google" onClick={handleGoogleLogin}>
                <FaGoogle className="btn-login-google-icon"/> Login com Google
              </button>
            </Form.Group>
            <Row className="div-redef">
            <small>Ainda não tem uma conta? <Link to="/cadastro" className="btn-link">Cadastre-se!</Link></small>
            </Row>
          </Row>
        </Col>
      </Row>

      {/* Modal para Redefinir Senha */}
      <Modal show={showRedef} onHide={handleRedefClose}>
        <Modal.Header closeButton>
          <Modal.Title>Redefinir senha</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Se você esqueceu sua senha, insira seu email e enviaremos uma mensagem de confirmação para a redefinição do seu acesso.</p>
          <Form onSubmit={handleRedefSubmit}>
          <Form.Group>
            <Form.Control 
              type="email" 
              className="form-control-lg bg-light fs-6 campotxt" 
              placeholder="Email da conta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Button 
            type="submit" 
            className="btn btn-primary w-100 fs-6 btn-enviar mt-3">
            Enviar email
          </Button>
        </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de Sucesso */}
      <Modal show={showSucesso} onHide={handleSucessoClose}>
        <Modal.Body>
          <h2>Sucesso!</h2>
          <p className="message">Um email de redefinição de senha foi enviado para você! Verifique sua caixa de entrada.</p>
          <Button className="btn-ok" onClick={handleSucessoClose}>Ok!</Button>
        </Modal.Body>
      </Modal>
    </Container>
   </div>
  );
}

export default Login;
