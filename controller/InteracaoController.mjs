import { CoreService } from '../service/CoreService.mjs';
import { Usuario } from '../model/Core.mjs';
import { Matricula, ProgressoAula, Avaliacao } from '../model/Interacao.mjs';
import { Certificado } from '../model/Curadoria.mjs';
import { Pagamento, Assinatura } from '../model/Negocio.mjs';

const svc = new CoreService();
let aulasDoCurso = [];
let indexAtual = 0;
let alunoAtual = null;
let cursoAtualId = null;
let trilhaAtivaId = null;

let planoPendenteId = null;
let planoPendentePreco = null;

export function renderVitrineTrilhas() {
    trilhaAtivaId = null; 
    const lista = svc.listar('tb_trilhas');
    const grid = document.getElementById('grid-vitrine-trilhas');
    
    grid.innerHTML = lista.length === 0 
        ? '<p class="text-muted">Nenhuma trilha disponível no momento.</p>' 
        : lista.map(t => `
        <div class="col-md-4 mb-4">
            <div class="card trilha-card h-100 shadow-sm border-info" onclick="abrirTrilha('${t.id_trilha}', '${t.titulo}')">
                <div class="card-body text-center py-4 bg-light">
                    <h5 class="text-info fw-bold">${t.titulo}</h5>
                    <p class="text-muted small">${t.descricao}</p>
                    <button class="btn btn-sm btn-info text-white mt-2 px-4 rounded-pill">Ver Roteiro</button>
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
                    <p class="text-muted small">${p.duracaoMeses} meses de acesso total</p>
                    <button class="btn btn-outline-success w-100 fw-bold" onclick="prepararCheckout('${p.id_plano}', '${p.nome}', ${p.preco})">Assinar Plano</button>
                </div>
            </div>
        </div>`).join('');
}

export function prepararCheckout(idPlano, nome, preco) {
    if (!alunoAtual) {
        alert("Para assinar um plano, faça a matrícula inicial num curso primeiro para gerar o seu perfil!");
        return;
    }
    planoPendenteId = idPlano;
    planoPendentePreco = preco;
    document.getElementById('check-nome-plano').innerText = nome;
    document.getElementById('check-preco-plano').innerText = `€ ${preco}`;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCheckout')).show();
}

export function confirmarPagamentoPlano() {
    try {
        const dadosPg = { id_usuario: alunoAtual.id_usuario, valor: planoPendentePreco, status: 'Aprovado' };
        const dadosAss = { id_usuario: alunoAtual.id_usuario, id_plano: planoPendenteId, status: 'Ativa' };
        
        svc.salvar('tb_pagamentos', dadosPg, Pagamento);
        svc.salvar('tb_assinaturas', dadosAss, Assinatura);
        
        bootstrap.Modal.getInstance(document.getElementById('modalCheckout')).hide();
        alert("🎉 Pagamento aprovado com sucesso! A partir de agora é um Aluno PREMIUM!");
    } catch (e) {
        alert("Erro ao processar pagamento: " + e.message);
    }
}

