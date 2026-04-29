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
                <button class="btn btn-sm btn-outline-danger border-0" onclick="excluirItem('tb_planos', '${p.id_plano}', 'id_plano', 'renderAdminPlanos')">Eliminar Plano</button>
            </td>
        </tr>`).join('');
}

export function salvarPlano() {
    const dados = {
        nome: document.getElementById('pla-nome').value,
        preco: document.getElementById('pla-preco').value,
        duracaoMeses: document.getElementById('pla-meses').value,
        descricao: 'Acesso total à plataforma de estudos'
    };
    svc.salvar('tb_planos', dados, Plano);
    bootstrap.Modal.getInstance(document.getElementById('modalPlano')).hide();
    renderAdminPlanos();
}