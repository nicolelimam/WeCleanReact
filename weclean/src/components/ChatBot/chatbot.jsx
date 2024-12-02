// src/components/Chatbot/chatbot.jsx
import React, { useState } from 'react';
import './chatbot.css';
import { MdChatBubble } from "react-icons/md";

const Chatbot = ({ userType }) => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const addMessage = (message, sender) => {
    setMessages((prev) => [...prev, { text: message, sender }]);
  };

  const handleOptionClick = (option) => {
    addMessage(option, 'user');
    let botMessage = '';

    const responses = {
      index: {
        'Como a empresa funciona': 'A WeClean é especializada em serviços domésticos como faxina, jardinagem e lavanderia.',
        'Quais os serviços disponíveis': 'Oferecemos faxina, jardinagem, lavanderia, cozinha e mais. Confira no site!',
        'Deseja fazer parte da equipe': 'Visite "Trabalhe Conosco" no site e envie sua candidatura.',
      },
      funcionario: {
        'Como funciona o cancelamento de um serviço': 'Acesse "Cancelamentos" na área de funcionário para mais detalhes.',
        'Como entrar em contato com o escritório': 'Ligue para (99) 99999-9999, disponível de segunda a sexta.',
        'Enviar mensagem ao atendimento WeClean': 'Por favor, digite sua mensagem abaixo:',
      },
      cliente: {
        'Como funciona a solicitação de serviço': 'Acesse sua conta, clique em "Solicitar Serviço" e preencha os detalhes.',
        'Como funciona o cancelamento de serviço e forma de reembolso': 'Cancele até 24h antes. Reembolso em até 7 dias úteis.',
        'Enviar mensagem ao atendimento WeClean': 'Por favor, digite sua mensagem abaixo:',
      },
    };

    botMessage = responses[userType]?.[option] || 'Desculpe, não entendi sua solicitação.';
    if (option === 'Enviar mensagem ao atendimento WeClean') setIsSendingMessage(true);
    addMessage(botMessage, 'bot');
  };

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    addMessage(userMessage, 'user');
    addMessage('Sua mensagem foi enviada com sucesso. Agradecemos pelo contato!', 'bot');
    setUserMessage('');
    setIsSendingMessage(false);
  };

  const getInitialMessage = () => ({
    index: 'Bem-vindo ao WeClean! Como posso ajudar?',
    funcionario: 'Olá, funcionário! Como podemos ajudar?',
    cliente: 'Olá, cliente! Como podemos ajudar?',
  })[userType];

  const getOptions = () => ({
    index: ['Como a empresa funciona', 'Quais os serviços disponíveis', 'Deseja fazer parte da equipe'],
    funcionario: ['Como funciona o cancelamento de um serviço', 'Como entrar em contato com o escritório', 'Enviar mensagem ao atendimento WeClean'],
    cliente: ['Como funciona a solicitação de serviço', 'Como funciona o cancelamento de serviço e forma de reembolso', 'Enviar mensagem ao atendimento WeClean'],
  })[userType];

  const toggleChat = () => {
    if (!isOpen) setMessages([{ text: getInitialMessage(), sender: 'bot' }]);
    setIsOpen(!isOpen);
  };

  return (
    <>
        <button style={{color: "#ffff"}} className="chat-toggle-btn fixed-button" onClick={toggleChat}>
        {isOpen ? '✖' : <MdChatBubble />}
        </button>
      {isOpen && (
        <div className="chat-container border rounded p-3">
          <div className="chat-header">
            <h4>Chatbot</h4>
            <button className="close-btn" onClick={toggleChat}>✖</button>
          </div>
          <div className="chat-box">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-options">
            {getOptions()?.map((option, i) => (
              <button key={i} className="btn btn-outline-primary m-1" onClick={() => handleOptionClick(option)}>{option}</button>
            ))}
          </div>
          {isSendingMessage && (
            <div className="message-input">
              <textarea className="form-control mb-2" rows="3" value={userMessage} onChange={(e) => setUserMessage(e.target.value)} placeholder="Digite sua mensagem..." />
              <button className="btn btn-primary" onClick={handleSendMessage}>Enviar</button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
