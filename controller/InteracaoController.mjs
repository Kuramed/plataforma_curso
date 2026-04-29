import { CoreService } from '../service/CoreService.mjs';
import { Usuario } from '../model/Core.mjs';
import { Matricula, ProgressoAula } from '../model/Interacao.mjs';
import { Certificado } from '../model/Curadoria.mjs';

const svc = new CoreService();
let aulasDoCurso = [];
let indexAtual = 0;
let alunoAtual = null;
let cursoAtualId = null;

export function renderVitrineTrilhas() {
    const lista = svc.listar('tb_trilhas');
    const grid = document.getElementById('grid-vitrine-trilhas');
    
    grid.innerHTML = lista.length === 0 
        ? '<p class="text-muted">Nenhuma trilha disponível no momento.</p>' 
        : lista.map(t => `
        <div class="col-md-4 mb-4">
            <div class="card trilha-card h-100 shadow-sm border-info" onclick="abrirTrilha('${t.id_trilha}', '${t.titulo}')">
                <div class="card-body text-center py-4 bg-light">
                    <h5 class="text-info">${t.titulo}</h5>
                    <p class="text-muted small">${t.descricao}</p>
                    <button class="btn btn-sm btn-info text-white mt-2">Ver Cursos da Trilha</button>
                </div>
            </div>
        </div>`).join('');
        
    renderVitrinePlanosAluno(); 
}

export function renderVitrinePlanosAluno() {
    const planos = svc.listar('tb_planos');
    const grid = document.getElementById('grid-vitrine-planos-aluno');
    if(!grid) return;
    
    grid.innerHTML = planos.length === 0 
        ? '<p class="text-muted small">Nenhum plano Premium disponível.</p>' 
        : planos.map(p => `
        <div class="col-md-4 mb-3">
            <div class="card text-center shadow-sm border-success">
                <div class="card-header bg-success text-white fw-bold">${p.nome}</div>
                <div class="card-body">
                    <h3 class="card-title">€ ${p.preco}</h3>
                    <p class="text-muted small">${p.duracaoMeses} meses de acesso</p>
                    <button class="btn btn-outline-success w-100 fw-bold" onclick="assinarPlanoPremium('${p.id_plano}', ${p.preco})">Assinar Plano</button>
                </div>
            </div>
        </div>`).join('');
}

export function assinarPlanoPremium(idPlano, preco) {
    if (!alunoAtual) {
        alert("Por favor, aceda a um curso e faça o seu registo primeiro antes de assinar um plano!");
        return;
    }
    
    if (confirm(`Confirmar o pagamento no valor de € ${preco}?`)) {
        svc.salvar('tb_pagamentos', { id_usuario: alunoAtual.id_usuario, valor: preco, dataPagamento: new Date().toISOString(), status: 'Aprovado' });
        svc.salvar('tb_assinaturas', { id_usuario: alunoAtual.id_usuario, id_plano: idPlano, dataInicio: new Date().toISOString(), status: 'Ativa' });
        alert("Pagamento aprovado! Tornou-se num aluno PREMIUM!");
    }
}

export function abrirTrilha(idTrilha, tituloTrilha) {
    document.getElementById('tela-vitrine-trilhas').classList.add('d-none');
    document.getElementById('tela-vitrine-cursos').classList.remove('d-none');
    document.getElementById('titulo-trilha-selecionada').innerText = `Cursos: ${tituloTrilha}`;
    
    const vinculos = svc.listar('tb_trilhas_cursos').filter(v => v.id_trilha === idTrilha).sort((a, b) => a.ordem - b.ordem);
    const cursosIds = vinculos.map(v => v.id_curso);
    const cursos = svc.listar('tb_cursos').filter(c => cursosIds.includes(c.id_curso));

    document.getElementById('grid-vitrine-cursos').innerHTML = cursos.length === 0 
        ? '<p class="text-muted">Esta trilha ainda não possui cursos vinculados.</p>' 
        : cursos.map(c => `
        <div class="col-md-4 mb-4">
            <div class="card course-card h-100 shadow-sm" onclick="iniciarMatricula('${c.id_curso}')">
                <div class="card-body text-center py-4">
                    <h5 class="text-primary">${c.titulo}</h5>
                    <p class="text-muted small">Carga: ${c.totalHoras}h</p>
                    <button class="btn btn-sm btn-outline-primary mt-2">Matricular no Curso</button>
                </div>
            </div>
        </div>`).join('');
}

