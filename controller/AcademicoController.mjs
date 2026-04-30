import { CoreService } from '../service/CoreService.mjs';
import { Categoria, Curso, Modulo, Aula, Trilha } from '../model/Conteudo.mjs';

const svc = new CoreService();

function atualizarSelects() {
    const categorias = svc.listar('tb_categorias');
    const cursos = svc.listar('tb_cursos');
    const trilhas = svc.listar('tb_trilhas');

    const catHtml = '<option value="">Selecione uma Categoria...</option>' + categorias.map(c => `<option value="${c.id_categoria}">${c.titulo}</option>`).join('');
    const curHtml = '<option value="">Selecione um Curso...</option>' + cursos.map(c => `<option value="${c.id_curso}">${c.titulo}</option>`).join('');
    const triHtml = '<option value="">Selecione uma Trilha...</option>' + trilhas.map(t => `<option value="${t.id_trilha}">${t.titulo}</option>`).join('');

    document.querySelectorAll('.select-cats').forEach(s => s.innerHTML = catHtml);
    document.querySelectorAll('.select-cursos').forEach(s => s.innerHTML = curHtml);
    document.querySelectorAll('.select-trilhas').forEach(s => s.innerHTML = triHtml);
}

export function renderAdminCategorias() {
    const lista = svc.listar('tb_categorias');
    const tbody = document.getElementById('tbl-admin-categorias');
    if (!tbody) return;
    
    tbody.innerHTML = lista.length === 0 ? '<tr><td>Nenhuma categoria.</td></tr>' : lista.map(c => `
        <tr>
            <td><strong>${c.titulo}</strong><br><span class="text-muted small">${c.descricao}</span></td>
            <td class="text-end" style="width: 150px;">
                <button class="btn btn-sm btn-outline-warning border-0" onclick="prepararEdicaoCategoria('${c.id_categoria}')">Editar</button>
                <button class="btn btn-sm btn-outline-danger border-0" onclick="excluirItem('tb_categorias', '${c.id_categoria}', 'id_categoria', 'renderAdminCategorias')">Excluir</button>
            </td>
        </tr>`).join('');
    atualizarSelects();
}

export function salvarCategoria() {
    svc.salvar('tb_categorias', { id_categoria: document.getElementById('cat-id').value, titulo: document.getElementById('cat-titulo').value, descricao: document.getElementById('cat-desc').value }, Categoria);
    bootstrap.Modal.getInstance(document.getElementById('modalCategoria')).hide();
    renderAdminCategorias();
}

export function prepararEdicaoCategoria(id) {
    const item = svc.buscarPorId('tb_categorias', id, 'id_categoria');
    document.getElementById('cat-id').value = item.id_categoria;
    document.getElementById('cat-titulo').value = item.titulo;
    document.getElementById('cat-desc').value = item.descricao;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCategoria')).show();
}

export function renderAdminCursos() {
    const lista = svc.listar('tb_cursos');
    const cats = svc.listar('tb_categorias');
    const tbody = document.getElementById('tbl-admin-cursos');
    if (!tbody) return;

    tbody.innerHTML = lista.length === 0 ? '<tr><td colspan="4">Nenhum curso.</td></tr>' : lista.map(c => {
        const cat = cats.find(x => x.id_categoria === c.id_categoria)?.titulo || 'S/ Categoria';
        return `<tr>
            <td><strong>${c.titulo}</strong><br><span class="badge bg-secondary">${c.nivel}</span></td>
            <td>${cat}</td>
            <td>${c.totalHoras}h</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-warning border-0" onclick="prepararEdicaoCurso('${c.id_curso}')">Editar</button>
                <button class="btn btn-sm btn-outline-danger border-0" onclick="excluirItem('tb_cursos', '${c.id_curso}', 'id_curso', 'renderAdminCursos')">Excluir</button>
            </td>
        </tr>`;
    }).join('');
    atualizarSelects();
}

export function salvarCurso() {
    svc.salvar('tb_cursos', { id_curso: document.getElementById('cur-id').value, titulo: document.getElementById('cur-titulo').value, id_categoria: document.getElementById('cur-cat').value, nivel: document.getElementById('cur-nivel').value, totalHoras: parseInt(document.getElementById('cur-horas').value) || 0, descricao: document.getElementById('cur-desc').value }, Curso);
    bootstrap.Modal.getInstance(document.getElementById('modalCurso')).hide();
    renderAdminCursos();
}

export function prepararEdicaoCurso(id) {
    const item = svc.buscarPorId('tb_cursos', id, 'id_curso');
    document.getElementById('cur-id').value = item.id_curso;
    document.getElementById('cur-titulo').value = item.titulo;
    document.getElementById('cur-cat').value = item.id_categoria;
    document.getElementById('cur-nivel').value = item.nivel;
    document.getElementById('cur-horas').value = item.totalHoras;
    document.getElementById('cur-desc').value = item.descricao;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCurso')).show();
}

