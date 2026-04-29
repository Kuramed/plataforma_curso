import { Usuario, Categoria, Curso } from '../model/Core.mjs';

export class CoreService {
    listar(tabela) {
        const dados = localStorage.getItem(tabela);
        return dados ? JSON.parse(dados) : []; 
    }

    buscarPorId(tabela, id, idCampo) {
        return this.listar(tabela).find(item => item[idCampo] === id) ?? null; 
    }

    salvar(tabela, dados, ClasseModelo) {
        const erros = ClasseModelo.validar ? ClasseModelo.validar(dados) : []; 
        if (erros.length) throw new Error(erros.join(' | ')); 

        const lista = this.listar(tabela); 
        const novoItem = new ClasseModelo(dados); 
        lista.push(novoItem); 
        localStorage.setItem(tabela, JSON.stringify(lista)); 
        return novoItem; 
    }

    atualizar(tabela, id, dados, ClasseModelo, idCampo) {
        const erros = ClasseModelo.validar ? ClasseModelo.validar(dados) : []; 
        if (erros.length) throw new Error(erros.join(' | ')); 

        const lista = this.listar(tabela); 
        const index = lista.findIndex(item => item[idCampo] === id);
        if (index === -1) throw new Error('Registro não encontrado.');

        // Atualiza os dados mantendo o ID original
        lista[index] = { ...lista[index], ...dados, [idCampo]: id }; 
        localStorage.setItem(tabela, JSON.stringify(lista)); 
        return lista[index];
    }

    excluir(tabela, id, idCampo) {
        let lista = this.listar(tabela);
        lista = lista.filter(item => item[idCampo] !== id);
        localStorage.setItem(tabela, JSON.stringify(lista)); 
    }
}