export function iniciarMatricula(id) {
    document.getElementById('mat-id-curso').value = id;
    new bootstrap.Modal(document.getElementById('modalMatricula')).show();
}

export function confirmarMatricula() {
    const cursoId = document.getElementById('mat-id-curso').value;
    alunoAtual = new Usuario({ nomeCompleto: document.getElementById('mat-nome').value, email: document.getElementById('mat-email').value, senhaHash: '...' });
    svc.salvar('tb_usuarios', alunoAtual, Usuario);
    svc.salvar('tb_matriculas', new Matricula({ id_usuario: alunoAtual.id_usuario, id_curso: cursoId }), Matricula);
    
    bootstrap.Modal.getInstance(document.getElementById('modalMatricula')).hide();
    entrarNaSala(cursoId);
}

function entrarNaSala(idCurso) {
    cursoAtualId = idCurso;
    const modulos = svc.listar('tb_modulos').filter(m => m.id_curso === idCurso);
    aulasDoCurso = svc.listar('tb_aulas').filter(a => modulos.some(m => m.id_modulo === a.id_modulo));

    if (aulasDoCurso.length === 0) {
        alert("O curso não possui aulas cadastradas no sistema.");
        return;
    }

    document.getElementById('tela-vitrine-cursos').classList.add('d-none');
    document.getElementById('tela-sala-aula').classList.remove('d-none');
    indexAtual = 0;
    atualizarAula();
}

export function concluirAulaAtual() {
    const aulaAtual = aulasDoCurso[indexAtual];
    svc.salvar('tb_progresso', new ProgressoAula({ id_usuario: alunoAtual.id_usuario, id_aula: aulaAtual.id_aula, status: 'Concluído' }), ProgressoAula);

    indexAtual++;
    
    if (indexAtual === 1 && aulasDoCurso.length > 1) {
        new bootstrap.Modal(document.getElementById('modalAvaliacao')).show();
    }
    
    if (indexAtual >= aulasDoCurso.length) {
        gerarCertificadoFinal();
    } else {
        atualizarAula();
    }
}

export function enviarAvaliacaoNota(nota) {
    svc.salvar('tb_avaliacoes', { id_usuario: alunoAtual.id_usuario, id_curso: cursoAtualId, nota: nota, comentario: 'Avaliado pelo ecrã de aula' });
    bootstrap.Modal.getInstance(document.getElementById('modalAvaliacao')).hide();
}

function atualizarAula() {
    document.getElementById('video-titulo').innerText = aulasDoCurso[indexAtual].titulo;
    document.getElementById('video-desc').innerText = aulasDoCurso[indexAtual].descricao || 'Sem descrição adicional.';
    
    document.getElementById('sidebar-aulas').innerHTML = aulasDoCurso.map((a, i) => `
        <div class="aula-item ${i === indexAtual ? 'aula-ativa' : ''} ${i < indexAtual ? 'text-success' : 'text-muted'}">
            ${i < indexAtual ? '[Concluída]' : i + 1 + '.'} ${a.titulo}
        </div>`).join('');
}

function gerarCertificadoFinal() {
    document.getElementById('tela-sala-aula').classList.add('d-none');
    document.getElementById('tela-certificado-real').style.display = 'block';
    
    const curso = svc.listar('tb_cursos').find(c => c.id_curso === cursoAtualId);
    const cert = new Certificado({ id_usuario: alunoAtual.id_usuario, id_curso: cursoAtualId });
    svc.salvar('tb_certificados', cert, Certificado);

    document.getElementById('cert-nome-aluno').innerText = alunoAtual.nomeCompleto;
    document.getElementById('cert-nome-curso').innerText = curso.titulo;
    document.getElementById('cert-codigo').innerText = cert.codigoVerificacao;
}