export function renderAdminModulosAulas() {
    const cursos = svc.listar('tb_cursos');
    const modulos = svc.listar('tb_modulos');
    const aulas = svc.listar('tb_aulas');
    const div = document.getElementById('lista-admin-modulos-aulas');
    if (!div) return;

    div.innerHTML = cursos.map(curso => {
        const modsCurso = modulos.filter(m => m.id_curso === curso.id_curso);
        const htmlMods = modsCurso.map(m => {
            const aulasMod = aulas.filter(a => a.id_modulo === m.id_modulo);
            const htmlAulas = aulasMod.map(a => `
                <div class="d-flex justify-content-between border-bottom py-1 ps-3">
                    <small>• ${a.titulo}</small>
                    <div>
                        <button class="btn btn-link btn-sm p-0 text-warning" onclick="prepararEdicaoAula('${a.id_aula}')">Editar</button>
                        <button class="btn btn-link btn-sm p-0 text-danger ms-2" onclick="excluirItem('tb_aulas', '${a.id_aula}', 'id_aula', 'renderAdminModulosAulas')">X</button>
                    </div>
                </div>`).join('');
                
            return `
            <div class="card mb-2 shadow-sm border-0 bg-light">
                <div class="card-body py-2 d-flex justify-content-between align-items-center">
                    <strong>Módulo: ${m.titulo}</strong>
                    <div>
                        <button class="btn btn-sm btn-success py-0" onclick="prepararNovaAula('${m.id_modulo}')">+ Aula</button>
                        <button class="btn btn-sm btn-warning py-0 ms-1" onclick="prepararEdicaoModulo('${m.id_modulo}')">Editar</button>
                        <button class="btn btn-sm btn-danger py-0 ms-1" onclick="excluirItem('tb_modulos', '${m.id_modulo}', 'id_modulo', 'renderAdminModulosAulas')">Excluir</button>
                    </div>
                </div>
                <div class="card-footer bg-white border-0 pt-0">${htmlAulas}</div>
            </div>`;
        }).join('');
        return modsCurso.length > 0 ? `<div class="mb-4"><h6 class="text-primary border-bottom pb-1">${curso.titulo}</h6>${htmlMods}</div>` : '';
    }).join('') || '<p class="text-muted small">Adicione módulos a um curso para começar.</p>';
}

export function salvarModulo() {
    svc.salvar('tb_modulos', { id_modulo: document.getElementById('mod-id').value, id_curso: document.getElementById('mod-curso').value, titulo: document.getElementById('mod-titulo').value }, Modulo);
    bootstrap.Modal.getInstance(document.getElementById('modalModulo')).hide();
    renderAdminModulosAulas();
}

export function prepararEdicaoModulo(id) {
    const item = svc.buscarPorId('tb_modulos', id, 'id_modulo');
    document.getElementById('mod-id').value = item.id_modulo;
    document.getElementById('mod-curso').value = item.id_curso;
    document.getElementById('mod-titulo').value = item.titulo;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalModulo')).show();
}

export function prepararNovaAula(idModulo) {
    document.getElementById('form-aula').reset();
    document.getElementById('aula-id').value = '';
    document.getElementById('aula-id-modulo').value = idModulo; 
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAula')).show();
}

export function salvarAula() {
    svc.salvar('tb_aulas', { id_aula: document.getElementById('aula-id').value, id_modulo: document.getElementById('aula-id-modulo').value, titulo: document.getElementById('aula-titulo').value, descricao: document.getElementById('aula-desc').value }, Aula);
    bootstrap.Modal.getInstance(document.getElementById('modalAula')).hide();
    renderAdminModulosAulas();
}

export function prepararEdicaoAula(id) {
    const item = svc.buscarPorId('tb_aulas', id, 'id_aula');
    document.getElementById('aula-id').value = item.id_aula;
    document.getElementById('aula-id-modulo').value = item.id_modulo;
    document.getElementById('aula-titulo').value = item.titulo;
    document.getElementById('aula-desc').value = item.descricao;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAula')).show();
}

export function renderAdminTrilhas() {
    const lista = svc.listar('tb_trilhas');
    const tbody = document.getElementById('tbl-admin-trilhas');
    if (!tbody) return;

    tbody.innerHTML = lista.length === 0 ? '<tr><td>Nenhuma trilha.</td></tr>' : lista.map(t => `
        <tr>
            <td><strong>${t.titulo}</strong></td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-warning border-0" onclick="prepararEdicaoTrilha('${t.id_trilha}')">Editar</button>
                <button class="btn btn-sm btn-outline-danger border-0" onclick="excluirItem('tb_trilhas', '${t.id_trilha}', 'id_trilha', 'renderAdminTrilhas')">Excluir</button>
            </td>
        </tr>`).join('');
    
    atualizarSelects();
    renderVinculosTrilhas();
}

