import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import imgCadastro from '../../assets/images/prodlimpeza.svg';
import './cadastro.css'; 

const Cadastro = () => {
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
              <Form.Control type="text" className="form-control-lg bg-light fs-6 campotxt" placeholder="Nome completo" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="text" className="form-control-lg bg-light fs-6 campotxt" autoComplete="off" maxLength="14" id="campoCPF" placeholder="CPF ou CNPJ" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="date" className="form-control-lg bg-light fs-6 campotxt" autoComplete="off" maxLength="14" id="dataNascimento" placeholder="Data de nascimento" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="email" className="form-control-lg bg-light fs-6 campotxt" placeholder="Email" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="password" className="form-control-lg bg-light fs-6 campotxt" placeholder="Senha" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="password" className="form-control-lg bg-light fs-6 campotxt" placeholder="Confirme sua senha" />
            </Form.Group>
            <div className="input-group mb-3">
              <Button className="btn-cadastro">CRIAR CONTA</Button>
            </div>
            <Row>
              <small>Já é cadastrado? <Link to="/" className="btn-link">Entre em sua conta!</Link></small>
            </Row>
          </Row>
        </Col>
      </Row>
    </Container>
    </div>
  );
}

export default Cadastro;
