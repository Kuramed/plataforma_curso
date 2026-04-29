import { CuradoriaService } from '../service/CuradoriaService.mjs';
import { Trilha } from '../model/Curadoria.mjs';

const svc = new CuradoriaService();

export function renderTrilhas() {
    const tbody = document.getElementById('tbl-trilhas');
    if (!tbody) return;

    const lista = svc.listar('tb_trilhas');
    tbody.innerHTML = lista.length === 0 
        ? '<tr><td colspan="3" class="text-center">Nenhuma trilha registada.</td></tr>' 
        : lista.map(t => `
            <tr>
                <td>${t.titulo}</td>
                <td>${t.descricao}</td>
                <td><button class="btn btn-sm btn-danger" onclick="excluirTrilha('${t.id_trilha}')">Excluir</button></td>
            </tr>
        `).join('');
}

export function salvarTrilha() {
    const form = document.getElementById('form-trilha');
    const dados = {
        titulo: form.titulo.value,
        descricao: form.descricao.value,
        id_categoria: form.id_categoria.value
    };

    try {
        svc.salvar('tb_trilhas', dados, Trilha);
        form.reset();
        renderTrilhas();
    } catch (e) {
        alert(e.message);
    }
}

export function excluirTrilha(id) {
    if (!confirm('Excluir trilha?')) return;
    svc.excluir('tb_trilhas', id, 'id_trilha');
    renderTrilhas();
}