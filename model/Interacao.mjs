export class Matricula {
    constructor({ id = null, id_usuario, id_curso }) {
        this.id_matricula = id ?? crypto.randomUUID(); 
        this.id_usuario = id_usuario; 
        this.id_curso = id_curso; 
        this.dataMatricula = new Date().toISOString(); 
        this.dataConclusao = null; 
    }
}

export class ProgressoAula {
    constructor({ id_usuario, id_aula, status }) {
        this.id_usuario = id_usuario; 
        this.id_aula = id_aula; 
        this.status = status; 
        this.dataConclusao = status === 'Concluído' ? new Date().toISOString() : null; 
    }
}

export class Avaliacao {
    constructor({ id = null, id_usuario, id_curso, nota, comentario }) {
        this.id_avaliacao = id ?? crypto.randomUUID(); 
        this.id_usuario = id_usuario; 
        this.id_curso = id_curso; 
        this.nota = nota; 
        this.comentario = comentario || null; 
        this.dataAvaliacao = new Date().toISOString(); 
    }
}