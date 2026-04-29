import { CoreService } from './service/CoreService.mjs';
import * as AcadCtrl from './controller/AcademicoController.mjs';
import * as InterCtrl from './controller/InteracaoController.mjs';
import * as NegCtrl from './controller/NegocioController.mjs';

const svc = new CoreService();

Object.assign(window, {
    alternarVisao: (v) => {
        document.getElementById('visao-admin').classList.toggle('d-none', v !== 'admin');
        document.getElementById('visao-aluno').classList.toggle('d-none', v !== 'aluno');
        document.getElementById('tela-certificado-real').style.display = 'none';
        
        if (v === 'admin') { 
            renderAdminCategorias(); 
            renderAdminCursos(); 
            renderAdminModulosAulas(); 
            renderAdminTrilhas(); 
            renderAdminPlanos(); 
        } else { 
            document.getElementById('tela-vitrine-cursos').classList.add('d-none');
            document.getElementById('tela-sala-aula').classList.add('d-none');
            document.getElementById('tela-vitrine-trilhas').classList.remove('d-none');
            InterCtrl.renderVitrineTrilhas(); 
        }
    },

    excluirItem: (tab, id, pk, renderFunctionName) => { 
        if(confirm('Tem a certeza que deseja eliminar este item e os seus dependentes?')) { 
            svc.excluir(tab, id, pk); 
            if (typeof window[renderFunctionName] === 'function') {
                window[renderFunctionName]();
            }
        } 
    },

    abrirModal: (id) => new bootstrap.Modal(document.getElementById(id)).show(),

    // --- ACADÉMICO ---
    renderAdminCategorias: AcadCtrl.renderAdminCategorias,
    renderAdminCursos: AcadCtrl.renderAdminCursos,
    renderAdminModulosAulas: AcadCtrl.renderAdminModulosAulas,
    renderAdminTrilhas: AcadCtrl.renderAdminTrilhas,
    salvarCategoria: AcadCtrl.salvarCategoria,
    salvarCurso: AcadCtrl.salvarCurso,
    salvarModulo: AcadCtrl.salvarModulo,
    prepararNovaAula: AcadCtrl.prepararNovaAula,
    salvarAula: AcadCtrl.salvarAula,
    salvarTrilha: AcadCtrl.salvarTrilha,
    vincularCursoTrilha: AcadCtrl.vincularCursoTrilha,

    // --- ALUNO ---
    abrirTrilha: InterCtrl.abrirTrilha,
    iniciarMatricula: InterCtrl.iniciarMatricula,
    confirmarMatricula: InterCtrl.confirmarMatricula,
    concluirAulaAtual: InterCtrl.concluirAulaAtual,
    enviarAvaliacao: InterCtrl.enviarAvaliacaoNota,
    assinarPlanoPremium: InterCtrl.assinarPlanoPremium,
    voltarParaTrilhas: () => {
        document.getElementById('tela-vitrine-cursos').classList.add('d-none');
        document.getElementById('tela-certificado-real').style.display = 'none';
        document.getElementById('tela-vitrine-trilhas').classList.remove('d-none');
    },
    voltarParaCursos: () => {
        document.getElementById('tela-sala-aula').classList.add('d-none');
        document.getElementById('tela-vitrine-cursos').classList.remove('d-none');
    },

    // --- FINANCEIRO ---
    renderAdminPlanos: NegCtrl.renderAdminPlanos,
    salvarPlano: NegCtrl.salvarPlano
});

// Inicia a aplicação
document.addEventListener('DOMContentLoaded', () => InterCtrl.renderVitrineTrilhas());