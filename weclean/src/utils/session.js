
// Salva a sessão do usuário no localStorage
export const saveUserSession = (userId) => {
    localStorage.setItem('userSession', JSON.stringify({ userId }));
  };
  
  // Puxa os dados da sessão do usuário do localStorage
  export const getUserSession = () => {
    const sessionData = localStorage.getItem('userSession');
    return sessionData ? JSON.parse(sessionData) : null;
  };
  
  // Limpa a sessão do usuário no localStorage
  export const clearUserSession = () => {
    localStorage.removeItem('userSession');
  };
  