export class Trilha {
    constructor({ id = null, titulo, descricao, id_categoria }) {
        this.id_trilha = id ?? crypto.randomUUID(); 
        this.titulo = titulo; 
        this.descricao = descricao; 
        this.id_categoria = id_categoria; 
    }
}

export class TrilhaCurso {
    constructor({ id_trilha, id_curso, ordem }) {
        this.id_trilha = id_trilha; 
        this.id_curso = id_curso; 
        this.ordem = ordem; 
    }
}

export class Certificado {
    constructor({ id = null, id_usuario, id_curso, id_trilha = null }) {
        this.id_certificado = id ?? crypto.randomUUID(); 
        this.id_usuario = id_usuario; 
        this.id_curso = id_curso; 
        this.id_trilha = id_trilha; 
        this.codigoVerificacao = crypto.randomUUID().split('-')[0].toUpperCase(); 
        this.dataEmissao = new Date().toISOString(); 
    }
}