import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Box, Typography} from "@mui/material";
import { Modal, Button } from "react-bootstrap";
import { Container, Navbar, Offcanvas, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import logoWeclean from "../../assets/images/logo-weclean.png";
import "./home-funcionario.css";
import { Tooltip } from "react-tooltip";
import { LuLogOut } from "react-icons/lu";
import moment from "moment";
import "moment/locale/pt-br";
import "../../css/globalVar.css";
moment.locale("pt-br");


const localizer = momentLocalizer(moment);

const messages = {
  next: "Próximo",
  previous: "Anterior",
  today: "Hoje",
  month: "Mês",
  week: "Semana",
  day: "Dia",
  agenda: "Agenda",
  date: "Data",
  time: "Hora",
  event: "Evento",
  allDay: "Dia inteiro",
  noEventsInRange: "Nenhum evento neste intervalo",
  showMore: (total) => `+ ver mais (${total})`,
};

const formats = {
  dateFormat: "DD",
  dayFormat: (date, culture, localizer) =>
    localizer.format(date, "dddd", culture),
  weekdayFormat: (date, culture, localizer) =>
    localizer.format(date, "dddd", culture),
  timeGutterFormat: "HH:mm",
  agendaDateFormat: "DD/MM/YYYY",
  agendaTimeFormat: "HH:mm",
  agendaHeaderFormat: ({ start, end }, culture, localizer) =>
    localizer.format(start, "D MMM", culture) +
    " — " +
    localizer.format(end, "D MMM", culture),
  dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
    localizer.format(start, "D MMM YYYY", culture) +
    " — " +
    localizer.format(end, "D MMM YYYY", culture),
  eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
    `${localizer.format(start, "HH:mm", culture)} – ${localizer.format(
      end,
      "HH:mm",
      culture
    )}`,

  eventTimeFormat: "HH:mm",
};

const diaSemana = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];
const mesesAno = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function HomeFuncionario() {
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState("month"); 

  // Eventos de exemplo
  const events = [
    {
      id: 1,
      title: "Faxina - Apartamento",
      description: "Limpeza completa do apartamento.",
      clientName: "João Silva",
      serviceType: "Faxina",
      status: "Pendente", 
      start: new Date(2024, 9, 15, 10, 0),
      end: new Date(2024, 9, 15, 12, 0),
      address: "Rua das Flores, 123",
      city: "São Paulo",
      duration: "2h",
    },
    {
      id: 2,
      title: "Faxina - Empresa",
      description: "Limpeza da área de cozinha.",
      clientName: "Restaurante Gourmet",
      serviceType: "Cozinha",
      status: "Realizado",
      start: new Date(2024, 9, 3, 14, 0),
      end: new Date(2024, 9, 3, 16, 0),
      address: "Av. Paulista, 1000",
      city: "São Paulo",
      duration: "2h",
    },
    {
        id: 3,
        title: "Cozinha - Restaurante",
        description: "Limpeza da área de cozinha.",
        clientName: "Restaurante Gourmet",
        serviceType: "Cozinha",
        status: "Pendente", 
        start: new Date(2024, 9, 16, 14, 0),
        end: new Date(2024, 9, 16, 16, 0),
        address: "Av. Paulista, 1000",
        city: "São Paulo",
        duration: "2h",
      },
  ];

  // Função para abrir o modal com detalhes do evento
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  // Função para fechar o modal
  const handleClose = () => setOpen(false);

  return (
    <div className="home-funcionario-container">
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
                <Nav.Link href="#">Suporte</Nav.Link>
              </Nav>
              <div className="d-flex flex-column justify-content-center flex-lg-row align-items-center gap-2">
                <button
                  className="btn-logout"
                  data-tooltip-id="tooltip-logout"
                  data-tooltip-content="Sair"
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
      <div className="home-funcionario-main-content">
        <div className="home-funcionario-header">
          <h2 className="hf-header-txt">Sua agenda</h2>
        </div>
        <div className="home-funcionario-content">
          <div className="hf-agenda-content">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 400, width: "100%" }}
              onSelectEvent={handleEventClick}
              selectable
              messages={messages}
              draggableAccessor={() => true}
              onView={(view) => setCurrentView(view)}
              className="custom-calendar"
              eventPropGetter={(event) => {
                const backgroundColor =
                  event.status === "Pendente"
                    ? "var(--corPrincipal)"
                    : event.status === "Realizado"
                    ? "green"
                    : event.status === "Cancelado"
                    ? "red"
                    : "var(--corPrincipal)";

                // Define a cor de fundo transparente quando a visualização "Agenda" estiver selecionada
                if (currentView === "agenda") {
                  return { style: { backgroundColor: "var(--corBg)" } };
                }

                return {
                  style: { backgroundColor },
                };
              }}
              formats={{
                ...formats,
                weekdayFormat: (date, culture, localizer) =>
                  diaSemana[date.getDay()],
                dayFormat: (date, culture, localizer) =>
                  diaSemana[date.getDay()],
                monthHeaderFormat: (date, culture, localizer) =>
                  `${mesesAno[date.getMonth()]} ${date.getFullYear()}`,
                dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
                  `${diaSemana[start.getDay()]}, ${start.getDate()} de ${
                    mesesAno[start.getMonth()]
                  } — ${diaSemana[end.getDay()]}, ${end.getDate()} de ${
                    mesesAno[end.getMonth()]
                  } ${end.getFullYear()}`,
                dayHeaderFormat: (date, culture, localizer) =>
                  `${diaSemana[date.getDay()]}, ${date.getDate()} de ${
                    mesesAno[date.getMonth()]
                  } ${date.getFullYear()}`,
                agendaHeaderFormat: ({ start, end }, culture, localizer) =>
                  `${start.getDate()} de ${
                    mesesAno[start.getMonth()]
                  } — ${end.getDate()} de ${mesesAno[end.getMonth()]}`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Modal para detalhes do evento */}
      <Modal show={open} onHide={handleClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>{selectedEvent?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Descrição: {selectedEvent?.description}</p>
            <p>Nome do cliente: {selectedEvent?.clientName}</p>
            <p>Modalidade: {selectedEvent?.serviceType}</p>
            <p>Status: {selectedEvent?.status}</p>
            <p>Endereço: {selectedEvent?.address}</p>
            <p>Cidade: {selectedEvent?.city}</p>
            <p>Data: {selectedEvent?.start.toLocaleDateString()}</p>
            <p>Início: {selectedEvent?.start.toLocaleTimeString()}</p>
            <p>Duração: {selectedEvent?.duration}</p>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
            Fechar
            </Button>
        </Modal.Footer>
        </Modal>
    </div>
  );
}

export default HomeFuncionario;
