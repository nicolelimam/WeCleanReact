import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import imgCadastro from '../../assets/images/prodlimpeza.svg';
import './cadastro.css'; 
import InputMask from "react-input-mask"; 
import { FaGoogle } from "react-icons/fa6";
import bcrypt from 'bcryptjs';
import { db, auth, provider } from '../../backend/firebase';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithPopup,  } from 'firebase/auth';
import { addDoc, serverTimestamp, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Cadastro = () => {
  const [tipoUsuario, setTipoUsuario] = useState('Pessoa Física');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    cpfCnpj: '',
    dateOfBirth: '',
    phone: ''
  });

  const navigate = useNavigate();
  const handleInputChange = (e) => setFormData({...formData, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    
    try {
      const hashedPassword = bcrypt.hashSync(formData.password, 10);

      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const userDoc = await addDoc(collection(db, 'users'), {
        email: formData.email,
        password: hashedPassword,
        role: 'client',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      await addDoc(collection(db, 'individuals'), {
        name: formData.name,
        cpf_cnpj: formData.cpfCnpj,
        date_of_birth: formData.dateOfBirth,
        phone: formData.phone,
        status: 'active',
        user_id: userDoc.id,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      toast.success('Cadastro realizado com sucesso!');
      navigate('/home-cliente'); 
    } catch (error) {
      console.error("Erro ao cadastrar: ", error);
      toast.error("Erro ao cadastrar, verifique o email ou tente novamente.");
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      const userDoc = await addDoc(collection(db, 'users'), {
        email: user.email,
        role: 'client',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
  
      await addDoc(collection(db, 'individuals'), {
        name: user.displayName,
        cpf_cnpj: '',
        date_of_birth: '',
        phone: user.phoneNumber || '',
        status: 'active',
        user_id: userDoc.id,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
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
                  className='form-control-lg bg-light fs-6' 
                  style={{borderRadius: "10px"}}
                  onChange={(e) => setTipoUsuario(e.target.value)} 
                >
                  <option key='blankChoice' hidden value>Tipo de usuário</option>
                  <option>Pessoa Física</option>
                  <option>Pessoa Jurídica</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
              <Form.Control 
                type="text" 
                name="name" 
                className="form-control-lg bg-light fs-6 campotxt" 
                placeholder={tipoUsuario === 'Pessoa Jurídica' ? "Nome da empresa" : "Nome completo"}
                value={formData.name} 
                onChange={handleInputChange} 
              />
            </Form.Group>
            {tipoUsuario === 'Pessoa Física' && (
                <Form.Group className="mb-3">
                  <InputMask 
                    mask="999.999.999-99" 
                    name="cpfCnpj" 
                    className="form-control-lg bg-light fs-6 campotxt" 
                    placeholder="CPF"
                    value={formData.cpfCnpj} 
                    onChange={handleInputChange}
                  />
                </Form.Group>
              )}
              {tipoUsuario === 'Pessoa Jurídica' && (
                <Form.Group className="mb-3">
                  <InputMask 
                    mask="99.999.999/9999-99" 
                    name="cpfCnpj" 
                    className="form-control-lg bg-light fs-6 campotxt" 
                    placeholder="CNPJ"
                    value={formData.cpfCnpj} 
                    onChange={handleInputChange}
                  />
                </Form.Group>
              )}
              {tipoUsuario === 'Pessoa Física' && (
                <Form.Group className="mb-3">
                  <InputMask
                    mask="99/99/9999"
                    name="dateOfBirth" 
                    className="form-control-lg bg-light fs-6 campotxt"
                    placeholder="Data de nascimento"
                    value={formData.dateOfBirth} 
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
                name="password" 
                className="form-control-lg bg-light fs-6 campotxt" 
                placeholder="Senha"
                value={formData.password} 
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
