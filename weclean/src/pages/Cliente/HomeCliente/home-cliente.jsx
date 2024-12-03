import React, { useState, useEffect } from 'react';
import './home-cliente.css';
import { Container, Navbar, Offcanvas, Nav, Dropdown, Modal, Button } from "react-bootstrap";
import { Tooltip } from "react-tooltip";
import { LuLogOut } from "react-icons/lu";
import logoWeclean from "../../../assets/images/logo-weclean.png";
import { Link } from 'react-router-dom';
import { useClearSessionAndRedirect } from '../../../utils/session';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { db } from '../../../backend/firebase';
import { getUserSession } from '../../../utils/session';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import { query, collection, getDocs, doc, updateDoc, where } from 'firebase/firestore';
import Chatbot from '../../../components/ChatBot/chatbot';

function HomeCliente() {

  const handleLogout = useClearSessionAndRedirect();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]); // Agora armazena múltiplos eventos


  useEffect(() => {
    fetchUserEvents();
  }, []);

  const fetchUserEvents = async () => {
    const userSession = getUserSession();
    if (!userSession) return;
  
    const { userId } = userSession;
  
    const servicosQuery = query(
      collection(db, "servicos"),
      where("cliente_id", "==", userId),
      where("status", "in", ["pendente", "em andamento"])
    );
  
    const snapshot = await getDocs(servicosQuery);
    const eventos = [];
  
    for (const servicoDoc of snapshot.docs) {
      const data = servicoDoc.data();
      eventos.push({
        id: servicoDoc.id,
        data_realizacao: data.data_realizacao.toDate(), // Garante conversão correta
        modalidade: data.modalidade_servico,
        pagamento_status: data.pagamento_status,
        cliente_id: data.cliente_id,
        funcionario_id: data.funcionario_id,
        endereco: await fetchUserAddress(data.cliente_id),
        funcionario: await fetchFuncionarioName(data.funcionario_id),
        status: data.status,
      });
    }
  
    setEvents(eventos); // Atualiza o estado corretamente
  };
  

  const fetchFuncionarioName = async (funcionarioId) => {
    if (!funcionarioId) return "Não atribuído";

    const usuariosQuery = query(
      collection(db, "usuarios"),
      where("funcao", "==", "funcionario")
    );

    const usuariosSnapshot = await getDocs(usuariosQuery);

    for (const usuarioDoc of usuariosSnapshot.docs) {
      const funcionariosRef = collection(
        db,
        `usuarios/${usuarioDoc.id}/funcionarios`
      );

      const funcionariosSnapshot = await getDocs(funcionariosRef);

      for (const funcDoc of funcionariosSnapshot.docs) {
        if (funcDoc.id === funcionarioId) {
          return funcDoc.data().nome || "Não atribuído";
        }
      }
    }
    return "Não atribuído";
  };

  const fetchUserAddress = async (clienteId) => {
    const clienteRef = collection(db, `usuarios/${clienteId}/clientes`);
    const clienteSnapshot = await getDocs(clienteRef);

    for (const clienteDoc of clienteSnapshot.docs) {
      const endereco = clienteDoc.data().endereco || {};
      return `${endereco.rua || "Rua não especificada"}, ${endereco.numero || "s/n"}, ${endereco.bairro || ""}, ${endereco.cidade || ""} - ${endereco.estado || ""}, CEP: ${endereco.cep || ""}`;
    }
    return "Endereço não especificado";
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = date.toISOString().split("T")[0];
      const currentDate = new Date().toISOString().split("T")[0];
  
      const event = events.find(
        (event) => event.data_realizacao.toISOString().split("T")[0] === formattedDate
      );
  
      if (event) {
        if (event.status === "pendente") {
          return "highlight-pending"; // Azul claro
        }
        if (event.status === "cancelado") {
          return "highlight-canceled"; // Laranja claro
        }
        if (formattedDate === currentDate) {
          return "highlight-today"; // Verde claro
        }
      }
    }
    return "";
  };
  
  
  
  const handleDayClick = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const eventsForDay = events.filter(
      (event) => event.data_realizacao.toISOString().split("T")[0] === formattedDate
    );
  
    if (eventsForDay.length > 0) {
      setSelectedEvents(eventsForDay); // Define todos os eventos do dia
      setShowModal(true);
    }
  };
  

  const handleCancel = async (id) => {
    try {
      const serviceRef = doc(db, "servicos", id);
      await updateDoc(serviceRef, { status: "cancelado" });
      toast.success("Serviço cancelado com sucesso!");
      setShowConfirmationModal(false); // Fecha o modal de confirmação
      setShowModal(false); // Garante que o modal de informações também esteja fechado
      fetchUserEvents(); // Atualiza os eventos no calendário
    } catch (error) {
      toast.error("Erro ao cancelar o serviço. Tente novamente.");
      console.error(error);
    }
  };
  

  return (
    <div className='home-cliente-container'>
      <Chatbot userType="cliente" />
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
        <p>Para cancelar serviços, acesse a área "Serviços" no menu.</p>
        <div className="home-cliente-content">
        <div className="hc-calendar-header">
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" className='btn-forms-hc'>
              +  Solicitar serviço
            </Dropdown.Toggle>
            <Dropdown.Menu className='btn-forms-dropdown-hc'>
              <Dropdown.Item as={Link} to='/form-faxina'>Agendar faxina</Dropdown.Item>
              <Dropdown.Item as={Link} to='/form-lavanderia'>Agendar lavanderia</Dropdown.Item>
              <Dropdown.Item as={Link} to='/form-cozinha'>Agendar serviço de cozinha</Dropdown.Item>
              <Dropdown.Item as={Link} to='/form-jardinagem'>Agendar jardinagem</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Calendário */}
        <div className="hc-calendar-content">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={tileClassName} // Adicionado para estilizar os dias com eventos
          onClickDay={handleDayClick} // Adicionado para abrir o modal ao clicar em um dia com evento
        />

        </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title style={{ fontSize: "22px", fontWeight: "700", color: "var(--corPrincipal)" }}>
      Serviços do Dia
    </Modal.Title>
    
  </Modal.Header>
  <Modal.Body>
    {selectedEvents.length > 0 ? (
      selectedEvents.map((event, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <p style={{ textTransform: "capitalize", fontSize: "18px" }}><strong>Modalidade:</strong> {event.modalidade}</p>
          <p style={{ textTransform: "capitalize", fontSize: "18px" }}><strong>Nome do prestador de serviço:</strong> {event.funcionario}</p>
          <p style={{ textTransform: "capitalize", fontSize: "18px" }}><strong>Data de realização:</strong> {event.data_realizacao.toLocaleString()}</p>
          <p style={{ textTransform: "capitalize", fontSize: "18px" }}><strong>Endereço:</strong> {event.endereco}</p>
          <p style={{ textTransform: "capitalize", fontSize: "18px" }}><strong>Status do pagamento:</strong> {event.pagamento_status}</p>
          <hr />
        </div>
      ))
    ) : (
      <p>Nenhum serviço marcado para este dia.</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Fechar
    </Button>
  </Modal.Footer>
</Modal>

<Modal
  show={showConfirmationModal}
  onHide={() => {
    setShowConfirmationModal(false);
    setShowModal(false); // Fecha o modal de informações
  }}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title style={{ fontSize: "22px", fontWeight: "700", color: "var(--corPrincipal)" }}>
      Confirmar Cancelamento
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>Você realmente deseja cancelar este serviço?</p>
  </Modal.Body>
  <Modal.Footer>
    <Button
      variant="danger"
      onClick={() => handleCancel(selectedEvents[0]?.id)} // Exemplo para cancelar o primeiro serviço selecionado
    >
      Confirmar
    </Button>
    <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
      Voltar
    </Button>
  </Modal.Footer>
</Modal>



    </div>
  )
}

export default HomeCliente
