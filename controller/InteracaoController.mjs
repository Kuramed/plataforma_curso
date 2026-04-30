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
    grid.innerHTML = lista.length === 0 ? '<p class="text-muted">Nenhuma trilha disponível no momento.</p>' : lista.map(t => `
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
    grid.innerHTML = planos.length === 0 ? '<p class="text-muted small">Sem planos disponíveis.</p>' : planos.map(p => `
        <div class="col-md-4 mb-3">
            <div class="card text-center shadow-sm border-success">
                <div class="card-header bg-success text-white fw-bold">${p.nome}</div>
                <div class="card-body">
                    <h3 class="card-title">EUR ${p.preco}</h3>
                    <p class="text-muted small">${p.duracaoMeses} meses de acesso</p>
                    <button class="btn btn-outline-success w-100 fw-bold" onclick="prepararCheckout('${p.id_plano}', '${p.nome}', ${p.preco})">Assinar</button>
                </div>
            </div>
        </div>`).join('');
}

export function prepararCheckout(idPlano, nome, preco) {
    if (!alunoAtual) { 
        alert("Realize a matrícula inicial num curso para criar o seu perfil."); 
        return; 
    }
    planoPendenteId = idPlano; 
    planoPendentePreco = preco;
    document.getElementById('check-nome-plano').innerText = nome;
    document.getElementById('check-preco-plano').innerText = `EUR ${preco}`;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCheckout')).show();
}

export function confirmarPagamentoPlano() {
    const metodo = document.getElementById('check-metodo-pagamento').value;
    svc.salvar('tb_pagamentos', { id_usuario: alunoAtual.id_usuario, valor: planoPendentePreco, metodoPagamento: metodo, status: 'Aprovado' }, Pagamento);
    svc.salvar('tb_assinaturas', { id_usuario: alunoAtual.id_usuario, id_plano: planoPendenteId, status: 'Ativa', dataInicio: new Date().toISOString() }, Assinatura);
    bootstrap.Modal.getInstance(document.getElementById('modalCheckout')).hide();
    alert("Pagamento aprovado. Acesso Premium libertado.");
}

export function abrirTrilha(idTrilha, tituloTrilha) {
    trilhaAtivaId = idTrilha;
    document.getElementById('tela-vitrine-trilhas').classList.add('d-none');
    document.getElementById('tela-vitrine-cursos').classList.remove('d-none');
    document.getElementById('titulo-trilha-selecionada').innerText = `Roteiro: ${tituloTrilha}`;
    
    const vinculos = svc.listar('tb_trilhas_cursos').filter(v => v.id_trilha === idTrilha).sort((a, b) => a.ordem - b.ordem);
    const cursos = svc.listar('tb_cursos');
    const concluidos = svc.listar('tb_certificados').filter(c => c.id_usuario === alunoAtual?.id_usuario).map(c => c.id_curso);

    let menorOrdemPendente = Infinity;
    vinculos.forEach(v => { 
        if (!concluidos.includes(v.id_curso) && v.ordem < menorOrdemPendente) {
            menorOrdemPendente = v.ordem;
        }
    });

    document.getElementById('grid-vitrine-cursos').innerHTML = vinculos.map(v => {
        const c = cursos.find(curso => curso.id_curso === v.id_curso);
        if(!c) return '';
        const isBloqueado = v.ordem > menorOrdemPendente;
        let btn = isBloqueado 
            ? `<button class="btn btn-secondary w-100" disabled>[Bloqueado]</button>` 
            : (concluidos.includes(c.id_curso) 
                ? `<button class="btn btn-success w-100" disabled>[Concluido]</button>` 
                : `<button class="btn btn-primary w-100" onclick="iniciarMatricula('${c.id_curso}')">Iniciar</button>`);
                
        return `
        <div class="col-md-4 mb-4">
            <div class="card h-100 shadow border-0">
                <div class="card-header bg-transparent small fw-bold">MODULO ${v.ordem}</div>
                <div class="card-body text-center">
                    <h5>${c.titulo}</h5>
                    <p class="small text-muted">${c.totalHoras}h</p>
                    ${btn}
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
        alunoAtual = new Usuario({ 
            nomeCompleto: document.getElementById('mat-nome').value, 
            email: document.getElementById('mat-email').value, 
            senhaHash: document.getElementById('mat-senha').value 
        });
        svc.salvar('tb_usuarios', alunoAtual, Usuario);
    }
    svc.salvar('tb_matriculas', { id_usuario: alunoAtual.id_usuario, id_curso: cursoId, dataMatricula: new Date().toISOString() }, Matricula);
    bootstrap.Modal.getInstance(document.getElementById('modalMatricula'))?.hide();
    entrarNaSala(cursoId);
}

