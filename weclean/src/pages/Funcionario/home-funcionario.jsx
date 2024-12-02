import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { Modal, Button } from "react-bootstrap";
import { Container, Navbar, Offcanvas, Nav } from "react-bootstrap";
import { LuLogOut } from "react-icons/lu";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./home-funcionario.css";
import { useClearSessionAndRedirect } from "../../utils/session";
import logoWeclean from "../../assets/images/logo-weclean.png";
import { getUserSession } from "../../utils/session";
import { db } from "../../backend/firebase";
import {
  collection,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";

moment.locale("pt-br");

const localizer = momentLocalizer(moment);

function HomeFuncionario() {
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const isSmallScreen = useMediaQuery("(max-width:999px)");
  const [servicos, setServicos] = useState([]);
  const [showModalConfirmarCancelamento, setShowModalConfirmarCancelamento] =
    useState(false);
  const [activeTab, setActiveTab] = useState(0); // Controle das abas (Pendentes, Finalizados, etc.)
  const categorias = ["pendente", "finalizado", "cancelado", "em analise"]; // Status permitidos
  const servicesPerPage = 7; // Quantidade de serviços por página
  const [page, setPage] = useState(1); // Página atual para paginação
  const [detalhesServico, setDetalhesServico] = useState(null);

  useEffect(() => {
    const loadServicos = async () => {
      const fetchedServicos = await fetchFuncionarioServicos();
      setServicos(fetchedServicos); // Corrigir para setServicos
    };

    loadServicos();
  }, []);

  const capitalizeFirstLetter = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const fetchFuncionarioServicos = async () => {
    try {
      const session = getUserSession();
      if (!session || !session.userId) {
        console.error("Sessão de usuário não encontrada.");
        return [];
      }

      const userDocRef = doc(db, "usuarios", session.userId);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        console.error("Usuário não encontrado.");
        return [];
      }

      const userData = userDoc.data();
      if (userData.funcao !== "funcionario") {
        console.error("Usuário não é um funcionário.");
        return [];
      }

      const funcionariosRef = collection(userDocRef, "funcionarios");
      const funcionariosSnapshot = await getDocs(funcionariosRef);
      if (funcionariosSnapshot.empty) {
        console.error("Documento do funcionário não encontrado.");
        return [];
      }

      const funcionarioDoc = funcionariosSnapshot.docs[0];
      const funcionarioId = funcionarioDoc.id;

      const servicosQuery = query(
        collection(db, "servicos"),
        where("funcionario_id", "==", funcionarioId)
      );
      const servicosSnapshot = await getDocs(servicosQuery);

      const fetchedServicos = [];
      for (const servicoDoc of servicosSnapshot.docs) {
        const servicoData = servicoDoc.data();

        let clienteNome = "Não identificado";
        let cidade = "Cidade não especificada";
        let enderecoCompleto = "Endereço não especificado";

        if (servicoData.cliente_id) {
          const clienteRef = collection(
            db,
            `usuarios/${servicoData.cliente_id}/clientes`
          );
          const clienteSnapshot = await getDocs(clienteRef);

          clienteSnapshot.forEach((clienteDoc) => {
            const clienteData = clienteDoc.data();
            clienteNome = clienteData.nome || clienteNome;

            const endereco = clienteData.endereco || {};
            cidade = endereco.cidade || cidade;
            enderecoCompleto = `${endereco.rua || "Rua não especificada"}, ${
              endereco.numero || "s/n"
            }, ${endereco.bairro || ""}, ${cidade} - ${
              endereco.estado || ""
            }, CEP: ${endereco.cep || ""}`;
          });
        }

        fetchedServicos.push({
          id: servicoDoc.id,
          title: `${capitalizeFirstLetter(
            servicoData.modalidade_servico
          )} - ${capitalizeFirstLetter(clienteNome)}`,
          description: capitalizeFirstLetter(
            servicoData.observacoes || "Sem descrição"
          ),
          clientName: capitalizeFirstLetter(clienteNome),
          serviceType: capitalizeFirstLetter(servicoData.modalidade_servico),
          status: capitalizeFirstLetter(servicoData.status) || "Sem status",
          start: servicoData.data_realizacao
            ? servicoData.data_realizacao.toDate()
            : new Date(), // Fallback para data atual
          end: servicoData.data_realizacao
            ? servicoData.data_realizacao.toDate()
            : new Date(), // Fallback para data atual
          address: capitalizeFirstLetter(enderecoCompleto),
          city: capitalizeFirstLetter(cidade),
        });
      }

      return fetchedServicos;
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      return [];
    }
  };

  // const handleEventClick = (event) => {
  //   setDetalhesServico(event);
  //   setOpen(true);
  // };
  const handleEventClick = (event) => {
    if (event) {
      setDetalhesServico(event);
      setSelectedEvent(event);
      setOpen(true);
    } else {
      console.error("Evento selecionado é inválido:", event);
    }
  };

  const handleClose = () => setOpen(false);
  const filteredServicos = servicos
    .filter((servico) => {
      const statusAtual = categorias[activeTab];
      return (
        servico.status !== "cancelado" &&
        servico.status !== "em analise" &&
        servico.status.toLowerCase() === statusAtual
      );
    })
    .slice((page - 1) * servicesPerPage, page * servicesPerPage);

  const handleLogout = useClearSessionAndRedirect();

  const abrirModalCancelarServico = (id) => {
    setDetalhesServico((prev) => ({ ...prev, cancelarId: id }));
    setShowModalConfirmarCancelamento(true);
  };

  const solicitarCancelamentoServico = async (id) => {
    try {
      const servicoRef = doc(db, "servicos", id);
      await updateDoc(servicoRef, { status: "em analise" });
      toast.success("Solicitação de cancelamento enviada!");

      // Atualizar o estado local
      setServicos((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "em analise" } : s))
      );

      setShowModalConfirmarCancelamento(false);
      setDetalhesServico(null);
    } catch (error) {
      console.error("Erro ao solicitar cancelamento:", error);
      toast.error("Erro ao solicitar cancelamento. Tente novamente.");
    }
  };

  const confirmarServico = async (id) => {
    try {
      const servicoRef = doc(db, "servicos", id);
      await updateDoc(servicoRef, { status: "finalizado" });
      toast.success("Serviço confirmado como finalizado!");

      // Atualizar o estado local
      setServicos((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "finalizado" } : s))
      );

      setDetalhesServico(null);
    } catch (error) {
      console.error("Erro ao confirmar serviço:", error);
      toast.error("Erro ao confirmar o serviço. Tente novamente.");
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1); // Reseta a página ao trocar de aba
  };

  return (
    <div className="home-funcionario-container">
      <ToastContainer />
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
            <Offcanvas.Body className="menu-bar-hf">
              <Nav className="justify-content-center align-items-center flex-grow-1 pe-3">
                <Nav.Link href="#"></Nav.Link>
              </Nav>
              <div className="btn-logout-hf-div">
                <button
                  className="btn-logout"
                  onClick={handleLogout}
                  data-tooltip-id="tooltip-logout"
                  data-tooltip-content="Sair"
                >
                  <LuLogOut />
                </button>
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <div className="home-funcionario-main-content">
        <div className="home-funcionario-header">
          <h2 className="hf-header-txt">Sua agenda</h2>
          {/* <div className="hf-header-item">
            <TextField
              label="Filtrar por data"
              type="date"
              variant="outlined"
              className="data-filter-hf"
              size="small"
              onChange={(e) => setFilterDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </div> */}
        </div>
        <div className="home-funcionario-content">
          {isSmallScreen ? (
            <Box
              className="hf-card-list"
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {filteredServicos.map((event) => (
                <Card key={event.id} variant="outlined" className="hf-card">
                  <CardActionArea onClick={() => handleEventClick(event)}>
                    <CardContent>
                      <Typography variant="h6" className="hf-card-title">
                        {event.title}
                      </Typography>
                      <Typography variant="body2">
                        Cliente: {event.clientName}
                      </Typography>
                      <Typography variant="body2">
                        Data: {moment(event.start).format("DD/MM/YYYY")}
                      </Typography>
                      <Typography variant="body2">
                        Horário: {moment(event.start).format("HH:mm")}
                      </Typography>
                      <Typography variant="body2">
                        Clique para ver mais detalhes!
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}

              {filteredServicos.length === 0 && (
                <Typography variant="body2" color="textSecondary">
                  Nenhum evento encontrado para a data selecionada.
                </Typography>
              )}
            </Box>
          ) : (
            <Calendar
              localizer={localizer}
              events={servicos}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 400, width: "100%" }}
              onSelectEvent={handleEventClick}
              messages={{
                next: "Próximo",
                previous: "Anterior",
                today: "Hoje",
                month: "Mês",
                week: "Semana",
                day: "Dia",
                agenda: "Agenda",
              }}
            />
          )}
        </div>
      </div>

      <Modal show={open} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{fontSize: "22px", fontWeight: "700", color: "var(--corPrincipal)"}}>{selectedEvent?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent ? (
            <>
              <p style={{fontSize: "18px"}}><strong>Descrição:</strong> {selectedEvent.description || "Não disponível"}</p>
              <p style={{fontSize: "18px"}}>
                <strong>Nome do cliente:</strong> {selectedEvent.clientName || "Não disponível"}
              </p>
              <p style={{fontSize: "18px"}}><strong>Modalidade:</strong> {selectedEvent.serviceType || "Não disponível"}</p>
              <p style={{fontSize: "18px"}}><strong>Status:</strong> {selectedEvent.status || "Não disponível"}</p>
              <p style={{fontSize: "18px"}}><strong>Endereço:</strong> {selectedEvent.address || "Não disponível"}</p>
              <p style={{fontSize: "18px"}}><strong>Cidade:</strong> {selectedEvent.city || "Não disponível"}</p>
              <p style={{fontSize: "18px"}}>
                <strong>Data:</strong>
                {" "}
                {selectedEvent.start
                  ? selectedEvent.start.toLocaleDateString()
                  : "Não disponível"}
              </p>
              <p style={{fontSize: "18px"}}>
                <strong>Início:</strong>
                {" "}
                {selectedEvent.start
                  ? selectedEvent.start.toLocaleTimeString()
                  : "Não disponível"}
              </p>
            </>
          ) : (
            <p style={{fontSize: "18px"}}><strong>Erro:</strong> Evento não encontrado ou inválido.</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          {detalhesServico && detalhesServico.status === "pendente" && (
            <>
              {detalhesServico.start &&
              new Date() >= new Date(detalhesServico.start) ? (
                <Button
                  variant="success"
                  onClick={() => confirmarServico(detalhesServico.id)}
                >
                  Confirmar Realização do Serviço
                </Button>
              ) : (
                <Button
                  variant="warning"
                  onClick={() => abrirModalCancelarServico(detalhesServico.id)}
                >
                  Solicitar Cancelamento do Serviço
                </Button>
              )}
            </>
          )}

          <Button variant="secondary" onClick={() => setDetalhesServico(null)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showModalConfirmarCancelamento}
        onHide={() => setShowModalConfirmarCancelamento(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Tem certeza de que deseja solicitar o cancelamento deste serviço?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalConfirmarCancelamento(false)}
          >
            Não
          </Button>
          <Button
            variant="warning"
            onClick={() =>
              solicitarCancelamentoServico(detalhesServico?.cancelarId)
            }
          >
            Sim
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default HomeFuncionario;
