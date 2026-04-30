export class Categoria {
    constructor({ id_categoria = null, nome, descricao = '' }) {
        this.id_categoria = id_categoria ?? crypto.randomUUID();
        this.nome = nome;
        this.descricao = descricao;
    }
}

export class Curso {
    constructor({ id_curso = null, titulo, descricao = '', id_categoria, nivel = 'Básico', totalHoras, id_instrutor, totalAulas = 0 }) {
        this.id_curso = id_curso ?? crypto.randomUUID();
        this.titulo = titulo;
        this.descricao = descricao;
        this.id_categoria = id_categoria;
        this.nivel = nivel; 
        this.totalHoras = parseInt(totalHoras) || 0;
        this.id_instrutor = id_instrutor;
        this.totalAulas = parseInt(totalAulas) || 0;
        this.dataCriacao = new Date().toISOString();
    }
}

export class Usuario {
    constructor({ id_usuario = null, nomeCompleto, email, senhaHash, tipo = 'Aluno' }) {
        this.id_usuario = id_usuario ?? crypto.randomUUID();
        this.nomeCompleto = nomeCompleto;
        this.email = email;
        this.senhaHash = senhaHash;
        this.tipo = tipo;
        this.dataCadastro = new Date().toISOString();
    }
}