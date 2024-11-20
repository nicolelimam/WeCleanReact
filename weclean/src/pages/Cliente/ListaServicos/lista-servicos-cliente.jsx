import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getUserSession } from "../../../utils/session";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Container, Navbar, Offcanvas, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./lista-servicos-cliente.css";
import { Tooltip } from "react-tooltip";
import { LuLogOut } from "react-icons/lu";
import { db } from "../../../backend/firebase";
import logoWeclean from "../../../assets/images/logo-weclean.png";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import BeatLoader from "react-spinners/BeatLoader";
import Pagination from "@mui/material/Pagination";
import { useClearSessionAndRedirect } from "../../../utils/session";

function ListaServicosCliente() {
  const [servicos, setServicos] = useState([]);
  const [categoriaAtual, setCategoriaAtual] = useState(0);
  const [modalAberto, setModalAberto] = useState(false);
  const [detalhesServico, setDetalhesServico] = useState(null);
  const [funcionarioNome, setFuncionarioNome] = useState("");
  const [avaliacaoModalAberto, setAvaliacaoModalAberto] = useState(false);
  const [servicoParaCancelarId, setServicoParaCancelarId] = useState(null);
  const [avaliacaoServico, setAvaliacaoServico] = useState({
    qualidade: 0,
    profissionalismo: 0,
    comentario: "",
  });
  const [loading, setLoading] = useState(true); // Novo estado para carregamento
  const [paginaAtual, setPaginaAtual] = useState(1); // Estado para controle da página atual
  const CARDS_POR_PAGINA = 5; // Constante para o número de cards por página

  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false); // Controle do modal de confirmação

  const categorias = ["pendente", "finalizado", "cancelado"];

  //para logout
  const handleLogout = useClearSessionAndRedirect();

  useEffect(() => {
    const carregarServicos = async () => {
      setLoading(true);
      try {
        const db = getFirestore();
        const session = getUserSession();

        if (!session) {
          toast.error("Usuário não está logado!");
          return;
        }

        const { userId } = session;

        const servicosQuery = query(
          collection(db, "servicos"),
          where("cliente_id", "==", userId)
        );
        const servicosSnapshot = await getDocs(servicosQuery);

        if (servicosSnapshot.empty) {
          console.warn("Nenhum serviço encontrado.");
          toast.info("Nenhum serviço encontrado.");
          setServicos([]); // Define como lista vazia
          return;
        }

        const servicosData = [];
        for (const servicoDoc of servicosSnapshot.docs) {
          const servico = servicoDoc.data();
          const servicoId = servicoDoc.id;

          if (
            !servico.modalidade_servico ||
            !servico.data_realizacao ||
            !servico.status
          ) {
            console.warn(`Documento com ID ${servicoId} está incompleto.`);
            continue;
          }

          // Verificar e parsear a avaliação se existir
          let avaliacao = null;
          if (servico.avaliacao) {
            try {
              avaliacao = JSON.parse(servico.avaliacao);
            } catch (error) {
              console.warn(
                `Erro ao parsear avaliação do serviço ${servicoId}:`,
                error
              );
            }
          }

          const modalidades = ["faxina", "lavanderia", "cozinha", "jardinagem"];
          const detalhes = [];
          for (const modalidade of modalidades) {
            const subcolecaoRef = collection(
              db,
              `servicos/${servicoId}/${modalidade}`
            );
            const subcolecaoSnapshot = await getDocs(subcolecaoRef);
            subcolecaoSnapshot.forEach((doc) => {
              detalhes.push({ modalidade, ...doc.data() });
            });
          }

          servicosData.push({
            id: servicoId,
            ...servico,
            avaliacao, // Adiciona a avaliação já parseada
            detalhes,
          });
        }

        console.log("Serviços carregados:", servicosData); // Depuração
        setServicos(servicosData);
      } catch (error) {
        console.error("Erro ao carregar os serviços:", error);
        toast.error("Erro ao carregar os serviços.");
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    carregarServicos();
  }, []);

  const handleAbrirModalConfirmacao = (id) => {
    setModalAberto(false);
    setServicoParaCancelarId(id); // Define o serviço para cancelamento
    setModalConfirmacaoAberto(true); // Abre o modal de confirmação
  };
  
  
  const handleFecharModalConfirmacao = () => {
    setServicoParaCancelarId(null); // Limpa o ID do serviço para cancelamento
    setModalConfirmacaoAberto(false);
  };
  
  // Função para confirmar o cancelamento do serviço
  const confirmarCancelamento = () => {
    if (detalhesServico) {
      cancelarServico(detalhesServico.id);
      handleFecharModalConfirmacao();
    }
  };


  const handleAbrirModal = async (servico) => {
    console.log("Abrindo modal com serviço:", servico); // Depuração
    setDetalhesServico(servico);

    // Buscar nome do funcionário
    if (servico.funcionario_id) {
      const db = getFirestore();
      const usuariosQuery = query(
        collection(db, "usuarios"),
        where("funcao", "==", "funcionario")
      );
      const usuariosSnapshot = await getDocs(usuariosQuery);

      for (const userDoc of usuariosSnapshot.docs) {
        const funcionariosRef = collection(
          db,
          `usuarios/${userDoc.id}/funcionarios`
        );
        const funcionariosSnapshot = await getDocs(funcionariosRef);

        funcionariosSnapshot.forEach((doc) => {
          if (doc.id === servico.funcionario_id) {
            setFuncionarioNome(doc.data().nome);
          }
        });
      }
    } else {
      setFuncionarioNome("");
    }

    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setDetalhesServico(null);
    setFuncionarioNome("");
  };

  // const cancelarServico = async (id) => {
  //   if (!id) return; // Adiciona uma verificação para evitar erros
  
  //   try {
  //     const db = getFirestore();
  //     const servicoRef = doc(db, "servicos", id);
  //     await updateDoc(servicoRef, { status: "cancelado" });
  //     toast.success("Serviço cancelado com sucesso!");
  //     setServicos((prev) =>
  //       prev.map((s) => (s.id === id ? { ...s, status: "cancelado" } : s))
  //     );
  //     handleFecharModal();
  //   } catch (error) {
  //     console.error("Erro ao cancelar o serviço:", error);
  //     toast.error("Erro ao cancelar o serviço.");
  //   }
  // };

  const cancelarServico = async (id) => {
    if (!id) {
      console.error("ID do serviço não fornecido.");
      return;
    }
  
    try {
      const db = getFirestore();
      const servicoRef = doc(db, "servicos", id);
      await updateDoc(servicoRef, { status: "cancelado" });
      toast.success("Serviço cancelado com sucesso!");
  
      // Atualiza a lista de serviços localmente para refletir a mudança
      setServicos((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "cancelado" } : s))
      );
  
      // Fechar o modal de detalhes após a atualização
      handleFecharModal();
      handleFecharModalConfirmacao();
    } catch (error) {
      console.error("Erro ao cancelar o serviço:", error);
      toast.error("Erro ao cancelar o serviço.");
    }
  };
  
  

  const formatarCamposDetalhes = (modalidade, detalhes) => {
    const camposPorModalidade = {
      faxina: {
        qtd_comodos: "Quantidade de cômodos",
        tipo_faxina: "Tipo de Faxina",
        local_servico: "Local de realização do serviço",
        duracao_faxina: "Duração da faxina",
        produtos_fornecidos: "Produtos fornecidos pela empresa?",
      },
      cozinha: {
        dia_semana: "Dia da Semana",
        local_servico: "Local do Serviço",
        qtd_refeicoes: "Quantidade de Refeições",
        preferencia_alimentar: "Preferência Alimentar",
        qtd_pessoas_atendidas: "Quantidade de Pessoas Atendidas",
      },
      jardinagem: {
        area_verde: "Área Verde (em metros)",
        tipo_local: "Tipo de Local",
        tipo_servico: "Tipo de Serviço",
      },
      lavanderia: {
        preferencias_lavagem: "Preferência de Lavagem",
        produtos_fornecidos: "Produtos fornecidos pela empresa?",
        qtd_pecas: "Quantidade de Peças",
        tipo_roupas: "Tipo de Roupas",
        tipo_servico: "Tipo de Serviço",
        tipo_tecidos: "Tipos de Tecidos",
      },
    };

    const mapeamento = camposPorModalidade[modalidade] || {};
    return Object.entries(detalhes).map(([chave, valor]) => {
      const nomeCampo =
        mapeamento[chave] || chave.charAt(0).toUpperCase() + chave.slice(1);
      const valorFormatado =
        typeof valor === "boolean" ? (valor ? "Sim" : "Não") : valor;
      return { nomeCampo, valorFormatado };
    });
  };

  const handleAbrirAvaliacaoModal = () => {
    handleFecharModal(); // Fecha o modal de informações
    setAvaliacaoModalAberto(true); // Abre o modal de avaliação
  };
  
  const handleFecharAvaliacaoModal = () => {
    setAvaliacaoModalAberto(false);
    setAvaliacaoServico({ qualidade: 0, profissionalismo: 0, comentario: "" });
  };

  const handleSalvarAvaliacao = async () => {
    if (!detalhesServico) return;

    const db = getFirestore();
    const servicoRef = doc(db, "servicos", detalhesServico.id);

    const novaAvaliacao = {
      qualidade: avaliacaoServico.qualidade,
      profissionalismo: avaliacaoServico.profissionalismo,
      comentario: avaliacaoServico.comentario,
      data: new Date().toISOString(),
    };

    try {
      await updateDoc(servicoRef, { avaliacao: JSON.stringify(novaAvaliacao) });
      toast.success("Avaliação salva com sucesso!");

      setServicos((prev) =>
        prev.map((servico) =>
          servico.id === detalhesServico.id
            ? { ...servico, avaliacao: novaAvaliacao }
            : servico
        )
      );

      handleFecharAvaliacaoModal();
      handleFecharModal();
    } catch (error) {
      toast.error("Erro ao salvar a avaliação.");
      console.error("Erro ao salvar avaliação:", error);
    }
  };

  return (
    <div className="lista-servicos-cliente-container">
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
                <Nav.Link href="/home-cliente" className="">
                  Início
                </Nav.Link>
                <Nav.Link href="#" className="active">
                  Serviços
                </Nav.Link>
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

      <div className="lista-servicos-cliente-main-content">
        <div className="lsc-header">
          <h2 className="lsc-header-txt">Suas solicitações</h2>
        </div>
        <br />
        <div className="lsc-content">
          {loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                textAlign: "center",
                margin: "20px 0",
              }}
            >
              <BeatLoader color="#4f1d64" size={30} />
              <p
                style={{
                  fontSize: "26px",
                  fontWeight: "600",
                  marginTop: "10px",
                }}
              >
                Carregando dados, aguarde por favor!
              </p>
            </div>
          ) : (
            <>
              {servicos.length === 0 ? (
                <div style={{ textAlign: "center", margin: "20px 0" }}>
                  <Typography variant="h4">
                    Não há nenhum serviço para exibir :(
                  </Typography>
                </div>
              ) : (
                <>
                  <Tabs
                    value={categoriaAtual}
                    onChange={(event, newValue) => {
                      setCategoriaAtual(newValue);
                      setPaginaAtual(1); // Reinicia para a primeira página ao mudar de categoria
                    }}
                    aria-label="Categorias de serviços"
                    className="lsc-abas-servicos"
                  >
                    {categorias.map((categoria, index) => (
                      <Tab label={categoria} key={index} />
                    ))}
                  </Tabs>

                  {servicos
                    .filter((servico) => {
                      const statusServico = servico.status
                        ? servico.status.toLowerCase()
                        : "";
                      const abaAtual = categorias[categoriaAtual].toLowerCase();
                      return statusServico === abaAtual;
                    })
                    .slice(
                      (paginaAtual - 1) * CARDS_POR_PAGINA,
                      paginaAtual * CARDS_POR_PAGINA
                    ) // Paginando os cards
                    .map((servico, index) => (
                      <Card
                        key={index}
                        sx={{
                          width: "100%",
                          cursor: "pointer",
                        }}
                        className="lsc-card"
                        onClick={() => handleAbrirModal(servico)}
                      >
                        <CardContent>
                          <Typography
                            variant="h6"
                            component="div"
                            className="lsc-card-title"
                          >
                            Serviço:{" "}
                            {servico.modalidade_servico
                              ? servico.modalidade_servico
                                  .charAt(0)
                                  .toUpperCase() +
                                servico.modalidade_servico.slice(1)
                              : "Desconhecido"}
                          </Typography>
                          <Typography variant="body2" className="lsc-card-data">
                            Data:{" "}
                            {servico.data_realizacao
                              ? new Date(
                                  servico.data_realizacao.seconds * 1000
                                ).toLocaleDateString()
                              : "Não disponível"}
                          </Typography>
                          <Typography variant="body2" className="lsc-valor">
                            Valor: R$ {servico.valor || "Não informado"}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}

                  <Pagination
                    count={Math.ceil(servicos.length / CARDS_POR_PAGINA)} // Calcula o número de páginas
                    page={paginaAtual}
                    onChange={(event, value) => setPaginaAtual(value)}
                    color="primary"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 2,
                    }}
                  />
                </>
              )}
            </>
          )}
        </div>
        {detalhesServico && (
          <Modal show={modalAberto} onHide={handleFecharModal} centered>
            <Modal.Header closeButton>
              <Modal.Title className="lsc-modal-title">
                Detalhes do Serviço
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="lsc-modal-body">
              <p>Modalidade: {detalhesServico.modalidade_servico}</p>
              <p>
                Data:{" "}
                {new Date(
                  detalhesServico.data_realizacao.seconds * 1000
                ).toLocaleDateString()}
              </p>
              <p>Valor: R$ {detalhesServico.valor}</p>
              <p>Observações: {detalhesServico.observacoes}</p>
              <p>Funcionário: {funcionarioNome || "Não atribuído"}</p>
              {detalhesServico.detalhes.map((detalhe, idx) => (
                <div key={idx}>
                  <strong
                    style={{
                      color: "var(--corPrincipal)",
                      marginBottom: "20px",
                      fontSize: "20px",
                      fontWeight: "600",
                    }}
                  >
                    {detalhe.modalidade.charAt(0).toUpperCase() +
                      detalhe.modalidade.slice(1)}
                  </strong>
                  {formatarCamposDetalhes(detalhe.modalidade, detalhe).map(
                    ({ nomeCampo, valorFormatado }, index) => (
                      <p key={index}>
                        {nomeCampo}: {valorFormatado}
                      </p>
                    )
                  )}
                </div>
              ))}

              {detalhesServico.avaliacao && (
                <div style={{ marginTop: "10px" }}>
                  <h5
                    style={{
                      color: "var(--corPrincipal)",
                      marginBottom: "20px",
                      fontSize: "22px",
                      fontWeight: "700",
                    }}
                  >
                    Avaliação
                  </h5>
                  <p>
                    <strong>Qualidade:</strong>{" "}
                    {detalhesServico.avaliacao.qualidade || "Não avaliado"}{" "}
                    estrelas
                  </p>
                  <p>
                    <strong>Profissionalismo:</strong>{" "}
                    {detalhesServico.avaliacao.profissionalismo ||
                      "Não avaliado"}{" "}
                    estrelas
                  </p>
                  <p>
                    <strong>Comentário:</strong>{" "}
                    {detalhesServico.avaliacao.comentario ||
                      "Nenhum comentário."}
                  </p>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              {detalhesServico.status === "pendente" && (
                <Button
                variant="danger"
                onClick={() => handleAbrirModalConfirmacao(detalhesServico.id)}
                className="lsc-modal-button"
              >
                Cancelar Serviço
              </Button>
              
              )}

              {detalhesServico.status === "finalizado" &&
                !detalhesServico.avaliacao && (
                  <Button
                    variant="primary"
                    className="lsc-modal-button"
                    onClick={handleAbrirAvaliacaoModal}
                  >
                    Avaliar Serviço
                  </Button>
                )}

              <Button
                variant="secondary"
                className="lsc-modal-button"
                onClick={handleFecharModal}
              >
                Fechar
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        <Modal
          show={avaliacaoModalAberto}
          onHide={handleFecharAvaliacaoModal}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="lsc-modal-title">Avaliar Serviço</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>Como você classificaria...</h6>
            <h5>Qualidade do Serviço</h5>
            <ReactStars
              count={5}
              onChange={(newRating) =>
                setAvaliacaoServico((prev) => ({
                  ...prev,
                  qualidade: newRating,
                }))
              }
              size={40}
              activeColor="#ffd700"
            />
            <h5
            style={{
              marginTop: "10px",
              marginBottom: "5px"
            }}>Profissionalismo do(a) Prestador(a) de Serviço</h5>
            <ReactStars
              count={5}
              onChange={(newRating) =>
                setAvaliacaoServico((prev) => ({
                  ...prev,
                  profissionalismo: newRating,
                }))
              }
              size={40}
              activeColor="#ffd700"
            />
            <textarea
              placeholder="Deixe um comentário (opcional)"
              value={avaliacaoServico.comentario}
              onChange={(e) =>
                setAvaliacaoServico((prev) => ({
                  ...prev,
                  comentario: e.target.value,
                }))
              }
              style={{ 
                width: "100%", 
                marginTop: "10px",
                borderRadius: "10px",
                padding: "10px",
                fontSize: "16px",
                height: "100px"
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleSalvarAvaliacao} className="lsc-modal-button">
              Salvar Avaliação
            </Button>
            <Button variant="secondary" onClick={handleFecharAvaliacaoModal} className="lsc-modal-button">
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={modalConfirmacaoAberto} onHide={handleFecharModalConfirmacao} centered>
          <Modal.Header closeButton style={{border: "none"}}>
            <Modal.Title className="lsc-modal-title">Confirmação</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span
            style={{fontSize: "18px"}}
            >Tem certeza que deseja cancelar esse serviço? Essa ação é irreversível!</span>
          </Modal.Body>
          <Modal.Footer style={{
            width: "100%", 
            display: "flex", 
            flexDirection: "row",
            border: "none",
            alignItems: "center",
            justifyContent: "space-between"
            }}>
            <Button variant="secondary" onClick={handleFecharModalConfirmacao}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "gray",
                color: "#ffff",
                borderRadius: "5px"
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (servicoParaCancelarId) {
                  cancelarServico(servicoParaCancelarId); // Usa o ID armazenado
                } else {
                  console.error("ID do serviço para cancelamento não está disponível.");
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "red",
                color: "#ffff",
                borderRadius: "5px",
              }}
            >
              Sim
            </Button>



          </Modal.Footer>
        </Modal>

      </div>
    </div>
  );
}

export default ListaServicosCliente;
