import React from 'react';
import './home-cliente.css';
import { Container, Navbar, Offcanvas, Nav } from "react-bootstrap";
import { Tooltip } from "react-tooltip";
import { LuLogOut } from "react-icons/lu";
import logoWeclean from "../../../assets/images/logo-weclean.png";
import { Link } from 'react-router-dom';
import { useClearSessionAndRedirect } from '../../../utils/session';



function HomeCliente() {

  const handleLogout = useClearSessionAndRedirect();

  return (
    <div className='home-cliente-container'>
         <Navbar bg="white" expand="lg" fixed="top" className="shadow-sm">
        <Container>
          <Navbar.Brand href="#bannerHeader" className="fs-4 logo">
            <span>
              <img src={logoWeclean} alt="Logo img" className="logo-weclean" />
            </span>
            WeClean
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
          >
            <Offcanvas.Header closeButton className="border-bottom">
              <Offcanvas.Title id="offcanvasNavbarLabel">
                <span>
                  <img
                    src={logoWeclean}
                    alt="Logo img"
                    className="logo-weclean"
                  />
                </span>
                <span className="mobile-logo-text">WeClean</span>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-center align-items-center flex-grow-1 pe-3">
                <Nav.Link href="#" className='active'>Início</Nav.Link>
                <Nav.Link href="/lista-servicos-cliente">Serviços</Nav.Link>
                
              </Nav>
              <div className="d-flex flex-column justify-content-center flex-lg-row align-items-center gap-2">
                <button
                  className="btn-logout"
                  data-tooltip-id="tooltip-logout"
                  data-tooltip-content="Sair"
                  onClick={handleLogout}
                >
                  <LuLogOut />
                </button>
                <Tooltip
                  id="tooltip-logout"
                  place="bottom"
                  style={{
                    backgroundColor: "var(--corPrincipal)",
                    color: "#fff",
                  }} 
                />
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <div className="home-cliente-main-content">
        <div className="home-cliente-header">
            <h2 className="hc-header-txt">
                Seus agendamentos
            </h2>
        </div>
        <div className="home-cliente-content">
            <div className="hc-left-content">
                <div className="forms-list">
                    <Link to='/form-faxina' className='hc-form-link'>
                        Agendar faxina
                    </Link>
                    <Link to='/form-lavanderia' className='hc-form-link'>
                        Agendar lavanderia
                    </Link>
                    <Link to='/form-cozinha' className='hc-form-link'>
                        Agendar serviço de cozinha
                    </Link>
                    <Link to='/form-jardinagem' className='hc-form-link'>
                        Agendar jardinagem
                    </Link>
                </div>
            </div>
            <div className="hc-right-content">
                <h3>Calendário de compromissões (read only)</h3>
            </div>
        </div>
      </div>
    </div>
  )
}

export default HomeCliente
