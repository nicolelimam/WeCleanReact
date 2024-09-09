// src/App.js
import React from 'react';
import { Navbar, Nav, Offcanvas, Container, Button } from 'react-bootstrap';
import './index.css';

function Index() {
  return (
    <div className="vh-100">
      <header>
        {/* Navbar */}
        <Navbar bg="white" expand="lg" fixed="top" className="shadow-sm">
          <Container>
            {/* Logo */}
            <Navbar.Brand href="#" className="fs-4 logo">WeClean</Navbar.Brand>
            {/* Toggler */}
            <Navbar.Toggle aria-controls="offcanvasNavbar" />
            {/* Offcanvas Menu */}
            <Navbar.Offcanvas
              id="offcanvasNavbar"
              aria-labelledby="offcanvasNavbarLabel"
              placement="start"
            >
              <Offcanvas.Header closeButton className="border-bottom">
                <Offcanvas.Title id="offcanvasNavbarLabel">WeClean</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                {/* Nav Links */}
                <Nav className="justify-content-center align-items-center flex-grow-1 pe-3">
                  <Nav.Link href="#">Serviços</Nav.Link>
                  <Nav.Link href="#">Avaliações</Nav.Link>
                  <Nav.Link href="#">Contate-nos</Nav.Link>
                </Nav>
                {/* Login / Cadastro */}
                <div className="d-flex flex-column justify-content-center flex-lg-row align-items-center gap-2">
                  <a href="#" className="btn-login-link text-decoration-none">Fazer login</a>
                  <a href="#" className="btn-cadastro-link text-decoration-none">Cadastre-se</a>
                </div>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>

        {/* Banner */}
        <div className="banner-header">
          <div className="filtro"></div>
          <h1>Agende já a faxina de sua casa conosco!</h1>
          <p>Os profissionais mais capacitados estão a alguns cliques de você.</p>
        </div>
      </header>

      {/* Serviços Section */}
      <section className="container-servicos">
        <h2>SERVIÇOS</h2>
        <div className="panel-cards-servicos">
          <div className="lavadeira-card card-servicos">
            <div className="img-card"></div>
            <Button className="lavadeira-btn btn-card-servicos">LAVADEIRA</Button>
          </div>

          <div className="passadeira-card card-servicos">
            <div className="img-card"></div>
            <Button className="passadeira-btn btn-card-servicos">PASSADEIRA</Button>
          </div>

          <div className="faxineira-card card-servicos">
            <div className="img-card"></div>
            <Button className="faxineira-btn btn-card-servicos">FAXINEIRA</Button>
          </div>

          <div className="cozinheira-card card-servicos">
            <div className="img-card"></div>
            <Button className="cozinheira-btn btn-card-servicos">COZINHEIRA</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Index;
