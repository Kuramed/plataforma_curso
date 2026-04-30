import { CoreService } from '../service/CoreService.mjs';
import { Categoria, Curso } from '../model/Core.mjs';
import { Modulo, Aula } from '../model/Conteudo.mjs';
import { Trilha } from '../model/Curadoria.mjs';

const svc = new CoreService();

class TrilhaCurso {
    constructor({ id_trilha, id_curso, ordem }) {
        this.id_trilha = id_trilha;
        this.id_curso = id_curso;
        this.ordem = parseInt(ordem);
        this.id_vinculo = crypto.randomUUID();
    }
}

export function atualizarSelects() {
    const cats = svc.listar('tb_categorias');
    const cursos = svc.listar('tb_cursos');
    const trilhas = svc.listar('tb_trilhas');
    
    document.querySelectorAll('.select-cats').forEach(el => 
        el.innerHTML = '<option value="">Selecione uma Categoria...</option>' + cats.map(c => `<option value="${c.id_categoria}">${c.nome}</option>`).join('')
    );
    document.querySelectorAll('.select-cursos').forEach(el => 
        el.innerHTML = '<option value="">Selecione um Curso...</option>' + cursos.map(c => `<option value="${c.id_curso}">${c.titulo}</option>`).join('')
    );
    document.querySelectorAll('.select-trilhas').forEach(el => 
        el.innerHTML = '<option value="">Selecione uma Trilha...</option>' + trilhas.map(t => `<option value="${t.id_trilha}">${t.titulo}</option>`).join('')
    );
}

// === CATEGORIAS ===
export function renderAdminCategorias() {
    const lista = svc.listar('tb_categorias');
    const tbody = document.getElementById('tbl-admin-categorias');
    if (!tbody) return;

    tbody.innerHTML = lista.map(c => `
        <tr>
            <td><strong>${c.nome}</strong></td>
            <td class="text-muted small">${c.descricao || 'Sem descrição'}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-warning border-0 me-1" onclick="prepararEdicaoCategoria('${c.id_categoria}')">Editar</button>
                <button class="btn btn-sm btn-outline-danger border-0" onclick="excluirItem('tb_categorias', '${c.id_categoria}', 'id_categoria', 'renderAdminCategorias')">Eliminar</button>
            </td>
        </tr>`).join('');
    atualizarSelects();
}

export function prepararEdicaoCategoria(id) {
    const item = svc.listar('tb_categorias').find(c => c.id_categoria === id);
    if (!item) return;
    document.getElementById('cat-id').value = item.id_categoria;
    document.getElementById('cat-titulo').value = item.nome;
    document.getElementById('cat-desc').value = item.descricao || '';
    document.getElementById('titulo-modal-cat').innerText = 'Editar Categoria';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCategoria')).show();
}

export function salvarCategoria() {
    try {
        const id = document.getElementById('cat-id').value;
        const dados = { nome: document.getElementById('cat-titulo').value.trim(), descricao: document.getElementById('cat-desc').value.trim() };
        if (id) dados.id_categoria = id;
        
        svc.salvar('tb_categorias', dados, Categoria);
        document.getElementById('form-categoria').reset(); 
        document.getElementById('cat-id').value = '';
        document.getElementById('titulo-modal-cat').innerText = 'Nova Categoria';
        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCategoria')).hide();
        renderAdminCategorias();
    } catch (erro) { alert("Erro ao guardar Categoria: " + erro.message); }
}

// === CURSOS ===
export function renderAdminCursos() {
    const lista = svc.listar('tb_cursos');
    const tbody = document.getElementById('tbl-admin-cursos');
    if (!tbody) return;

    tbody.innerHTML = lista.map(c => `
        <tr>
            <td>${c.titulo} <span class="badge bg-secondary ms-1">${c.nivel || 'Básico'}</span></td>
            <td>${c.totalHoras}h</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-warning border-0 me-1" onclick="prepararEdicaoCurso('${c.id_curso}')">Editar</button>
                <button class="btn btn-sm btn-outline-danger border-0" onclick="excluirItem('tb_cursos', '${c.id_curso}', 'id_curso', 'renderAdminCursos')">Eliminar</button>
            </td>
        </tr>`).join('');
    atualizarSelects();
}

export function prepararEdicaoCurso(id) {
    const item = svc.listar('tb_cursos').find(c => c.id_curso === id);
    if (!item) return;
    document.getElementById('cur-id').value = item.id_curso;
    document.getElementById('cur-titulo').value = item.titulo;
    document.getElementById('cur-cat').value = item.id_categoria;
    document.getElementById('cur-nivel').value = item.nivel || 'Básico';
    document.getElementById('cur-horas').value = item.totalHoras;
    document.getElementById('cur-desc').value = item.descricao;
    document.getElementById('titulo-modal-curso').innerText = 'Editar Curso';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCurso')).show();
}