export function abrirTrilha(idTrilha, tituloTrilha) {
    trilhaAtivaId = idTrilha;
    document.getElementById('tela-vitrine-trilhas').classList.add('d-none');
    document.getElementById('tela-vitrine-cursos').classList.remove('d-none');
    document.getElementById('titulo-trilha-selecionada').innerText = `Roteiro: ${tituloTrilha}`;
    
    const vinculos = svc.listar('tb_trilhas_cursos').filter(v => v.id_trilha === idTrilha).sort((a, b) => a.ordem - b.ordem);
    const cursosIds = vinculos.map(v => v.id_curso);
    const cursos = svc.listar('tb_cursos').filter(c => cursosIds.includes(c.id_curso));

    const certificados = svc.listar('tb_certificados').filter(c => c.id_usuario === alunoAtual?.id_usuario);
    const concluidos = certificados.map(c => c.id_curso);

    let bloqueado = false; 

    document.getElementById('grid-vitrine-cursos').innerHTML = vinculos.length === 0 
        ? '<p class="text-muted">Esta trilha ainda não possui cursos vinculados.</p>' 
        : vinculos.map(v => {
            const c = cursos.find(curso => curso.id_curso === v.id_curso);
            if(!c) return '';

            let badgeCor = c.nivel === 'Avançado' ? 'danger' : (c.nivel === 'Intermediário' ? 'warning text-dark' : 'success');
            let btnHtml = '';

            if (bloqueado) {
                btnHtml = `<button class="btn btn-secondary w-100" disabled>🔒 Bloqueado</button>`;
            } else if (concluidos.includes(c.id_curso)) {
                btnHtml = `<button class="btn btn-success w-100 fw-bold" disabled>✅ Concluído</button>`;
            } else {
                btnHtml = `<button class="btn btn-primary w-100" onclick="iniciarMatricula('${c.id_curso}')">Iniciar Curso</button>`;
            }

            if (!concluidos.includes(c.id_curso)) bloqueado = true; 

            return `
            <div class="col-md-4 mb-4">
                <div class="card course-card h-100 shadow border-0 bg-white">
                    <div class="card-header bg-transparent text-muted small fw-bold pt-3 pb-1 border-0">MÓDULO ${v.ordem}</div>
                    <div class="card-body text-center py-3">
                        <span class="badge bg-${badgeCor} mb-3">${c.nivel || 'Básico'}</span>
                        <h5 class="text-dark fw-bold mb-2">${c.titulo}</h5>
                        <p class="text-muted small mb-4">Carga horária: ${c.totalHoras}h</p>
                        ${btnHtml}
                    </div>
                </div>
            </div>`;
        }).join('');
}

export function iniciarMatricula(id) {
    document.getElementById('mat-id-curso').value = id;
    if (alunoAtual) {
        confirmarMatricula(); 
    } else {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalMatricula')).show();
    }
}

export function confirmarMatricula() {
    const cursoId = document.getElementById('mat-id-curso').value;
    if (!alunoAtual) {
        alunoAtual = new Usuario({ nomeCompleto: document.getElementById('mat-nome').value, email: document.getElementById('mat-email').value, senhaHash: '...' });
        svc.salvar('tb_usuarios', alunoAtual, Usuario);
    }
    svc.salvar('tb_matriculas', new Matricula({ id_usuario: alunoAtual.id_usuario, id_curso: cursoId }), Matricula);
    
    const modalMatricula = bootstrap.Modal.getInstance(document.getElementById('modalMatricula'));
    if (modalMatricula) modalMatricula.hide();
    entrarNaSala(cursoId);
}

function entrarNaSala(idCurso) {
    cursoAtualId = idCurso;
    const modulos = svc.listar('tb_modulos').filter(m => m.id_curso === idCurso);
    aulasDoCurso = svc.listar('tb_aulas').filter(a => modulos.some(m => m.id_modulo === a.id_modulo));

    if (aulasDoCurso.length === 0) {
        alert("O curso não possui aulas cadastradas no sistema."); return;
    }

    document.getElementById('tela-vitrine-cursos').classList.add('d-none');
    document.getElementById('tela-sala-aula').classList.remove('d-none');
    indexAtual = 0;
    atualizarAula();
}

function atualizarAula() {
    document.getElementById('video-titulo').innerText = aulasDoCurso[indexAtual].titulo;
    document.getElementById('video-desc').innerText = aulasDoCurso[indexAtual].descricao || 'Sem descrição adicional.';
    
    document.getElementById('sidebar-aulas').innerHTML = aulasDoCurso.map((a, i) => `
        <div class="aula-item ${i === indexAtual ? 'aula-ativa' : ''} ${i < indexAtual ? 'text-success' : 'text-muted'}">
            ${i < indexAtual ? '[Concluída]' : i + 1 + '.'} ${a.titulo}
        </div>`).join('');
}

export function concluirAulaAtual() {
    const aulaAtual = aulasDoCurso[indexAtual];
    svc.salvar('tb_progresso', new ProgressoAula({ id_usuario: alunoAtual.id_usuario, id_aula: aulaAtual.id_aula, status: 'Concluído' }), ProgressoAula);

    indexAtual++;
    
    if (indexAtual === 1 && aulasDoCurso.length > 1) {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAvaliacao')).show();
    }
    
    if (indexAtual >= aulasDoCurso.length) concluirCursoAtual();
    else atualizarAula();
}

