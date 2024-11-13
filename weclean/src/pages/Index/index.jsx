import React from "react";
import { Navbar, Nav, Offcanvas, Container, Button } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  EffectFade,
  EffectCoverflow,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/effect-coverflow";
import "./index.css";
import logoWeclean from "../../assets/images/logo-weclean.png";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chatbot from "../../components/ChatBot/chatbot";


// Importando imagens do slider
import slide1 from "../../assets/images/slide1.jpg";
import slide2 from "../../assets/images/slide2.jpg";
import slide3 from "../../assets/images/slide3.jpg";
import slide4 from "../../assets/images/slide4.jpg";
import slide5 from "../../assets/images/slide5.jpg";

//Importando ícones dos cards
import iconCardLavadeira from '../../assets/images/lavadeira-card-icon.svg';
import iconCardFaxineira from '../../assets/images/faxineira-card-icon.svg';
import iconCardPassadeira from '../../assets/images/passadeira-card-icon.svg';
import iconCardCozinheira from '../../assets/images/cozinheira-card-icon.svg';
import iconCardJardinagem from '../../assets/images/jardinagem-card-icon.png';
//Função para exibir mensagem de sucesso na solicitação de entrevista
const handleSubmit = (event) => {
  event.preventDefault();

  // Exibe notificação de sucesso
  toast.success("Solicitação enviada com sucesso! Entraremos em contato com você em breve.");

  // Limpa os campos do form
  event.target.reset();
};

function Index() {
  return (

    <div className="index-page-container">
    <ToastContainer />
    <Chatbot />
      <div className="vh-100">
        {/* Navbar */}
        <Navbar bg="white" expand="lg" fixed="top" className="shadow-sm">
          <Container>
            <Navbar.Brand href="#bannerHeader" className="fs-4 logo">
              <span>
                <img
                  src={logoWeclean}
                  alt="Logo img"
                  className="logo-weclean"
                />
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
                  <Nav.Link href="#servicos-section">Serviços</Nav.Link>
                  <Nav.Link href="#trabalhe-conosco-section">Trabalhe Conosco</Nav.Link>
                  <Nav.Link href="#contato-section">Contate-nos</Nav.Link>
                </Nav>
                <div className="d-flex flex-column justify-content-center flex-lg-row align-items-center gap-2">
                  <Link to='/login' className="btn-login-link text-decoration-none">
                    Fazer login
                  </Link>
                  <Link to='/cadastro' className="btn-cadastro-link text-decoration-none">
                    Cadastre-se
                  </Link>
                </div>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>

        {/* Banner com Slider */}
        <div className="banner-header" id="bannerHeader">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]} 
            spaceBetween={0}
            slidesPerView={1}
            className="swiper-content"
            autoplay={{ delay: 10000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={true}
            speed={500}
            effect="fade" 
            fadeEffect={{ crossFade: true }} 
          >
            <SwiperSlide>
              <img src={slide1} alt="Slide 1" className="slide-image" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={slide2} alt="Slide 2" className="slide-image" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={slide3} alt="Slide 3" className="slide-image" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={slide4} alt="Slide 4" className="slide-image" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={slide5} alt="Slide 5" className="slide-image" />
            </SwiperSlide>
          </Swiper>
          <div className="banner-header-text-container">
            <h1 className="banner-header-title">
              Agende já a faxina de sua casa conosco!
            </h1>
            <p>
              Os profissionais mais capacitados estão a alguns cliques de você.
            </p>
          </div>
        </div>

        {/* Serviços Section */}
        <section className="container-servicos" id="servicos-section">
          <div className="container-servicos-title">
            <h2>SERVIÇOS</h2>
          </div>
          <br />
          <div className="panel-cards-servicos">
            <div className="lavadeira-card card-servicos">
                <div className="card-servicos-icon-div">
                  <img src={iconCardLavadeira} alt="ìcone" className="lavadeira-card-icon" />
                </div>
                <div className="card-servicos-main-content">
                  <h3>LAVANDERIA</h3>
                  <p>Oferecemos serviços de lavanderia por meio de profissionais qualificados.</p>
                </div>
            </div>
            <div className="passadeira-card card-servicos">
              <div className="card-servicos-icon-div">
                  <img src={iconCardFaxineira} alt="icone" className="card-servicos-icon passadeira-card-icon" />
              </div>
                <div className="card-servicos-main-content">
                <h3>FAXINA GERAL</h3>
                <p>Também fornecemos serviços de limpeza geral para sua casa ou empresa.</p>
                </div>
            </div>
            <div className="faxineira-card card-servicos">
              <div className="card-servicos-icon-div">
                  <img src={iconCardCozinheira} alt="icone" className="card-servicos-icon faxineira-card-icon" />
              </div>
              <div className="card-servicos-main-content">
                <h3>COZINHEIRO</h3>
                <p>Através da WeClean, você pode contratar cozinheiros de qualidade para sua casa ou estabelecimento.</p>
              </div>
            </div>
            <div className="cozinheira-card card-servicos">
              <div className="card-servicos-icon-div">
                  <img src={iconCardJardinagem} alt="icone" className="card-servicos-icon" />
              </div>
              <div className="card-servicos-main-content">
                <h3>JARDINAGEM</h3>
                <p>Mantenha seu jardim bonito e bem cuidado com a WeClean!</p>
              </div>
            </div>
          </div>
          <br />
          <h2 className="servicos-text">Aproveite já para deixar sua casa ou estabelecimento nos trinques!  <Link className="servicos-text-link" to="/cadastro">Crie uma conta!</Link></h2>
        </section>
        <section className="trabalhe-conosco-container" id="trabalhe-conosco-section">
            <div className="left-tc">
              <h2>TRABALHE CONOSCO</h2>
              <p>
                Interessado em trabalhar na área de prestação de serviços domésticos? Junte-se a WeClean!
              </p>
            </div>
            <div className="right-tc">
              <h5>Solicite uma entrevista e entraremos em contato com você!</h5>
              <form action="" onSubmit={handleSubmit} className="trabalhe-conosco-form">
              <input type="text" name="candidatoNome" id="candidatoNome" className="tc-input" placeholder="Insira seu nome completo"/>
              <input type="email" name="candidatoEmail" id="candidatoEmail" className="tc-input" placeholder="Insira seu email"/>
              <input type="text" name="candidatoCidade" id="candidatoCidade" className="tc-input" placeholder="Informe o estado onde você mora"/> {/*Substituir por select futuramente com os nomes dos estados */}
              <select name="candidatoCategoria" id="candidatoCategoria" className="tc-select" placeholder="Área de interesse">
                <option value="faxineira">Faxina geral</option>
                <option value="lavadeira">Lavagem de roupas</option>
                <option value="passadora">Secagem de roupas</option>
                <option value="cozinheira">Cozinheiro(a)</option>
                <option value="">Qualquer uma das anteriores</option>
              </select>
              <div className="btn-group-tc">
                <button type="submit" id="salvarCandidato" className="btn-tc">
                  Enviar solicitação
                </button>
              </div>
              </form>
            </div>
        </section>
        <section className="contato-container" id="contato-section">
          <div className="left-contato-content">
            <h2>WeClean</h2>
            <h5>Contate-nos</h5>
          </div>
          <div className="right-contato-content">
            <span><i className="bi bi-envelope"></i> wecleansupport@gmail.com</span>
            <span><i className="bi bi-whatsapp"></i> (12)00000-0000</span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Index;
