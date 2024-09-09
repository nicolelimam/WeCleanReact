import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './login.css'; 
import imgLogin from '../../assets/images/prodlimpeza.svg';
import { Link } from 'react-router-dom';

function Login() {
  const [showRedef, setShowRedef] = useState(false);
  const [showSucesso, setShowSucesso] = useState(false);

  const handleRedefClose = () => setShowRedef(false);
  const handleRedefShow = () => setShowRedef(true);
  const handleSucessoClose = () => setShowSucesso(false);
  const handleSucessoShow = () => setShowSucesso(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    handleRedefClose();
    handleSucessoShow();
  };

  return (
   <div className="login-page-container">
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
            <Form.Group className="mb-3">
              <Form.Control type="email" className="form-control-lg fs-6 campotxt" placeholder="Email" />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Control type="password" className="form-control-lg fs-6 campotxt" placeholder="Senha" />
            </Form.Group>
            <div className="input-group mb-5 d-flex redefinir">
              <small>
                <Button variant="link" className="btn-link" onClick={handleRedefShow}>
                  Esqueceu a senha?
                </Button>
              </small>
            </div>
            <Form.Group className="mb-3">
              <Button className="btn-login" onClick={() => window.location.href = 'home-cliente.html'}>
                Login
              </Button>
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
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control type="email" className="form-control-lg bg-light fs-6 campotxt" placeholder="Email da conta" />
            </Form.Group>
            <Button type="submit" className="btn btn-primary w-100 fs-6 btn-enviar mt-3">Enviar email</Button>
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
