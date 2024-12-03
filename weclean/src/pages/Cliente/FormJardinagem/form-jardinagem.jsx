import React, { useState, useEffect } from "react";
import { Navbar, Nav, Offcanvas, Container, Button } from "react-bootstrap";
import logoWeclean from "../../../assets/images/logo-weclean.png";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../css/globalVar.css";
import '../../../css/globalForm.css';
import { Autocomplete, TextField } from "@mui/material";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../../backend/firebase";
import { getUserSession } from "../../../utils/session";
import { useClearSessionAndRedirect } from "../../../utils/session";
import { LuLogOut } from "react-icons/lu";
import { Tooltip } from "recharts";
import Chatbot from "../../../components/ChatBot/chatbot";

function FormularioJardinagem() {
  const [areaVerde, setAreaVerde] = useState(0);
  const [tipoServico, setTipoServico] = useState('');
  const [tipoLocal, setTipoLocal] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [preco, setPreco] = useState(0);
  const navigate = useNavigate();

  // Estado para armazenar o valor do botão selecionado
  const [selectedDiasSemanaCozinha, setSelectedDiasSemanaCozinha] = useState([]);

  const handleLogout = useClearSessionAndRedirect();

  useEffect(() => {
    if (areaVerde > 5) {
      const precoCalculado = 50 + (areaVerde - 5) * 5; // R$50 base + R$5 por metro quadrado a partir de 5m²
      setPreco(precoCalculado);
    } else {
      setPreco(50); // Valor base de R$50 para até 5m²
    }
  }, [areaVerde]);

  // Função para alterar o botão selecionado
  const handleButtonClick = (diasSemanaCozinha) => {
    if (selectedDiasSemanaCozinha.includes(diasSemanaCozinha)) {
      // Remove se já estiver selecionado
      setSelectedDiasSemanaCozinha(selectedDiasSemanaCozinha.filter(item => item !== diasSemanaCozinha));
    } else {
      // Adiciona se não estiver selecionado
      setSelectedDiasSemanaCozinha([...selectedDiasSemanaCozinha, diasSemanaCozinha]);
    }
  };

  

  const handleSaveData = async () => {
    const userSession = getUserSession();
    if (!userSession) {
      toast.error("Usuário não logado!");
      return;
    }
  
    try {
      // Adiciona o documento na coleção "servicos"
      const servicoRef = await addDoc(collection(db, "servicos"), {
        cliente_id: userSession.userId, // Pega o ID do usuário da sessão
        data_realizacao: Timestamp.fromDate(new Date()), // Define a data de realização como a data atual
        modalidade_servico: "jardinagem", // Modalidade fixa
        observacoes,
        pagamento: "", // Deixar vazio conforme solicitado
        pagamento_status: "pendente", // Status fixo
        pagamento_tipo: "", // Deixar vazio conforme solicitado
        valor: preco, // Salva o valor como número
        status: "pendente", // Status fixo
      });
  
      // Adiciona os dados de jardinagem na subcoleção "jardinagem"
      await addDoc(collection(servicoRef, "jardinagem"), {
        area_verde: areaVerde, // Salva como número
        tipo_local: tipoLocal,
        tipo_servico: tipoServico,
      });
  
      toast.success("Serviço agendado com sucesso!");
      navigate("/form-endereco"); // Redireciona após salvar os dados
    } catch (e) {
      toast.error("Erro ao salvar dados no banco!");
      console.error("Erro ao salvar no Firestore", e);
    }
  };
  
  
  const tipoServicoValue = [
    { label: "Manutenção", value: "manutencao" },
    { label: "Paisagismo", value: "paisagismo" },
    { label: "Corte de grama", value: "corte-grama" },
    { label: "Poda de árvores e arbustos", value: "poda" },
  ];

  const locais = [
    { label: "Jardim residencial", value: "residencia" },
    { label: "Jardim empresarial", value: "estabelecimento" },
  ];

  const handleCancel = () => {
    navigate('/home-cliente');
  };


  return (
    <div className="form-page-container">
      <ToastContainer />
      <Chatbot userType="cliente" />
      <Navbar bg="white" expand="lg" fixed="top" className="shadow-sm">
        <Container>
          <Navbar.Brand href="#" className="fs-4 logo">
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
                <Nav.Link href="/home-cliente"></Nav.Link>
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

      <div className="form-default-content">
        <div className="f-title-div">
          <h2>Agendamento</h2>
        </div>
        <form 
          onSubmit={(e) => {
            e.preventDefault(); 
            handleSaveData(); 
          }} 
          className="form-default"
        >
          <div className="form-default-row ">
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Modalidade do serviço:
              </label>
              <span className="ff-text" id="modalidadeServico">
                Serviço de jardinagem
              </span>
            </div>
          </div>
          <div className="form-default-row">
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Tipo de serviço:
              </label>
              <Autocomplete
                fullWidth
                options={tipoServicoValue}
                onChange={(e, value) => setTipoServico(value?.value || '')}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Selecione uma opção"
                    sx={{
                      height: "35px",
                      "& .MuiOutlinedInput-root": {
                        height: "35px",
                        borderColor: "var(--corPrincipal)",
                      },
                    }}
                  />
                )}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "35px",
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
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Tipo de local:
              </label>
              <Autocomplete
                fullWidth
                options={locais}
                onChange={(e, value) => setTipoLocal(value?.value || '')}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Selecione uma opção"
                    sx={{
                      height: "35px",
                      "& .MuiOutlinedInput-root": {
                        height: "35px",
                        borderColor: "var(--corPrincipal)",
                      },
                    }}
                  />
                )}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "35px",
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
            
          </div>
          <div className="form-default-row">
          <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Tamanho da área verda (em m²):
              </label>
              <input type="number" className="f-input" placeholder="Ex: 4" onChange={(e) => setAreaVerde(Number(e.target.value))}/>
            </div>
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Data para realização do serviço:
              </label>
              <input type="datetime-local" name="" className="f-input f-date" />
            </div>
          </div>
          <div className="form-default-row">
           
            <div className="form-default-item">
              <label htmlFor="" className="f-label">
                Observações adicionais sobre o jardim:
              </label>
              <textarea name=""  className="f-txtarea2"  onChange={(e) => setObservacoes(e.target.value)}>

              </textarea>
            </div>
            <div className="form-default-item preco-panel" 
            style={{display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "flex-end"
            }}>
              <p>Valor total:</p>
              <h3 className="preco">R$ {preco}</h3>
            </div>
          </div>
          <br />
          <div className="form-default-row">
              <p>
                  <i className="bi bi-info-circle"></i> A negociação para o serviço em empresas deverá ser realizado diretamente com
                  a equipe de atendimento da WeClean. Ao finalizar a solicitação de serviço, você estará permitindo que entremos em contato com você.
                  <br />
                  Os equipamentos e materiais necessários para o serviço de jardinagem será
                  fornecido pela WeClean como suporte ao prestador de serviço. 
              </p>
          </div>
          <div className="ff-btn-div">
            <button onClick={handleCancel} type="reset" className="cancel-button">Cancelar e voltar</button>
            <button type="submit" className="confirm-button">Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioJardinagem;
