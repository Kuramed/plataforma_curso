export class Categoria {
    constructor(dados) {
        this.id_categoria = dados.id_categoria || crypto.randomUUID();
        this.titulo = dados.titulo || '';
        this.descricao = dados.descricao || '';
    }
}

export class Curso {
    constructor(dados) {
        this.id_curso = dados.id_curso || crypto.randomUUID();
        this.titulo = dados.titulo || '';
        this.descricao = dados.descricao || '';
        this.id_categoria = dados.id_categoria || '';
        this.nivel = dados.nivel || '';
        this.totalHoras = parseInt(dados.totalHoras) || 0;
    }
}

export class Modulo {
    constructor(dados) {
        this.id_modulo = dados.id_modulo || crypto.randomUUID();
        this.id_curso = dados.id_curso || '';
        this.titulo = dados.titulo || '';
    }
}

export class Aula {
    constructor(dados) {
        this.id_aula = dados.id_aula || crypto.randomUUID();
        this.id_modulo = dados.id_modulo || '';
        this.titulo = dados.titulo || '';
        this.descricao = dados.descricao || '';
    }
}

export class Trilha {
    constructor(dados) {
        this.id_trilha = dados.id_trilha || crypto.randomUUID();
        this.titulo = dados.titulo || '';
        this.descricao = dados.descricao || '';
        this.id_categoria = dados.id_categoria || '';
    }
}