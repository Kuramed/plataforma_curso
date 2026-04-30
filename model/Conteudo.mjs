export class Modulo {
    constructor({ id_modulo = null, id_curso, titulo, ordem }) {
        this.id_modulo = id_modulo ?? crypto.randomUUID();
        this.id_curso = id_curso;
        this.titulo = titulo;
        this.ordem = parseInt(ordem);
    }
}

export class Aula {
    constructor({ id_aula = null, id_modulo, titulo, conteudoUrl, descricao = '', duracaoMinutos, ordem }) {
        this.id_aula = id_aula ?? crypto.randomUUID();
        this.id_modulo = id_modulo;
        this.titulo = titulo;
        this.conteudoUrl = conteudoUrl;
        this.descricao = descricao; // <--- AGORA A DESCRIÇÃO NUNCA MAIS SOME!
        this.duracaoMinutos = parseInt(duracaoMinutos) || 10;
        this.ordem = parseInt(ordem);
    }
}