export function salvarCurso() {
    try {
        const id = document.getElementById('cur-id').value;
        const dados = {
            titulo: document.getElementById('cur-titulo').value,
            id_categoria: document.getElementById('cur-cat').value,
            nivel: document.getElementById('cur-nivel').value,
            totalHoras: document.getElementById('cur-horas').value,
            descricao: document.getElementById('cur-desc').value,
            id_instrutor: 'inst-1', totalAulas: 0
        };
        if (id) dados.id_curso = id;

        svc.salvar('tb_cursos', dados, Curso);
        document.getElementById('form-curso').reset();
        document.getElementById('cur-id').value = '';
        document.getElementById('titulo-modal-curso').innerText = 'Novo Curso';
        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCurso')).hide();
        renderAdminCursos();
    } catch (erro) { alert("Erro: " + erro.message); }
}

// === MÓDULOS E AULAS ===
export function renderAdminModulosAulas() {
    const modulos = svc.listar('tb_modulos');
    const aulas = svc.listar('tb_aulas');
    const container = document.getElementById('lista-admin-modulos-aulas');
    if (!container) return;

    container.innerHTML = modulos.length === 0 ? '<p class="text-muted small">Nenhum módulo criado.</p>' : modulos.map(m => `
        <div class="border rounded p-3 mb-3 bg-light shadow-sm">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <strong>${m.titulo}</strong>
                <div>
                    <button class="btn btn-sm btn-link text-warning text-decoration-none p-0 me-2" onclick="prepararEdicaoModulo('${m.id_modulo}')">Editar</button>
                    <button class="btn btn-sm btn-link text-danger text-decoration-none p-0 me-3" onclick="excluirItem('tb_modulos', '${m.id_modulo}', 'id_modulo', 'renderAdminModulosAulas')">Eliminar</button>
                    <button class="btn btn-sm btn-success" onclick="prepararNovaAula('${m.id_modulo}')">+ Adicionar Aula</button>
                </div>
            </div>
            <div class="ms-3 bg-white p-2 rounded border">
                ${aulas.filter(a => a.id_modulo === m.id_modulo).map(a => `
                    <div class="d-flex justify-content-between align-items-center py-1 border-bottom">
                        <span class="small text-secondary">- ${a.titulo}</span>
                        <div>
                            <button class="btn btn-sm btn-link text-warning p-0 me-2" onclick="prepararEdicaoAula('${a.id_aula}')">Editar</button>
                            <button class="btn btn-sm btn-link text-danger p-0" onclick="excluirItem('tb_aulas', '${a.id_aula}', 'id_aula', 'renderAdminModulosAulas')">Remover</button>
                        </div>
                    </div>
                `).join('') || '<span class="small text-muted">Módulo sem aulas.</span>'}
            </div>
        </div>`).join('');
}

export function prepararEdicaoModulo(id) {
    const item = svc.listar('tb_modulos').find(m => m.id_modulo === id);
    if (!item) return;
    document.getElementById('mod-id').value = item.id_modulo;
    document.getElementById('mod-curso').value = item.id_curso;
    document.getElementById('mod-titulo').value = item.titulo;
    document.getElementById('titulo-modal-modulo').innerText = 'Editar Módulo';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalModulo')).show();
}

export function salvarModulo() {
    const id = document.getElementById('mod-id').value;
    const dados = { id_curso: document.getElementById('mod-curso').value, titulo: document.getElementById('mod-titulo').value, ordem: 1 };
    if (id) dados.id_modulo = id;

    svc.salvar('tb_modulos', dados, Modulo);
    document.getElementById('form-modulo').reset();
    document.getElementById('mod-id').value = '';
    document.getElementById('titulo-modal-modulo').innerText = 'Novo Módulo';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalModulo')).hide();
    renderAdminModulosAulas();
}

export function prepararNovaAula(idModulo) {
    document.getElementById('form-aula').reset();
    document.getElementById('aula-id').value = '';
    document.getElementById('aula-id-modulo').value = idModulo;
    document.getElementById('titulo-modal-aula').innerText = 'Nova Aula';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAula')).show();
}

export function prepararEdicaoAula(idAula) {
    const item = svc.listar('tb_aulas').find(a => a.id_aula === idAula);
    if (!item) return;
    document.getElementById('aula-id').value = item.id_aula;
    document.getElementById('aula-id-modulo').value = item.id_modulo;
    document.getElementById('aula-titulo').value = item.titulo;
    document.getElementById('aula-desc').value = item.descricao || '';
    document.getElementById('titulo-modal-aula').innerText = 'Editar Aula';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAula')).show();
}

export function salvarAula() {
    const id = document.getElementById('aula-id').value;
    const dados = { 
        id_modulo: document.getElementById('aula-id-modulo').value, 
        titulo: document.getElementById('aula-titulo').value, 
        conteudoUrl: 'Video Simulado',
        descricao: document.getElementById('aula-desc').value,
        duracaoMinutos: 10, ordem: 1 
    };
    if (id) dados.id_aula = id;

    svc.salvar('tb_aulas', dados, Aula);
    document.getElementById('form-aula').reset(); 
    document.getElementById('aula-id').value = '';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAula')).hide();
    renderAdminModulosAulas();
}

