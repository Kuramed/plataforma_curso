export class Plano {
    constructor({ id = null, nome, descricao, preco, duracaoMeses }) {
        this.id_plano = id ?? crypto.randomUUID(); 
        this.nome = nome; 
        this.descricao = descricao; 
        this.preco = preco; 
        this.duracaoMeses = duracaoMeses; 
    }

    static validar(dados) {
        const erros = [];
        if (!dados.nome?.trim()) erros.push('Nome do Plano é obrigatório');
        if (dados.preco === undefined || dados.preco === null) erros.push('Preço é obrigatório');
        if (!dados.duracaoMeses) erros.push('Duração é obrigatória');
        return erros;
    }
}

export class Assinatura {
    constructor({ id = null, id_usuario, id_plano, duracaoMeses }) {
        this.id_assinatura = id ?? crypto.randomUUID(); 
        this.id_usuario = id_usuario; 
        this.id_plano = id_plano; 
        
        const dataAtual = new Date();
        this.dataInicio = dataAtual.toISOString(); 
        
        dataAtual.setMonth(dataAtual.getMonth() + (duracaoMeses || 1));
        this.dataFim = dataAtual.toISOString(); 
    }
}

export class Pagamento {
    constructor({ id = null, id_assinatura, valorPago, metodoPagamento, id_transacao_gateway }) {
        this.id_pagamento = id ?? crypto.randomUUID(); 
        this.id_assinatura = id_assinatura; 
        this.valorPago = valorPago; 
        this.dataPagamento = new Date().toISOString(); 
        this.metodoPagamento = metodoPagamento; 
        this.id_transacao_gateway = id_transacao_gateway; 
    }
}