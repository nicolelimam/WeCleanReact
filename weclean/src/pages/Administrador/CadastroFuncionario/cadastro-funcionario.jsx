import React, { useState } from 'react';
import MenuSidebarAdministrador from '../../../components/AdmMenuSidebar/adm-menu-sidebar';
import './cadastro-funcionario.css';
import { Tooltip } from 'react-tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Autocomplete, TextField } from "@mui/material";
import InputMask from 'react-input-mask';  // Importando a biblioteca para máscaras


function CadastroFuncionario() {
  const [anchorEl, setAnchorEl] = useState(null);

  // Função para abrir o menu de notificações
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Função para fechar o menu de notificações
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const modalidade = [
    { label: "Faxina", value: "faxina" },
    { label: "Lavanderia", value: "lavanderia" },
    { label: "Cozinha", value: "cozinha" },
    { label: "Jardinagem", value: "jardinagem" },
  ];


  return (
    <div className='cadastro-funcionario-container'>
      <MenuSidebarAdministrador />

      <div className="cf-content">
        <div className="cf-header">
          <div className="cf-header-txt">
            <h5>Olá, Ana!</h5>
          </div>
         <div className="cf-header-btn-group">
          <button className="btn-notificacao"
                  onClick={handleMenuOpen}  // Corrigir referência para a função de abertura
                  data-tooltip-id="tooltip-notificacao"
                  data-tooltip-content="Notificações">
              <i className="bi bi-bell-fill"></i>
            </button>
            <Tooltip
              id="tooltip-notificacao"
              place="bottom"
              style={{ backgroundColor: 'var(--corPrincipal)', color: '#fff' }} // Personalizando o estilo
            />

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <MenuItem onClick={handleMenuClose}>Notificação 1</MenuItem>
              <MenuItem onClick={handleMenuClose}>Notificação 2</MenuItem>
              <MenuItem onClick={handleMenuClose}>Notificação 3</MenuItem>
            </Menu>

            <button className="btn-logout"
                     data-tooltip-id="tooltip-logout"
                     data-tooltip-content="Sair">
              <i className="bi bi-box-arrow-right"></i>
            </button>

            <Tooltip
              id="tooltip-logout"
              place="bottom"
              style={{ backgroundColor: 'var(--corPrincipal)', color: '#fff' }} // Personalizando o estilo
            />
         </div>
        </div>
        <div className="cf-main">
            <div className="cf-main-top">
              <h2>Cadastrar novo funcionário</h2>
            </div>
            <div className="cf-main-content">
              <h3>Informações pessoais</h3>
              <form action="" className='cf-form'>
                <div className="cf-form-item">
                  <input type="text" name="" id="" className="cf-input" placeholder='Nome completo' />
                  
                  <InputMask
                    mask="99/99/9999"
                    className='cf-input'
                    placeholder='Data de nascimento'
                  />
                </div>
                <div className="cf-form-item">

                  <InputMask
                    mask="999.999.999-99"
                    className="cf-input"
                    placeholder='CPF'
                  />

                  <input type="text" name="" id="" className="cf-input" placeholder='Endereço' />
                </div>
                <div className="cf-form-item">
                  <InputMask
                    mask="99999-999"
                    className="cf-input"
                    placeholder='CEP'
                  />
                  
                  <Autocomplete
                  className='cf-select'
                  fullWidth
                  options={modalidade}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Modalidade de atuação"
                    sx={{
                      height: "35px",
                      fontFamily: "'DM Sans', sans-serif",
                      background: "var(--corBg)",
                      "& .MuiOutlinedInput-root": {
                        height: "40px",
                        borderColor: "var(--corPrincipal)",
                      },
                    }}
                  />
                )}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                    border: "0.5px solid var(--corPrincipal)",
                  },
                  "& .MuiAutocomplete-option": {
                    "&:hover": {
                      backgroundColor: "var(--corPrincipal)",
                      color: "white",
                    },
                  },
                }}
              />
                </div>
              </form>
              <br />
              <h3>Credenciais de login</h3>
              <form action="" className="cf-form">
                <div className="cf-form-item">
                  <input type="email" name="" id="" className="cf-input" placeholder='Email' />
                  <input type="password" name="" id="" className='cf-input' placeholder='Senha inicial' />
                </div>
              </form>

              <div className="cf-buton-div">
                <button type="submit" className='cf-btn-submit'>Cadastrar funcionário</button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default CadastroFuncionario;
