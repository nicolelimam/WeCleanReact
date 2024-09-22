import React, { useState } from 'react';
import userImgSidebar from '../../assets/images/pfp.jpeg';
import '../../css/globalVar.css';
import './adm-menu-sidebar.css';
import { Link } from 'react-router-dom';

function MenuSidebarAdministrador() {

  const [sidebarActive, setSidebarActive] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const handleMenuClick = (menuIndex) => {
    if (activeMenu === menuIndex) {
      setActiveMenu(null); // Fecha o menu se já estiver ativo
    } else {
      setActiveMenu(menuIndex); // Abre o novo menu
    }
  };

  return (
    <div className={`adm-menu-sidebar-container ${sidebarActive ? 'active' : ''}`}>
      <div className="adm-menu-sidebar">
        <div className="ams-menu-btn" onClick={toggleSidebar}>
          <i className={`bi ${sidebarActive ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
        </div>
        <div className="ams-header">
          <div className="ams-header-user-img">
            <img src={userImgSidebar} alt="User image" className='ams-user-img' />
          </div>
          <div className="ams-user-details">
            <p className="ams-user-detail-title">Administrador</p>
            <p className='ams-user-detail-name'>Ana Carolina</p>
          </div>
        </div>
        <div className="ams-nav">
          <div className="ams-menu">
            <p className="ams-menu-title">PRINCIPAL</p>
            <ul className='ams-menu-list'>
              <li className={`ams-menu-item ${activeMenu === 0 ? 'active' : ''}`}>
                <Link className='ams-menu-item-link' onClick={() => handleMenuClick(0)}>
                  <i className="bi bi-bar-chart-line-fill ams-menu-item-icon"></i>
                  <span className="ams-menu-item-text">Dashboard</span>
                </Link>
              </li>
              <li className={`ams-menu-item ${activeMenu === 1 ? 'active' : ''}`}>
                <Link className='ams-menu-item-link' onClick={() => handleMenuClick(1)}>
                  <i className="bi bi-bell-fill ams-menu-item-icon"></i>
                  <span className="ams-menu-item-text">Notificações</span>
                </Link>
              </li>
              <li className={`ams-menu-item ${activeMenu === 2 ? 'active' : ''}`}>
                <Link className='ams-menu-item-link' onClick={() => handleMenuClick(2)}>
                  <i className="bi bi-pen-fill ams-menu-item-icon"></i>
                  <span className="ams-menu-item-text">Cadastros</span>
                  <i className={`bi bi-chevron-down ${activeMenu === 2 ? 'rotate' : ''}`}></i>
                </Link>
                {activeMenu === 2 && (
                  <ul className="ams-sub-menu" style={{ display: activeMenu === 2 ? 'block' : 'none' }}>
                    <li>
                      <Link className='ams-menu-item-link'>
                        <span className="ams-menu-item-text sub-menu-text">Usuários</span>
                      </Link>
                    </li>
                    <li>
                      <Link className='ams-menu-item-link'>
                        <span className="ams-menu-item-text sub-menu-text">Entrevistas</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className={`ams-menu-item ${activeMenu === 3 ? 'active' : ''}`}>
                <Link className='ams-menu-item-link' onClick={() => handleMenuClick(3)}>
                  <i className="bi bi-collection-fill ams-menu-item-icon"></i>
                  <span className="ams-menu-item-text">Serviços</span>
                  <i className={`bi bi-chevron-down ${activeMenu === 3 ? 'rotate' : ''}`}></i>
                </Link>
                {activeMenu === 3 && (
                  <ul className="ams-sub-menu" style={{ display: activeMenu === 3 ? 'block' : 'none' }}>
                    <li>
                      <Link className='ams-menu-item-link'>
                        <span className="ams-menu-item-text sub-menu-text">Solicitações</span>
                      </Link>
                    </li>
                    <li>
                      <Link className='ams-menu-item-link'>
                        <span className="ams-menu-item-text sub-menu-text">Histórico de serviços</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className={`ams-menu-item ${activeMenu === 4 ? 'active' : ''}`}>
                <Link className='ams-menu-item-link' onClick={() => handleMenuClick(4)}>
                  <i className="bi bi-people-fill ams-menu-item-icon"></i>
                  <span className="ams-menu-item-text">Empregados</span>
                  <i className={`bi bi-chevron-down ${activeMenu === 4 ? 'rotate' : ''}`}></i>
                </Link>
                {activeMenu === 4 && (
                  <ul className="ams-sub-menu" style={{ display: activeMenu === 4 ? 'block' : 'none' }}>
                    <li>
                      <Link className='ams-menu-item-link'>
                        <span className="ams-menu-item-text sub-menu-text">Estatísticas</span>
                      </Link>
                    </li>
                    <li>
                      <Link className='ams-menu-item-link'>
                        <span className="ams-menu-item-text sub-menu-text">Comunicados</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className={`ams-menu-item ${activeMenu === 5 ? 'active' : ''}`}>
                <Link className='ams-menu-item-link' onClick={() => handleMenuClick(5)}>
                  <i className="bi bi-piggy-bank-fill ams-menu-item-icon"></i>
                  <span className="ams-menu-item-text">Financeiro</span>
                </Link>
              </li>
                    
                </ul>
                
            </div>
            
        </div>
        <div className="ams-menu">
            <p className="ams-menu-title">
                    OUTROS
                </p>
                <ul className='ams-menu-list'>
                    <li className={`ams-menu-item ${activeMenu === 6 ? 'active' : ''}`}>
                            <Link className='ams-menu-item-link' onClick={() => handleMenuClick(6)}>
                                <i class="bi bi-gear-fill ams-menu-item-icon"></i>
                                <span className="ams-menu-item-text">Configurações</span>
                            </Link>
                        </li>
                        <li className={`ams-menu-item ${activeMenu === 7 ? 'active' : ''}`}>
                            <Link className='ams-menu-item-link' onClick={() => handleMenuClick(6)}>
                                <i class="bi bi-door-open-fill ams-menu-item-icon"></i>
                                <span className="ams-menu-item-text">Sair (Log Out)</span>
                            </Link>
                        </li>
                </ul>
        </div>
      </div>
    </div>
  )
}

export default MenuSidebarAdministrador;