function entrarNaSala(idCurso) {
    cursoAtualId = idCurso;
    const modulos = svc.listar('tb_modulos').filter(m => m.id_curso === idCurso);
    aulasDoCurso = svc.listar('tb_aulas').filter(a => modulos.some(m => m.id_modulo === a.id_modulo));
    
    if (aulasDoCurso.length === 0) { alert("Curso sem aulas."); return; }

    const progresso = svc.listar('tb_progresso').filter(p => p.id_usuario === alunoAtual.id_usuario);
    const aulasConcluidasIds = progresso.filter(p => p.status === 'Concluido').map(p => p.id_aula);

    const primeiraIncompleta = aulasDoCurso.findIndex(a => !aulasConcluidasIds.includes(a.id_aula));
    indexAtual = primeiraIncompleta === -1 ? 0 : primeiraIncompleta;

    document.getElementById('tela-vitrine-cursos').classList.add('d-none');
    document.getElementById('tela-sala-aula').classList.remove('d-none');
    atualizarAula();
}

// CORREÇÃO APLICADA: Agora renderiza a descrição corretamente formatada com quebras de linha
function atualizarAula() {
    const aula = aulasDoCurso[indexAtual];
    document.getElementById('video-titulo').innerText = aula.titulo;
    
    const displayDescricao = document.getElementById('video-desc');
    if (aula.descricao && aula.descricao.trim() !== '') {
        displayDescricao.innerHTML = aula.descricao.replace(/\n/g, '<br>');
    } else {
        displayDescricao.innerHTML = '<em>Nenhum conteúdo adicional disponível para esta aula.</em>';
    }
    
    const progresso = svc.listar('tb_progresso').filter(p => p.id_usuario === alunoAtual.id_usuario);
    const concluidasIds = progresso.map(p => p.id_aula);

    document.getElementById('sidebar-aulas').innerHTML = aulasDoCurso.map((a, i) => {
        const check = concluidasIds.includes(a.id_aula) ? '[Feito] ' : '';
        return `<div class="aula-item ${i === indexAtual ? 'aula-ativa' : ''}">${check}${i + 1}. ${a.titulo}</div>`;
    }).join('');
}

export function concluirAulaAtual() {
    svc.salvar('tb_progresso', { id_usuario: alunoAtual.id_usuario, id_aula: aulasDoCurso[indexAtual].id_aula, status: 'Concluido' }, ProgressoAula);
    indexAtual++;
    if (indexAtual >= aulasDoCurso.length) concluirCursoAtual();
    else atualizarAula();
}

function concluirCursoAtual() {
    const dataIso = new Date().toISOString();
    const codigo = crypto.randomUUID().split('-')[0].toUpperCase();
    svc.salvar('tb_certificados', { id_usuario: alunoAtual.id_usuario, id_curso: cursoAtualId, codigoVerificacao: codigo, dataEmissao: dataIso }, Certificado);
    
    if (trilhaAtivaId) {
        const vinculos = svc.listar('tb_trilhas_cursos').filter(v => v.id_trilha === trilhaAtivaId);
        const certs = svc.listar('tb_certificados').filter(c => c.id_usuario === alunoAtual.id_usuario);
        
        if (vinculos.every(v => certs.some(c => c.id_curso === v.id_curso))) {
            const codT = crypto.randomUUID().split('-')[0].toUpperCase();
            svc.salvar('tb_certificados', { id_usuario: alunoAtual.id_usuario, id_trilha: trilhaAtivaId, codigoVerificacao: codT, dataEmissao: dataIso }, Certificado);
            gerarCertificadoFinal('Trilha', codT);
        } else {
            alert("Curso concluido. O proximo passo da trilha esta disponivel.");
            document.getElementById('tela-sala-aula').classList.add('d-none');
            abrirTrilha(trilhaAtivaId, svc.listar('tb_trilhas').find(t => t.id_trilha === trilhaAtivaId).titulo);
        }
    } else {
        gerarCertificadoFinal('Curso', codigo);
    }
}

