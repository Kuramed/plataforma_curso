export class Usuario {
    constructor({ id = null, nomeCompleto, email, senhaHash }) {
        this.id_usuario = id ?? crypto.randomUUID(); 
        this.nomeCompleto = nomeCompleto; 
        this.email = email; 
        this.senhaHash = senhaHash; 
        this.dataCadastro = new Date().toISOString(); 
    }

    static validar(dados) {
        const erros = [];
        if (!dados.nomeCompleto?.trim()) erros.push('Nome Completo é obrigatório');
        if (!dados.email?.trim()) erros.push('E-mail é obrigatório');
        return erros;
    }
}

export class Categoria {
    constructor({ id = null, nome, descricao }) {
        this.id_categoria = id ?? crypto.randomUUID(); 
        this.nome = nome; 
        this.descricao = descricao; 
    }

    static validar(dados) {
        if (!dados.nome?.trim()) return ['Nome da Categoria é obrigatório'];
        return [];
    }
}

export class Curso {
    constructor({ id = null, titulo, descricao, id_instrutor, id_categoria, nivel, totalAulas, totalHoras }) {
        this.id_curso = id ?? crypto.randomUUID(); 
        this.titulo = titulo; 
        this.descricao = descricao; 
        this.id_instrutor = id_instrutor; 
        this.id_categoria = id_categoria; 
        this.nivel = nivel; 
        this.dataPublicacao = new Date().toISOString(); 
        this.totalAulas = totalAulas || 0; 
        this.totalHoras = totalHoras || 0; 
    }
}