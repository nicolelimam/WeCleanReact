import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import imgCadastro from '../../assets/images/prodlimpeza.svg';
import './cadastro.css'; 
import InputMask from "react-input-mask"; 
import { FaGoogle } from "react-icons/fa6";
import bcrypt from 'bcryptjs';
import { db, auth, provider } from '../../backend/firebase';
import { toast, ToastContainer } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { addDoc, doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Cadastro = () => {
  const [tipoUsuario, setTipoUsuario] = useState('Pessoa Física');
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    nome: '',
    cpf: '', 
    cnpj: '', 
    data_de_nascimento: '',
    telefone: '',
    tipo_de_usuario: ''
  });

  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value || '', // Fallback para string vazia
    }));
  };


  const handleRegister = async () => {
    if (!formData.email || !formData.senha) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
  
    try {
      const hashedPassword = bcrypt.hashSync(formData.senha, 10);
  
      // Cria o usuário na autenticação
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.senha);
      const user = userCredential.user;
  
      // Cria o documento do usuário na coleção 'usuarios'
      const userRef = doc(collection(db, 'usuarios'), user.uid);
      await setDoc(userRef, {
        email: formData.email,
        senha: hashedPassword,
        funcao: 'cliente', // Por padrão, é cliente
        tipo_de_usuario: tipoUsuario === 'Pessoa Física' ? 'fisico' : 'juridico',
        criado_em: serverTimestamp(),
        atualizado_em: serverTimestamp()
      });
  
      // Define os dados do cliente para a sub-coleção 'clientes'
      const clientData = {
        telefone: formData.telefone || '',
        endereco: '',
        criado_em: serverTimestamp(),
        atualizado_em: serverTimestamp(),
        status: 'ativo'
      };
  
      if (tipoUsuario === 'Pessoa Física') {
        await addDoc(collection(userRef, 'clientes'), {
          ...clientData,
          nome: formData.nome || '',
          cpf: formData.cpf || '',
          data_de_nascimento: formData.data_de_nascimento || ''
        });
      } else {
        await addDoc(collection(userRef, 'clientes'), {
          ...clientData,
          nome_da_empresa: formData.nome || '',
          cnpj: formData.cnpj || '',
          pessoa_de_contato: formData.nome || ''
        });
      }
  
      toast.success('Cadastro realizado com sucesso!');
      
      // Redireciona diretamente para a página do cliente
      navigate('/home-cliente');
    } catch (error) {
      console.error("Erro ao cadastrar: ", error);
  
      // Trata os erros de autenticação do Firebase
      switch (error.code) {
        case 'auth/email-already-in-use':
          toast.error('Este e-mail já está em uso. Tente outro e-mail.');
          break;
        case 'auth/invalid-email':
          toast.error('O formato do e-mail é inválido. Verifique e tente novamente.');
          break;
        case 'auth/weak-password':
          toast.error('A senha deve ter pelo menos 6 caracteres.');
          break;
        default:
          toast.error('Erro ao cadastrar. Tente novamente mais tarde.');
      }
    }
  };
  
  

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Cria o documento do usuário na coleção 'usuarios'
     const userRef = doc(collection(db, 'usuarios'), user.uid);
      await setDoc(userRef, {
        email: user.email,
        funcao: 'cliente',
        tipo_de_usuario: 'fisico', // Valor padrão para usuários Google
        criado_em: serverTimestamp(),
        atualizado_em: serverTimestamp()
      });
      
      // Adiciona dados do cliente com Google na subcoleção 'clientes'
      await addDoc(collection(userRef, 'clientes'), {
        nome: user.displayName || '',
        cpf: '',
        data_de_nascimento: '',
        telefone: user.phoneNumber || '',
        endereco: '',
        status: 'ativo',
        criado_em: serverTimestamp(),
        atualizado_em: serverTimestamp()
      });

      toast.success('Cadastro com Google realizado com sucesso!');
      navigate('/home-cliente');
    } catch (error) {
      console.error("Erro ao cadastrar com Google: ", error);
      toast.error("Erro ao cadastrar com Google, tente novamente.");
    }
  };

  return (
    <div className="cadastro-container">
      <ToastContainer />
        <Container className="d-flex justify-content-center align-items-center min-vh-100 cadastro-content">
      <Row className="border rounded-5 p-3 bg-white shadow box-area">
        <Col md={6} className="rounded-4 d-flex justify-content-center align-items-center flex-column left-box" style={{ background: '#3F1651' }}>
          <div className="featured-image mb-3">
            <img src={imgCadastro} alt="Imagem login" className="img-fluid" style={{ width: 250 }} />
          </div>
          <p className="text-white f2-2">Crie uma conta!</p>
          <small className="text-white text-wrap text-center">Tenha acesso a todos os recursos que nossa plataforma oferece.</small>
        </Col>
        <Col md={6} className="right-box">
          <Row className="align-items-center">
            <div className="header-text mb-2">
              <h2>Bem vindo(a)!</h2>
              <p>Cadastre suas informações abaixo.</p>
            </div>
              <Form.Group className="mb-3">
              <Form.Select 
                  className="form-control-lg bg-light fs-6" 
                  style={{ borderRadius: "10px" }}
                  onChange={(e) => setTipoUsuario(e.target.value)} 
                  aria-expanded={tipoUsuario ? 'true' : 'false'} // Ajuste para booleano
                  value={tipoUsuario}
                >
                  <option key="blankChoice" hidden value>Tipo de usuário</option>
                  <option>Pessoa Física</option>
                  <option>Pessoa Jurídica</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control 
                  type="text" 
                  name="nome" 
                  className="form-control-lg bg-light fs-6 campotxt" 
                  placeholder={tipoUsuario === 'Pessoa Jurídica' ? "Nome da empresa" : "Nome completo"}
                  value={formData.nome} 
                  onChange={handleInputChange} 
                />
              </Form.Group>
              {tipoUsuario === 'Pessoa Física' && (
                  <Form.Group className="mb-3">
                    <InputMask 
                      mask="999.999.999-99" 
                      name="cpf" // Altere para 'cpf'
                      className="form-control-lg bg-light fs-6 campotxt" 
                      placeholder="CPF"
                      value={formData.cpf} // Atualizado para `cpf`
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                )}
                {tipoUsuario === 'Pessoa Jurídica' && (
                  <Form.Group className="mb-3">
                    <InputMask 
                      mask="99.999.999/9999-99" 
                      name="cnpj" 
                      className="form-control-lg bg-light fs-6 campotxt" 
                      placeholder="CNPJ"
                      value={formData.cnpj} 
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                )}
              {tipoUsuario === 'Pessoa Física' && (
                <Form.Group className="mb-3">
                  <InputMask
                    mask="99/99/9999"
                    name="data_de_nascimento" 
                    className="form-control-lg bg-light fs-6 campotxt"
                    placeholder="Data de nascimento"
                    value={formData.data_de_nascimento} 
                    onChange={handleInputChange}
                  />
                </Form.Group>
              )}
              {tipoUsuario === 'Pessoa Jurídica' && (
                <Form.Group className="mb-3">
                  <Form.Control 
                    type="text" 
                    className="form-control-lg bg-light fs-6 campotxt" 
                    placeholder="Nome do representante"
                  />
                </Form.Group>
              )}
              <Form.Group className="mb-3">
                <InputMask 
                  mask="(99) 99999-9999" 
                  name="phone" 
                  className="form-control-lg bg-light fs-6 campotxt" 
                  placeholder="Telefone"
                  value={formData.phone} 
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control 
                  type="email" 
                  name="email" 
                  className="form-control-lg bg-light fs-6 campotxt" 
                  placeholder="Email"
                  value={formData.email} 
                  onChange={handleInputChange} 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                  <Form.Control 
                    type="password" 
                    name="senha" 
                    className="form-control-lg bg-light fs-6 campotxt" 
                    placeholder="Senha"
                    value={formData.senha} 
                    onChange={handleInputChange}
                  />
                </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="password" className="form-control-lg bg-light fs-6 campotxt" placeholder="Confirme sua senha" />
            </Form.Group>
            <div className="input-group mb-3">
                <Button className="btn-cadastro" onClick={handleRegister}>CRIAR CONTA</Button>
                <button className="btn-cadastro-google" onClick={handleGoogleRegister}>
                  <FaGoogle className="btn-cad-google-icon" /> Entre com sua conta do Google
                </button>
            </div>
            <Row>
              <small>Já é cadastrado? <Link to="/login" className="btn-link">Entre em sua conta!</Link></small>
            </Row>
          </Row>
        </Col>
      </Row>
    </Container>
    </div>
  );
}

export default Cadastro;