function gerarCertificadoFinal(tipo, codigo) {
    document.getElementById('tela-sala-aula').classList.add('d-none');
    document.getElementById('tela-certificado-real').style.display = 'block';
    
    let nome = '';
    let totalHoras = 0;

    if (tipo === 'Trilha') {
        const trilha = svc.listar('tb_trilhas').find(t => t.id_trilha === trilhaAtivaId);
        nome = trilha.titulo;
        document.getElementById('cert-tipo-texto').innerText = "concluiu a trilha de conhecimento";
        
        const vinculos = svc.listar('tb_trilhas_cursos').filter(v => v.id_trilha === trilhaAtivaId);
        const cursos = svc.listar('tb_cursos');
        vinculos.forEach(v => {
            const c = cursos.find(x => x.id_curso === v.id_curso);
            if (c) totalHoras += parseInt(c.totalHoras) || 0;
        });
    } else {
        const curso = svc.listar('tb_cursos').find(c => c.id_curso === cursoAtualId);
        nome = curso.titulo;
        totalHoras = curso.totalHoras || 0;
        document.getElementById('cert-tipo-texto').innerText = "concluiu o curso de";
    }

    document.getElementById('cert-nome-aluno').innerText = alunoAtual.nomeCompleto;
    document.getElementById('cert-nome-curso').innerText = nome;
    document.getElementById('cert-horas').innerText = totalHoras;
    document.getElementById('cert-codigo').innerText = codigo;
    document.getElementById('cert-data').innerText = new Date().toLocaleDateString('pt-PT');
}

export function enviarAvaliacaoNota(nota) {
    try {
        const dadosAvaliacao = { id_usuario: alunoAtual.id_usuario, id_curso: cursoAtualId, nota: nota, comentario: 'Avaliado pelo aluno' };
        svc.salvar('tb_avaliacoes', dadosAvaliacao, Avaliacao);
        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAvaliacao')).hide();
        alert(`Avaliação de ${nota} estrelas registada.`);
    } catch (erro) {
        alert("Erro ao registar avaliação: " + erro.message);
    }
}

