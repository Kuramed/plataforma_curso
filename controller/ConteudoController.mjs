import { ConteudoService } from '../service/ConteudoService.mjs';
import { Modulo } from '../model/Conteudo.mjs';

const svc = new ConteudoService();

export function renderModulos() {
    const tbody = document.getElementById('tbl-modulos');
    if (!tbody) return;
    
    const lista = svc.listar('tb_modulos');
    tbody.innerHTML = lista.length === 0 
        ? '<tr><td colspan="3" class="text-center">Nenhum módulo registado.</td></tr>' 
        : lista.map(m => `
            <tr>
                <td>${m.ordem}</td>
                <td>${m.titulo}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="excluirModulo('${m.id_modulo}')">Excluir</button>
                </td>
            </tr>
        `).join('');
}

export function salvarModulo() {
    const form = document.getElementById('form-modulo');
    const dados = {
        id_curso: form.id_curso.value,
        titulo: form.titulo.value,
        ordem: form.ordem.value
    };

    try {
        svc.salvar('tb_modulos', dados, Modulo);
        form.reset();
        renderModulos();
        alert('Módulo guardado com sucesso!');
    } catch (e) {
        alert(e.message);
    }
}

export function excluirModulo(id) {
    if (!confirm('Excluir este módulo?')) return;
    svc.excluir('tb_modulos', id, 'id_modulo');
    renderModulos();
}