export class Modulo {
    constructor({ id_modulo = null, id_curso, titulo, ordem }) {
        this.id_modulo = id_modulo ?? crypto.randomUUID();
        this.id_curso = id_curso;
        this.titulo = titulo;
        this.ordem = parseInt(ordem);
    }
}

export class Aula {
    // Adicionamos a 'descricao = ''' aqui no construtor e no 'this'
    constructor({ id_aula = null, id_modulo, titulo, conteudoUrl, descricao = '', duracaoMinutos, ordem }) {
        this.id_aula = id_aula ?? crypto.randomUUID();
        this.id_modulo = id_modulo;
        this.titulo = titulo;
        this.conteudoUrl = conteudoUrl;
        this.descricao = descricao; // <-- O "segredo" está aqui!
        this.duracaoMinutos = parseInt(duracaoMinutos);
        this.ordem = parseInt(ordem);
    }
}