export function renderAdminAlunos() {
    const alunos = svc.listar('tb_usuarios').filter(u => u.tipo === 'Aluno' || !u.tipo);
    const matriculas = svc.listar('tb_matriculas');
    const cursos = svc.listar('tb_cursos');
    const assinaturas = svc.listar('tb_assinaturas');
    const planos = svc.listar('tb_planos');
    const certificados = svc.listar('tb_certificados');

    const tbody = document.getElementById('tbl-admin-alunos');
    if (!tbody) return;

    tbody.innerHTML = alunos.map(aluno => {
        const nomesCursos = matriculas.filter(m => m.id_usuario === aluno.id_usuario).map(m => {
            const c = cursos.find(x => x.id_curso === m.id_curso);
            return c ? `${c.titulo} (${new Date(m.dataMatricula).toLocaleDateString('pt-PT')})` : 'Curso Removido';
        }).join('<br>') || 'Sem matriculas';

        const assAtiva = assinaturas.find(a => a.id_usuario === aluno.id_usuario && a.status === 'Ativa');
        let statusFin = 'Gratuito';
        if (assAtiva) {
            const p = planos.find(x => x.id_plano === assAtiva.id_plano);
            if (p) {
                const exp = new Date(assAtiva.dataInicio); 
                exp.setMonth(exp.getMonth() + p.duracaoMeses);
                statusFin = `Premium - Expira: ${exp.toLocaleDateString('pt-PT')}`;
            }
        }

        const certs = certificados.filter(c => c.id_usuario === aluno.id_usuario).map(c => {
            const nomeC = c.id_curso ? (cursos.find(x => x.id_curso === c.id_curso)?.titulo || 'Curso') : (svc.listar('tb_trilhas').find(x => x.id_trilha === c.id_trilha)?.titulo || 'Trilha');
            return `Certificado: ${nomeC} <button class="btn btn-link btn-sm p-0" onclick="visualizarCertificadoAdmin('${c.id_certificado}')">[Ver]</button>`;
        }).join('<br>') || 'Nenhum';

        return `<tr>
                    <td>${aluno.nomeCompleto}<br><small>${aluno.email}</small></td>
                    <td>${nomesCursos}</td>
                    <td>${statusFin}</td>
                    <td>${certs}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-warning me-1" onclick="prepararEdicaoAluno('${aluno.id_usuario}')">Editar</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="excluirItem('tb_usuarios', '${aluno.id_usuario}', 'id_usuario', 'renderAdminAlunos')">Eliminar</button>
                    </td>
                </tr>`;
    }).join('');
}

export function prepararEdicaoAluno(id) {
    const item = svc.listar('tb_usuarios').find(u => u.id_usuario === id);
    if (!item) return;
    document.getElementById('alu-id').value = item.id_usuario;
    document.getElementById('alu-nome').value = item.nomeCompleto;
    document.getElementById('alu-email').value = item.email;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAluno')).show();
}

export function salvarAluno() {
    const id = document.getElementById('alu-id').value;
    svc.salvar('tb_usuarios', { id_usuario: id, nomeCompleto: document.getElementById('alu-nome').value, email: document.getElementById('alu-email').value }, Usuario);
    bootstrap.Modal.getInstance(document.getElementById('modalAluno')).hide();
    renderAdminAlunos();
}

export function visualizarCertificadoAdmin(idCertificado) {
    const cert = svc.listar('tb_certificados').find(c => c.id_certificado === idCertificado);
    if (!cert) return;
    const aluno = svc.listar('tb_usuarios').find(u => u.id_usuario === cert.id_usuario);
    
    let nome = "Desconhecido"; let horas = 0; let tipoTexto = "concluiu o curso de";

    if (cert.id_curso) {
        const c = svc.listar('tb_cursos').find(x => x.id_curso === cert.id_curso);
        if (c) { nome = c.titulo; horas = c.totalHoras || 0; }
    } else if (cert.id_trilha) {
        const t = svc.listar('tb_trilhas').find(x => x.id_trilha === cert.id_trilha);
        if (t) { 
            nome = t.titulo; tipoTexto = "concluiu a trilha de conhecimento";
            svc.listar('tb_trilhas_cursos').filter(v => v.id_trilha === cert.id_trilha).forEach(v => {
                const cur = svc.listar('tb_cursos').find(x => x.id_curso === v.id_curso);
                if (cur) horas += parseInt(cur.totalHoras) || 0;
            });
        }
    }

    document.getElementById('visao-admin').classList.add('d-none');
    document.getElementById('visao-aluno').classList.remove('d-none');
    document.getElementById('tela-vitrine-trilhas').classList.add('d-none');
    document.getElementById('tela-certificado-real').style.display = 'block';

    document.getElementById('cert-nome-aluno').innerText = aluno.nomeCompleto;
    document.getElementById('cert-nome-curso').innerText = nome;
    document.getElementById('cert-horas').innerText = horas;
    document.getElementById('cert-tipo-texto').innerText = tipoTexto;
    document.getElementById('cert-codigo').innerText = cert.codigoVerificacao;
    document.getElementById('cert-data').innerText = new Date(cert.dataEmissao).toLocaleDateString('pt-PT');
}