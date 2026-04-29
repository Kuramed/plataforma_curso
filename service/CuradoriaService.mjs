import { Trilha, TrilhaCurso, Certificado } from '../model/Curadoria.mjs';

export class CuradoriaService {
    listar(tabela) {
        return JSON.parse(localStorage.getItem(tabela) ?? '[]');
    }

    salvar(tabela, dados, ClasseModelo) {
        const lista = this.listar(tabela);
        const novoItem = new ClasseModelo(dados);
        lista.push(novoItem);
        localStorage.setItem(tabela, JSON.stringify(lista));
        return novoItem;
    }

    atualizar(tabela, id, dados, idCampo) {
        const lista = this.listar(tabela);
        const index = lista.findIndex(item => item[idCampo] === id);
        if (index === -1) throw new Error('Registro não encontrado.');

        lista[index] = { ...lista[index], ...dados, [idCampo]: id };
        localStorage.setItem(tabela, JSON.stringify(lista));
        return lista[index];
    }

    excluir(tabela, id, idCampo) {
        const lista = this.listar(tabela).filter(item => item[idCampo] !== id);
        localStorage.setItem(tabela, JSON.stringify(lista));
    }
}