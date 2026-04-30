export class CoreService {
    listar(tabela) {
        try {
            const dados = localStorage.getItem(tabela);
            const parsed = dados ? JSON.parse(dados) : []; 
            // Garante que devolve sempre um Array, mesmo que o dado esteja corrompido
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return []; 
        }
    }

    buscarPorId(tabela, id, idCampo) {
        return this.listar(tabela).find(item => item[idCampo] === id) ?? null; 
    }

    salvar(tabela, dados, ClasseModelo) {
        const erros = ClasseModelo.validar ? ClasseModelo.validar(dados) : []; 
        if (erros.length) throw new Error(erros.join(' | ')); 

        const lista = this.listar(tabela); 
        
        const idCampo = Object.keys(dados).find(key => key.startsWith('id_'));
        const idValor = idCampo ? dados[idCampo] : null;

        const ehEdicao = idValor && idValor.trim() !== "";

        let index = -1;
        if (ehEdicao) {
            index = lista.findIndex(item => item[idCampo] === idValor);
        }

        if (index !== -1) {
            lista[index] = { ...lista[index], ...dados };
        } else {
            if (idCampo && (!dados[idCampo] || dados[idCampo].trim() === "")) {
                delete dados[idCampo];
            }
            if (ClasseModelo === Object) {
                lista.push(dados);
            } else {
                lista.push(new ClasseModelo(dados));
            }
        }

        localStorage.setItem(tabela, JSON.stringify(lista)); 
    }

    atualizar(tabela, id, dados, ClasseModelo, idCampo) {
        const lista = this.listar(tabela); 
        const index = lista.findIndex(item => item[idCampo] === id);
        if (index !== -1) {
            lista[index] = { ...lista[index], ...dados, [idCampo]: id }; 
            localStorage.setItem(tabela, JSON.stringify(lista)); 
        }
    }

    excluir(tabela, id, idCampo) {
        let lista = this.listar(tabela);
        lista = lista.filter(item => item[idCampo] !== id);
        localStorage.setItem(tabela, JSON.stringify(lista)); 
    }
}