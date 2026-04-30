import { CoreService } from '../service/CoreService.mjs';
import { Usuario, Curso } from '../model/Core.mjs';

const svc = new CoreService();


export function renderUsuarios() {
    const tbody = document.getElementById('tbl-usuarios');
    const lista = svc.listar('tb_usuarios');

    tbody.innerHTML = lista.length === 0 
        ? '<tr><td colspan="4" class="text-center text-muted small">Nenhum usuário registrado.</td></tr>' 
        : lista.map(u => `
            <tr>
                <td class="fw-bold">${u.nomeCompleto}</td>
                <td class="text-muted small">${u.email}</td>
                <td class="small">${new Date(u.dataCadastro).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-primary btn-sm me-1" onclick="editarUsuario('${u.id_usuario}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="excluirUsuario('${u.id_usuario}')">Excluir</button>
                </td>
            </tr>
        `).join('');
}

export function salvarUsuario() {
    const form = document.getElementById('form-usuario');
    const idEdicao = form.dataset.editId;
    const dados = {
        nomeCompleto: form.nomeCompleto.value,
        email: form.email.value,
        senhaHash: form.senhaHash.value
    };

    try {
        if (idEdicao) {
            svc.atualizar('tb_usuarios', idEdicao, dados, Usuario, 'id_usuario');
            delete form.dataset.editId;
        } else {
            svc.salvar('tb_usuarios', dados, Usuario);
        }
        form.reset();
        renderUsuarios();
        mostrarAlerta('Usuário salvo com sucesso!', 'success');
    } catch (e) {
        mostrarAlerta(e.message, 'danger');
    }
}

export function excluirUsuario(id) {
    if (!confirm('Excluir este usuário?')) return;
    svc.excluir('tb_usuarios', id, 'id_usuario');
    renderUsuarios();
}


export function renderCursos() {
    const grid = document.getElementById('grid-cursos');
    const lista = svc.listar('tb_cursos');

    grid.innerHTML = lista.length === 0 
        ? '<div class="col-12 text-center py-5"><p class="text-muted">Nenhum curso disponível.</p></div>' 
        : lista.map(c => `
            <div class="col-md-4 mb-4">
                <div class="card course-card h-100 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="badge bg-light text-primary">${c.nivel}</span>
                            <div class="dropdown">
                                <button class="btn btn-sm btn-light border dropdown-toggle" data-bs-toggle="dropdown">Opções</button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-menu small" href="#" onclick="excluirCurso('${c.id_curso}')">Excluir</a></li>
                                </ul>
                            </div>
                        </div>
                        <h5 class="card-title">${c.titulo}</h5>
                        <p class="card-text small text-muted">ID: <code class="user-select-all">${c.id_curso.substring(0,8)}...</code></p>
                        <div class="mt-4 d-flex justify-content-between align-items-center">
                            <span class="small text-secondary fw-semibold">Horas: ${c.totalHoras}h</span>
                            <button class="btn btn-primary btn-sm rounded-pill px-3">Ver Aulas</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
}

export function salvarCurso() {
    const form = document.getElementById('form-curso');
    const dados = {
        titulo: form.titulo.value,
        nivel: form.nivel.value,
        totalHoras: form.totalHoras.value,
        id_categoria: form.id_categoria.value,
        id_instrutor: form.id_instrutor.value,
        descricao: form.descricao.value,
        totalAulas: form.totalAulas.value
    };

    try {
        svc.salvar('tb_cursos', dados, Curso);
        form.reset();
        document.getElementById('form-curso-container').classList.add('d-none');
        renderCursos();
        mostrarAlerta('Curso criado!', 'success');
    } catch (e) {
        mostrarAlerta(e.message, 'danger');
    }
}

export function excluirCurso(id) {
    if (confirm('Excluir este curso?')) {
        svc.excluir('tb_cursos', id, 'id_curso');
        renderCursos();
    }
}

function mostrarAlerta(msg, tipo) {
    const div = document.getElementById('alerta');
    div.className = `alert alert-${tipo} d-block`;
    div.textContent = msg;
    setTimeout(() => div.className = 'alert d-none', 3000);
}