// === TRILHAS ===
export function renderAdminTrilhas() {
    const trilhas = svc.listar('tb_trilhas');
    const vinculos = svc.listar('tb_trilhas_cursos');
    const cursos = svc.listar('tb_cursos');
    
    const tbody = document.getElementById('tbl-admin-trilhas');
    if (tbody) tbody.innerHTML = trilhas.map(t => `<tr><td>${t.titulo}</td><td class="text-end">
        <button class="btn btn-sm btn-outline-warning border-0 me-1" onclick="prepararEdicaoTrilha('${t.id_trilha}')">Editar</button>
        <button class="btn btn-sm btn-outline-danger border-0" onclick="excluirItem('tb_trilhas', '${t.id_trilha}', 'id_trilha', 'renderAdminTrilhas')">Eliminar</button>
    </td></tr>`).join('');

    const listaVinculos = document.getElementById('lista-vinculos-trilha');
    if (listaVinculos) {
        listaVinculos.innerHTML = vinculos.map(v => {
            const cNome = cursos.find(c => c.id_curso === v.id_curso)?.titulo || 'Curso Removido';
            const tNome = trilhas.find(t => t.id_trilha === v.id_trilha)?.titulo || 'Trilha Removida';
            return `<div class="d-flex justify-content-between border-bottom py-1 small"><span class="text-muted">[Ordem ${v.ordem}]</span> ${tNome} -> <strong>${cNome}</strong> <button class="btn btn-sm text-danger p-0" onclick="excluirItem('tb_trilhas_cursos', '${v.id_vinculo}', 'id_vinculo', 'renderAdminTrilhas')">Remover Vínculo</button></div>`;
        }).join('');
    }
    atualizarSelects();
}

export function prepararEdicaoTrilha(id) {
    const item = svc.listar('tb_trilhas').find(t => t.id_trilha === id);
    if (!item) return;
    document.getElementById('tri-id').value = item.id_trilha;
    document.getElementById('tri-titulo').value = item.titulo;
    document.getElementById('tri-desc').value = item.descricao;
    document.getElementById('tri-cat').value = item.id_categoria;
    document.getElementById('titulo-modal-trilha').innerText = 'Editar Trilha';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalTrilha')).show();
}

export function salvarTrilha() {
    const id = document.getElementById('tri-id').value;
    const dados = { titulo: document.getElementById('tri-titulo').value, descricao: document.getElementById('tri-desc').value, id_categoria: document.getElementById('tri-cat').value };
    if (id) dados.id_trilha = id;

    svc.salvar('tb_trilhas', dados, Trilha);
    document.getElementById('form-trilha').reset(); 
    document.getElementById('tri-id').value = '';
    document.getElementById('titulo-modal-trilha').innerText = 'Nova Trilha';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalTrilha')).hide();
    renderAdminTrilhas();
}

export function vincularCursoTrilha() {
    const dados = { id_trilha: document.getElementById('vin-trilha').value, id_curso: document.getElementById('vin-curso').value, ordem: document.getElementById('vin-ordem').value };
    svc.salvar('tb_trilhas_cursos', dados, TrilhaCurso);
    document.getElementById('form-vinculo').reset();
    renderAdminTrilhas();
}

// === EXCLUSÃO EM CASCATA ===
export function excluirCascata(tabela, id, callbackName) {
    if(!confirm('Atenção: Eliminar este item apagará TAMBÉM todos os registos dependentes (cursos, módulos, aulas, etc.). Deseja continuar?')) return;
    if (tabela === 'tb_categorias') {
        svc.listar('tb_cursos').filter(c => c.id_categoria === id).forEach(c => excluirCursoDireto(c.id_curso));
        svc.listar('tb_trilhas').filter(t => t.id_categoria === id).forEach(t => excluirTrilhaDireto(t.id_trilha));
        svc.excluir('tb_categorias', id, 'id_categoria');
    }
    else if (tabela === 'tb_cursos') excluirCursoDireto(id);
    else if (tabela === 'tb_modulos') excluirModuloDireto(id);
    else if (tabela === 'tb_trilhas') excluirTrilhaDireto(id);
    renderAdminCategorias(); renderAdminCursos(); renderAdminModulosAulas(); renderAdminTrilhas();
}
function excluirCursoDireto(idCurso) {
    svc.listar('tb_modulos').filter(m => m.id_curso === idCurso).forEach(m => excluirModuloDireto(m.id_modulo));
    svc.listar('tb_trilhas_cursos').filter(v => v.id_curso === idCurso).forEach(v => svc.excluir('tb_trilhas_cursos', v.id_vinculo, 'id_vinculo'));
    svc.excluir('tb_cursos', idCurso, 'id_curso');
}
function excluirModuloDireto(idModulo) {
    svc.listar('tb_aulas').filter(a => a.id_modulo === idModulo).forEach(a => svc.excluir('tb_aulas', a.id_aula, 'id_aula'));
    svc.excluir('tb_modulos', idModulo, 'id_modulo');
}
function excluirTrilhaDireto(idTrilha) {
    svc.listar('tb_trilhas_cursos').filter(v => v.id_trilha === idTrilha).forEach(v => svc.excluir('tb_trilhas_cursos', v.id_vinculo, 'id_vinculo'));
    svc.excluir('tb_trilhas', idTrilha, 'id_trilha');
}