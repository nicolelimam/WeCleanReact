import React, { useState, useEffect } from 'react';
import './menu-adm.css';
import { Navbar, Nav, Offcanvas, Container } from "react-bootstrap";
import logoWeclean from "../../assets/images/logo-weclean.png";
import { MdDashboard } from "react-icons/md";
import { FaListUl, FaUsers, FaMoneyBill } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { Tooltip } from "react-tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MdOutlineWork } from "react-icons/md";
import { PiCashRegisterFill } from "react-icons/pi";
import { LuLogOut } from "react-icons/lu";
import { useClearSessionAndRedirect } from '../../utils/session';

function MenuAdm({ activePage = 'dashboard' }) {  
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeLink, setActiveLink] = useState(activePage);

    useEffect(() => {
        setActiveLink(activePage); 
    }, [activePage]);

    const handleLinkClick = (linkName) => {
        setActiveLink(linkName);  
    };

    const handleLogout = useClearSessionAndRedirect();
    
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Navbar bg="white" expand="lg" fixed="top" className="shadow-sm">
            <Container>
                {/* Alinha logo à esquerda */}
                <Navbar.Brand href="#" className="fs-4 logo d-flex justify-content-start">
                    <img src={logoWeclean} alt="Logo img" className="logo-weclean" />
                    <div className="logo-weclean-txt">
                        WeClean 
                    </div>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="offcanvasNavbar" />
                <Navbar.Offcanvas
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                    placement="start"
                >
                    <Offcanvas.Header closeButton className="border-bottom">
                        <Offcanvas.Title id="offcanvasNavbarLabel">
                            <img src={logoWeclean} alt="Logo img" className="logo-weclean" />
                            <span className="mobile-logo-text">WeClean</span>
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        {/* Alinha os links no centro */}
                        <Nav className="flex-grow-1 d-flex justify-content-center align-items-center pe-3 menu-adm-li">
                            <Nav.Link 
                                href="/home-adm" 
                                className={`menu-adm-link ${activeLink === 'dashboard' ? 'active' : ''}`}
                                onClick={() => handleLinkClick('dashboard')}
                            >
                                <MdDashboard className='menu-adm-link-icon'/>
                                <span className="menu-adm-link-txt">Dashboard</span>
                            </Nav.Link>
                            <Nav.Link 
                                href="/lista-servicos" 
                                className={`menu-adm-link ${activeLink === 'servicos' ? 'active' : ''}`}
                                onClick={() => handleLinkClick('servicos')}
                                
                            >
                                <MdOutlineWork className='menu-adm-link-icon'/>
                                <span className="menu-adm-link-txt">Serviços</span>
                            </Nav.Link>
                            <Nav.Link 
                                href="/cadastro-funcionario" 
                                className={`menu-adm-link ${activeLink === 'funcionarios' ? 'active' : ''}`}
                                onClick={() => handleLinkClick('funcionarios')}
                            >
                                <FaUsers className='menu-adm-link-icon'/>
                                <span className="menu-adm-link-txt">Funcionários</span>
                            </Nav.Link>
                            <Nav.Link 
                                href="/lista-financeiro" 
                                className={`menu-adm-link ${activeLink === 'financeiro' ? 'active' : ''}`}
                                onClick={() => handleLinkClick('financeiro')}
                            >
                                <PiCashRegisterFill  className='menu-adm-link-icon'/>
                                <span className="menu-adm-link-txt">Financeiro</span>
                            </Nav.Link>
                            <Nav.Link 
                                href="#configuracoes" 
                                className={`menu-adm-link ${activeLink === 'configuracoes' ? 'active' : ''}`}
                                onClick={() => handleLinkClick('configuracoes')}
                            >
                                <IoMdSettings className='menu-adm-link-icon'/>
                                <span className="menu-adm-link-txt">Configurações</span>
                            </Nav.Link>
                        </Nav>
                        {/* Alinha botão de sair à direita */}
                        <div className="d-flex justify-content-end align-items-center menu-adm-btn-group">
                            <button className="btn-notificacao"
                            data-tooltip-id="tooltip-notificacao"
                            onClick={handleMenuOpen} 
                            data-tooltip-content="Notificações">
                                <IoNotifications />
                            </button>
                            <Tooltip
                            id="tooltip-notificacao"
                            place="bottom"
                            style={{ backgroundColor: "var(--corPrincipal)", color: "#fff" }} // Personalizando o estilo
                            />
                            <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                            >
                            <MenuItem onClick={handleMenuClose}>Notificação 1</MenuItem>
                            <MenuItem onClick={handleMenuClose}>Notificação 2</MenuItem>
                            <MenuItem onClick={handleMenuClose}>Notificação 3</MenuItem>
                            </Menu>
                            <button className="btn-logout"
                                data-tooltip-id="tooltip-logout"
                                data-tooltip-content="Sair"
                                onClick={handleLogout}>
                                <LuLogOut />
                            </button>
                            <Tooltip
                            id="tooltip-logout"
                            place="bottom"
                            style={{ backgroundColor: "var(--corPrincipal)", color: "#fff" }} // Personalizando o estilo
                            />
                        </div>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    );
}

export default MenuAdm;
