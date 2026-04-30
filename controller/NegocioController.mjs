import { CoreService } from '../service/CoreService.mjs';
import { Plano } from '../model/Negocio.mjs';

const svc = new CoreService();

export function renderAdminPlanos() {
    const lista = svc.listar('tb_planos');
    const tbody = document.getElementById('tbl-admin-planos');
    if (!tbody) return;

    tbody.innerHTML = lista.map(p => `
        <tr>
            <td><strong>${p.nome}</strong></td>
            <td>€ ${p.preco}</td>
            <td>${p.duracaoMeses} meses</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-warning border-0 me-1" onclick="prepararEdicaoPlano('${p.id_plano}')">Editar</button>
                <button class="btn btn-sm btn-outline-danger border-0" onclick="excluirItem('tb_planos', '${p.id_plano}', 'id_plano', 'renderAdminPlanos')">Eliminar</button>
            </td>
        </tr>`).join('');
}

export function prepararEdicaoPlano(id) {
    const item = svc.listar('tb_planos').find(p => p.id_plano === id);
    if (!item) return;
    document.getElementById('pla-id').value = item.id_plano;
    document.getElementById('pla-nome').value = item.nome;
    document.getElementById('pla-preco').value = item.preco;
    document.getElementById('pla-meses').value = item.duracaoMeses;
    document.getElementById('titulo-modal-plano').innerText = 'Editar Plano';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalPlano')).show();
}

export function salvarPlano() {
    const id = document.getElementById('pla-id').value;
    const dados = {
        nome: document.getElementById('pla-nome').value,
        preco: document.getElementById('pla-preco').value,
        duracaoMeses: document.getElementById('pla-meses').value,
        descricao: 'Acesso total à plataforma de estudos'
    };
    if (id) dados.id_plano = id;

    svc.salvar('tb_planos', dados, Plano);
    
    document.getElementById('form-plano').reset();
    document.getElementById('pla-id').value = '';
    document.getElementById('titulo-modal-plano').innerText = 'Configurar Plano Financeiro';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalPlano')).hide();
    
    renderAdminPlanos();
}