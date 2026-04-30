export class Usuario {
    constructor(dados) {
        this.id_usuario = dados.id_usuario || crypto.randomUUID();
        this.nomeCompleto = dados.nomeCompleto || '';
        this.email = dados.email || '';
        this.senhaHash = dados.senhaHash || '';
        this.dataCadastro = dados.dataCadastro || new Date().toISOString();
        this.tipo = dados.tipo || 'Aluno'; 
    }
}