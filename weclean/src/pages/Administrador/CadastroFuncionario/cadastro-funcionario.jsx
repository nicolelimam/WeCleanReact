import React, { useState, useEffect } from "react";
import MenuSidebarAdministrador from "../../../components/AdmMenuSidebar/adm-menu-sidebar";
import "./cadastro-funcionario.css";
import { Tooltip } from "react-tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Autocomplete, TextField } from "@mui/material";
import InputMask from "react-input-mask"; 
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';

function CadastroFuncionario() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1299) {
        setShowSidebar(false); // oculta o menu se a largura for <= 1299px
      } else {
        setShowSidebar(true);  // exibe o menu se a largura for > 1299px
      }
    };

    window.addEventListener("resize", handleResize);

    // executa o handleResize inicialmente para verificar o tamanho ao carregar a página
    handleResize();

    return () => window.removeEventListener("resize", handleResize); // Limpa o evento quando o componente desmonta
  }, []);

  const modalidade = [
    { label: "Faxina", value: "faxina" },
    { label: "Lavanderia", value: "lavanderia" },
    { label: "Cozinha", value: "cozinha" },
    { label: "Jardinagem", value: "jardinagem" },
  ];

  const rows = [
    { id: 1, nome: 'Ana Souza', email: 'ana.souza@example.com', telefone: '(11) 99999-9999', localizacao: 'São Paulo, SP', modalidade: 'Faxina' },
    { id: 2, nome: 'Carlos Almeida', email: 'carlos.almeida@example.com', telefone: '(21) 98888-8888', localizacao: 'Rio de Janeiro, RJ', modalidade: 'Lavanderia' },
    { id: 3, nome: 'Maria Santos', email: 'maria.santos@example.com', telefone: '(31) 97777-7777', localizacao: 'Belo Horizonte, MG', modalidade: 'Cozinha' },
    { id: 4, nome: 'Pedro Silva', email: 'pedro.silva@example.com', telefone: '(41) 96666-6666', localizacao: 'Curitiba, PR', modalidade: 'Jardinagem' },
  ];

  const columns = [
    { field: 'nome', headerName: 'Nome', flex: 1, sortable: true },
    { field: 'email', headerName: 'Email', flex: 1, sortable: true },
    { field: 'telefone', headerName: 'Telefone', flex: 1, sortable: true },
    { field: 'localizacao', headerName: 'Localização', flex: 1, sortable: true },
    { field: 'modalidade', headerName: 'Modalidade de Serviço', flex: 1, sortable: true },
    {
      field: 'actions',
      headerName: 'Ações',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginRight: 10 }}
            onClick={() => handleEdit(params.id)}
          >
            Editar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDeactivate(params.id)}
          >
            Desativar
          </Button>
        </div>
      ),
    },
  ];

  const handleEdit = (id) => {
    console.log(`Editando funcionário com ID: ${id}`);
  };

  const handleDeactivate = (id) => {
    console.log(`Desativando funcionário com ID: ${id}`);
  };

  return (
    <div className="cadastro-funcionario-container">
      {showSidebar && <MenuSidebarAdministrador />}

      <div className="cf-content">
        <div className="cf-header">
          <div className="cf-header-txt">
            <h5>Olá, Ana!</h5>
          </div>
          <div className="cf-header-btn-group">
            <button
              className="btn-notificacao"
              onClick={handleMenuOpen} 
              data-tooltip-id="tooltip-notificacao"
              data-tooltip-content="Notificações"
            >
              <i className="bi bi-bell-fill"></i>
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

            <button
              className="btn-logout"
              data-tooltip-id="tooltip-logout"
              data-tooltip-content="Sair"
            >
              <i className="bi bi-box-arrow-right"></i>
            </button>

            <Tooltip
              id="tooltip-logout"
              place="bottom"
              style={{ backgroundColor: "var(--corPrincipal)", color: "#fff" }} // Personalizando o estilo
            />
          </div>
        </div>
        <div className="cf-main">
          <div className="cf-main-top">
            <h2>Cadastrar novo funcionário</h2>
          </div>
          <div className="cf-main-content">
            <h3>Informações pessoais</h3>
            <form action="" className="cf-form">
              <div className="cf-form-item">
                <input
                  type="text"
                  name=""
                  id=""
                  className="cf-input"
                  placeholder="Nome completo"
                />

                <InputMask
                  mask="99/99/9999"
                  className="cf-input"
                  placeholder="Data de nascimento"
                />
              </div>
              <div className="cf-form-item">
                <InputMask
                  mask="999.999.999-99"
                  className="cf-input"
                  placeholder="CPF"
                />

                <InputMask
                  mask="(99) 99999-9999"
                  placeholder="Telefone"
                  className="cf-input"
                />
              </div>
              <div className="cf-form-item">
                <Autocomplete
                  className="cf-select"
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
              <div className="cf-form-item"></div>
            </form>
            <br />
            <h3>Endereço</h3>
            <form action="" className="cf-form">
              <div className="cf-form-item">
                <InputMask
                  mask="99999-999"
                  className="cf-input"
                  placeholder="CEP"
                />
                <input
                  type="text"
                  name=""
                  id=""
                  className="cf-input"
                  placeholder="Rua"
                />
              </div>
              <div className="cf-form-item">
                <InputMask
                  mask="999"
                  maskChar=""
                  className="cf-input"
                  placeholder="Número"
                />
                <input type="text" name="" id="" className="cf-input" placeholder="Bairro" />
              </div>
              <div className="cf-form-item">
                <input type="text" name="" id="" className="cf-input" placeholder="Cidade" />
                <input type="text" name="" id="" className="cf-input" placeholder="Estado"/>
              </div>
            </form>
            <br /> <br />
            <h3>Credenciais de login</h3>
            <form action="" className="cf-form">
              <div className="cf-form-item">
                <input
                  type="email"
                  name=""
                  id=""
                  className="cf-input"
                  placeholder="Email"
                />
                <input
                  type="password"
                  name=""
                  id=""
                  className="cf-input"
                  placeholder="Senha inicial"
                />
              </div>
            </form>

            <div className="cf-buton-div">
              <button type="submit" className="cf-btn-submit">
                Cadastrar funcionário
              </button>
            </div>
          </div>
        </div>
        <br />
        <div className="cf-main">
          <div className="cf-main-top">
            <h2>Funcionários cadastrados</h2>
          </div>
          <div className="cf-main-content">
          <div style={{ height: 400, width: '100%', overflowX: 'auto' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              className="cf-datagrid"
              disableColumnMenu={false}
              autoHeight={false}
              sx={{
                '& .MuiDataGrid-root': {
                  backgroundColor: 'var(--corBg)',
                },
                '& .MuiDataGrid-cell': {
                  whiteSpace: 'nowrap',
                },
              }}
            />
          </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CadastroFuncionario;
