export class Matricula {
    constructor({ id_matricula = null, id_usuario, id_curso }) {
        this.id_matricula = id_matricula ?? crypto.randomUUID();
        this.id_usuario = id_usuario;
        this.id_curso = id_curso;
        this.dataMatricula = new Date().toISOString();
        this.status = 'Ativa';
    }
    static validar(dados) { return []; }
}

export class ProgressoAula {
    constructor({ id_progresso = null, id_usuario, id_aula, status }) {
        this.id_progresso = id_progresso ?? crypto.randomUUID();
        this.id_usuario = id_usuario;
        this.id_aula = id_aula;
        this.status = status;
        this.dataConclusao = new Date().toISOString();
    }
    static validar(dados) { return []; }
}

export class Avaliacao {
    constructor({ id_avaliacao = null, id_usuario, id_curso, nota, comentario = '', dataAvaliacao = null }) {
        this.id_avaliacao = id_avaliacao ?? crypto.randomUUID();
        this.id_usuario = id_usuario;
        this.id_curso = id_curso;
        this.nota = parseInt(nota);
        this.comentario = comentario;
        this.dataAvaliacao = dataAvaliacao ?? new Date().toISOString();
    }
    static validar(dados) { return []; }
}