export function salvarTrilha() {
    svc.salvar('tb_trilhas', { id_trilha: document.getElementById('tri-id').value, titulo: document.getElementById('tri-titulo').value, descricao: document.getElementById('tri-desc').value, id_categoria: document.getElementById('tri-cat').value }, Trilha);
    bootstrap.Modal.getInstance(document.getElementById('modalTrilha')).hide();
    renderAdminTrilhas();
}

export function prepararEdicaoTrilha(id) {
    const item = svc.buscarPorId('tb_trilhas', id, 'id_trilha');
    document.getElementById('tri-id').value = item.id_trilha;
    document.getElementById('tri-titulo').value = item.titulo;
    document.getElementById('tri-desc').value = item.descricao;
    document.getElementById('tri-cat').value = item.id_categoria;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalTrilha')).show();
}

export function vincularCursoTrilha() {
    const dados = {
        id_vinculo: crypto.randomUUID(), 
        id_trilha: document.getElementById('vin-trilha').value,
        id_curso: document.getElementById('vin-curso').value,
        ordem: parseInt(document.getElementById('vin-ordem').value)
    };
    svc.salvar('tb_trilhas_cursos', dados, Object); 
    document.getElementById('form-vinculo').reset();
    renderVinculosTrilhas();
}

function renderVinculosTrilhas() {
    const vinculos = svc.listar('tb_trilhas_cursos');
    const trilhas = svc.listar('tb_trilhas');
    const cursos = svc.listar('tb_cursos');
    const div = document.getElementById('lista-vinculos-trilha');
    if (!div) return;

    div.innerHTML = vinculos.map(v => {
        const tri = trilhas.find(t => t.id_trilha === v.id_trilha)?.titulo || 'Trilha Excluída';
        const cur = cursos.find(c => c.id_curso === v.id_curso)?.titulo || 'Curso Excluído';
        return `<div class="d-flex justify-content-between border-bottom py-1">
            <span><strong>[${tri}]</strong> Ordem ${v.ordem} - ${cur}</span>
            <button class="btn btn-link btn-sm text-danger p-0 ms-2" onclick="excluirItem('tb_trilhas_cursos', '${v.id_vinculo}', 'id_vinculo', 'renderAdminTrilhas')">Desvincular</button>
        </div>`;
    }).join('');
}

export function excluirCascata(tabela, id, renderFunctionName) {
    if(!confirm('Atenção! Esta ação removerá também os dados dependentes (Módulos, Aulas, Matrículas, etc). Confirmar?')) return;
    
    if (tabela === 'tb_cursos') {
        let modulos = svc.listar('tb_modulos').filter(m => m.id_curso === id);
        modulos.forEach(m => {
            let aulas = svc.listar('tb_aulas').filter(a => a.id_modulo === m.id_modulo);
            aulas.forEach(a => {
                const p = svc.listar('tb_progresso').filter(x => x.id_aula !== a.id_aula);
                localStorage.setItem('tb_progresso', JSON.stringify(p));
                svc.excluir('tb_aulas', a.id_aula, 'id_aula');
            });
            svc.excluir('tb_modulos', m.id_modulo, 'id_modulo');
        });
        const m = svc.listar('tb_matriculas').filter(x => x.id_curso !== id); localStorage.setItem('tb_matriculas', JSON.stringify(m));
        const c = svc.listar('tb_certificados').filter(x => x.id_curso !== id); localStorage.setItem('tb_certificados', JSON.stringify(c));
        const v = svc.listar('tb_trilhas_cursos').filter(x => x.id_curso !== id); localStorage.setItem('tb_trilhas_cursos', JSON.stringify(v));
    }
    
    else if (tabela === 'tb_modulos') {
        let aulas = svc.listar('tb_aulas').filter(a => a.id_modulo === id);
        aulas.forEach(a => {
            const p = svc.listar('tb_progresso').filter(x => x.id_aula !== a.id_aula);
            localStorage.setItem('tb_progresso', JSON.stringify(p));
            svc.excluir('tb_aulas', a.id_aula, 'id_aula');
        });
    }

    else if (tabela === 'tb_trilhas') {
        const v = svc.listar('tb_trilhas_cursos').filter(x => x.id_trilha !== id); localStorage.setItem('tb_trilhas_cursos', JSON.stringify(v));
    }

    const idCampo = tabela.replace('tb_', 'id_').replace(/s$/, '');
    svc.excluir(tabela, id, idCampo);
    
    if (typeof window[renderFunctionName] === 'function') window[renderFunctionName]();
    atualizarSelects();
}