export class Plano {
    constructor({ id_plano = null, nome, preco, duracaoMeses, descricao = '' }) {
        this.id_plano = id_plano ?? crypto.randomUUID();
        this.nome = nome;
        this.preco = parseFloat(preco);
        this.duracaoMeses = parseInt(duracaoMeses);
        this.descricao = descricao;
    }
    static validar(dados) { return []; }
}

export class Pagamento {
    constructor({ id_pagamento = null, id_usuario, valor, status, dataPagamento = null }) {
        this.id_pagamento = id_pagamento ?? crypto.randomUUID();
        this.id_usuario = id_usuario;
        this.valor = parseFloat(valor);
        this.status = status;
        this.dataPagamento = dataPagamento ?? new Date().toISOString();
    }
    static validar(dados) { return []; }
}

export class Assinatura {
    constructor({ id_assinatura = null, id_usuario, id_plano, status, dataInicio = null }) {
        this.id_assinatura = id_assinatura ?? crypto.randomUUID();
        this.id_usuario = id_usuario;
        this.id_plano = id_plano;
        this.status = status;
        this.dataInicio = dataInicio ?? new Date().toISOString();
    }
    static validar(dados) { return []; }
}