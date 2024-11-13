// Chatbot.js
import React from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import '../../css/globalVar.css';

const Chatbot = () => {
  const theme = {
    background: 'var(--corBg)',
    fontFamily: 'Helvetica Neue',
    headerBgColor: 'var(--corPrincipal)',
    headerFontColor: '#fff',
    headerFontSize: '16px',
    botBubbleColor: 'var(--corHover)',
    botFontColor: '#fff',
    userBubbleColor: '#fff',
    userFontColor: '#4a4a4a',
  };

  const steps = [
    {
      id: '1',
      message: 'Olá! Qual seu nome?',
      trigger: 'name',
    },
    {
      id: 'name',
      user: true,
      trigger: 'welcome',
    },
    {
      id: 'welcome',
      message: 'Bem-vindo(a), {previousValue}! ✨ Com que posso te ajudar?',
      trigger: 'options',
    },
    {
      id: 'options',
      options: [
        { value: 'funcionamento', label: 'Como a WeClean funciona?', trigger: 'funcionamento' },
        { value: 'precos', label: 'Quais são os preços?', trigger: 'precos' },
        { value: 'contratar', label: 'Como contratar a WeClean para a minha empresa?', trigger: 'contratar' },
      ],
    },
    {
      id: 'funcionamento',
      message: 'A WeClean funciona de maneira simples e eficaz! Conte-me mais sobre sua necessidade.',
      end: true,
    },
    {
      id: 'precos',
      message: 'Nossos preços variam conforme o serviço. Gostaria de uma estimativa para seu caso?',
      end: true,
    },
    {
      id: 'contratar',
      message: 'Para contratar, entre em contato conosco e faremos uma proposta personalizada!',
      end: true,
    },
  ];

  return (
    <div style={chatbotContainerStyle}>
      <ThemeProvider theme={theme}>
        <ChatBot
          steps={steps}
          floating={true}
          style={{
            fontSize: '16px',
            width: window.innerWidth > 1900 ? '500px' : '420px',  // Responsividade para telas maiores que 1900px
            width: window.innerWidth < 1024 ? '90%' : '420px',
        }}
          headerTitle="Assistente Virtual"
        />
      </ThemeProvider>
    </div>
  );
};

// Estilo para a posição do chatbot no canto inferior direito
const chatbotContainerStyle = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  zIndex: 1000,
};

export default Chatbot;
