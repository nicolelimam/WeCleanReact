import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Box, Typography, Card, CardContent, CardActionArea, TextField, useMediaQuery } from "@mui/material";
import { Modal, Button } from "react-bootstrap";
import { Container, Navbar, Offcanvas, Nav } from "react-bootstrap";
import { LuLogOut } from "react-icons/lu";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./home-funcionario.css";
import { useClearSessionAndRedirect } from "../../utils/session";
moment.locale("pt-br");

const localizer = momentLocalizer(moment);

function HomeFuncionario() {
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const isSmallScreen = useMediaQuery("(max-width:999px)");

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
  ];

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const filteredEvents = events.filter(event => {
    if (!filterDate) return true;
    const eventDate = moment(event.start).format("YYYY-MM-DD");
    return eventDate === filterDate;
  });

  const handleLogout = useClearSessionAndRedirect();

  return (
    <div className="home-funcionario-container">
      <Navbar bg="white" expand="lg" fixed="top" className="shadow-sm">
        <Container>
          <Navbar.Brand href="#bannerHeader" className="fs-4 logo">WeClean</Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
          <Navbar.Offcanvas id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel" placement="start">
            <Offcanvas.Header closeButton className="border-bottom">
              <Offcanvas.Title id="offcanvasNavbarLabel">WeClean</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-center align-items-center flex-grow-1 pe-3">
                <Nav.Link href="#">Suporte</Nav.Link>
              </Nav>
              <button className="btn-logout" onClick={handleLogout} data-tooltip-id="tooltip-logout" data-tooltip-content="Sair">
                <LuLogOut />
              </button>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <div className="home-funcionario-main-content">
        <div className="home-funcionario-header">
          <h2 className="hf-header-txt">Sua agenda</h2>
          <div className="hf-header-item">
          <TextField
            label="Filtrar por data"
            type="date"
            variant="outlined"
            className="data-filter-hf"
            size="small"
            onChange={(e) => setFilterDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          </div>
        </div>
        <div className="home-funcionario-content">
          {isSmallScreen ? (
            <Box className="hf-card-list" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {filteredEvents.map(event => (
                <Card key={event.id} variant="outlined" className="hf-card">
                  <CardActionArea onClick={() => handleEventClick(event)}>
                    <CardContent>
                      <Typography variant="h6" className="hf-card-title">{event.title}</Typography>
                      <Typography variant="body2">Cliente: {event.clientName}</Typography>
                      <Typography variant="body2">Data: {moment(event.start).format("DD/MM/YYYY")}</Typography>
                      <Typography variant="body2">Horário: {moment(event.start).format("HH:mm")}</Typography>
                      <Typography variant="body2">Clique para ver mais detalhes!</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
              {filteredEvents.length === 0 && (
                <Typography variant="body2" color="textSecondary">
                  Nenhum evento encontrado para a data selecionada.
                </Typography>
              )}
            </Box>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 400, width: "100%" }}
              onSelectEvent={handleEventClick}
              messages={{ next: "Próximo", previous: "Anterior", today: "Hoje", month: "Mês", week: "Semana", day: "Dia", agenda: "Agenda" }}
            />
          )}
        </div>
      </div>

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
          <Button variant="secondary" onClick={handleClose}>Fechar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default HomeFuncionario;
