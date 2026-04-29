export class Modulo {
    constructor({ id = null, id_curso, titulo, ordem }) {
        this.id_modulo = id ?? crypto.randomUUID(); 
        this.id_curso = id_curso; 
        this.titulo = titulo; 
        this.ordem = ordem; 
    }
}

export class Aula {
    constructor({ id = null, id_modulo, titulo, tipoConteudo, url_conteudo, duracaoMinutos, ordem }) {
        this.id_aula = id ?? crypto.randomUUID(); 
        this.id_modulo = id_modulo; 
        this.titulo = titulo; 
        this.tipoConteudo = tipoConteudo; 
        this.url_conteudo = url_conteudo; 
        this.duracaoMinutos = duracaoMinutos || 0; 
        this.ordem = ordem; 
    }
}