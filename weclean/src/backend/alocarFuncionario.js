import { collection, query, where, getDocs, getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const alocarFuncionario = async (servicoId, clienteId, modalidadeServico, cidadeCliente) => {
  try {
    // Normalizar cidade
    const cidadeClienteNormalized = cidadeCliente.trim().toLowerCase();
    const semanaAtual = new Date().toLocaleDateString("pt-BR");

    // Obter funcionários
    const usuariosRef = collection(db, "usuarios");
    const funcionariosQuery = query(
      usuariosRef,
      where("funcao", "==", "funcionario")
    );
    const funcionariosSnapshot = await getDocs(funcionariosQuery);

    for (const usuarioDoc of funcionariosSnapshot.docs) {
      const funcionarioId = usuarioDoc.id;

      const funcionarioDocRef = doc(db, `usuarios/${funcionarioId}/funcionarios/${funcionarioId}`);
      const funcionarioDoc = await getDoc(funcionarioDocRef);

      if (funcionarioDoc.exists()) {
        const funcData = funcionarioDoc.data();
        const cidadeFuncionarioNormalized = funcData.endereco.cidade.trim().toLowerCase();

        if (
          funcData.tipo_de_servico === modalidadeServico &&
          cidadeFuncionarioNormalized === cidadeClienteNormalized
        ) {
          // Verificar ou inicializar contador semanal
          const compromissosSemana = funcData.compromissos_semana || 0;
          const semana = funcData.semana || semanaAtual;

          if (semana !== semanaAtual) {
            // Reinicia o contador se for uma nova semana
            await updateDoc(funcionarioDocRef, { compromissos_semana: 0, semana: semanaAtual });
          }

          if (compromissosSemana < 7) {
            // Alocar o funcionário
            await updateDoc(funcionarioDocRef, {
              compromissos_semana: compromissosSemana + 1,
            });

            const servicoRef = doc(db, "servicos", servicoId);
            await updateDoc(servicoRef, {
              funcionario_id: funcionarioId,
              status: "Alocado",
            });

            console.log(`Funcionário ${funcData.nome} alocado para o serviço ${servicoId}.`);
            return funcionarioId;
          }
        }
      }
    }

    throw new Error("Nenhum funcionário disponível.");
  } catch (error) {
    console.error("Erro ao alocar funcionário:", error);
    throw error;
  }
};

export { alocarFuncionario };