export function enviarAvaliacaoNota(nota) {
    try {
        const dadosAvaliacao = { id_usuario: alunoAtual.id_usuario, id_curso: cursoAtualId, nota: nota, comentario: 'Avaliado pelo aluno' };
        svc.salvar('tb_avaliacoes', dadosAvaliacao, Avaliacao);
        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAvaliacao')).hide();
        alert(`Obrigado! A sua avaliação de ${nota} estrelas foi registada.`);
    } catch (erro) { alert("Erro ao registar avaliação: " + erro.message); }
}

function concluirCursoAtual() {
    const certCurso = new Certificado({ id_usuario: alunoAtual.id_usuario, id_curso: cursoAtualId });
    svc.salvar('tb_certificados', certCurso, Certificado);

    if (trilhaAtivaId) {
        const vinculos = svc.listar('tb_trilhas_cursos').filter(v => v.id_trilha === trilhaAtivaId).sort((a,b) => a.ordem - b.ordem);
        const eOUltimoCurso = vinculos[vinculos.length - 1].id_curso === cursoAtualId;

        if (eOUltimoCurso) gerarCertificadoFinal('Trilha');
        else {
            alert("Parabéns! Concluiu este módulo com sucesso. O próximo curso da sua trilha acaba de ser desbloqueado!");
            document.getElementById('tela-sala-aula').classList.add('d-none');
            const nomeTrilhaAtual = svc.listar('tb_trilhas').find(t => t.id_trilha === trilhaAtivaId).titulo;
            abrirTrilha(trilhaAtivaId, nomeTrilhaAtual); 
        }
    } else {
        gerarCertificadoFinal('Curso');
    }
}

function gerarCertificadoFinal(tipo) {
    document.getElementById('tela-sala-aula').classList.add('d-none');
    document.getElementById('tela-certificado-real').style.display = 'block';
    
    let nomeCertificado = tipo === 'Trilha' ? svc.listar('tb_trilhas').find(t => t.id_trilha === trilhaAtivaId).titulo : svc.listar('tb_cursos').find(c => c.id_curso === cursoAtualId).titulo;
    document.getElementById('cert-tipo-texto').innerText = tipo === 'Trilha' ? "concluiu a trilha de conhecimento" : "concluiu o curso de";

    document.getElementById('cert-nome-aluno').innerText = alunoAtual.nomeCompleto;
    document.getElementById('cert-nome-curso').innerText = nomeCertificado;
    document.getElementById('cert-codigo').innerText = crypto.randomUUID().split('-')[0].toUpperCase();
}

export function renderAdminAlunos() {
    const alunos = svc.listar('tb_usuarios').filter(u => u.tipo === 'Aluno' || !u.tipo);
    const matriculas = svc.listar('tb_matriculas');
    const cursos = svc.listar('tb_cursos');
    const assinaturas = svc.listar('tb_assinaturas');

    const tbody = document.getElementById('tbl-admin-alunos');
    if (!tbody) return;

    tbody.innerHTML = alunos.length === 0 ? '<tr><td colspan="3" class="text-center text-muted">Nenhum aluno registado.</td></tr>' : alunos.map(aluno => {
        const mats = matriculas.filter(m => m.id_usuario === aluno.id_usuario);
        const nomesCursos = mats.map(m => {
            const c = cursos.find(curso => curso.id_curso === m.id_curso);
            return c ? c.titulo : 'Curso Eliminado';
        }).join('<br>') || '<span class="text-muted">Sem matrículas</span>';

        const temPlano = assinaturas.some(a => a.id_usuario === aluno.id_usuario && a.status === 'Ativa')
            ? '<span class="badge bg-success">Premium</span>' : '<span class="badge bg-secondary">Gratuito</span>';

        return `<tr><td><strong>${aluno.nomeCompleto}</strong><br><span class="text-muted small">${aluno.email}</span></td><td class="small">${nomesCursos}</td><td>${temPlano}</td></tr>`;
    }).join('');
}