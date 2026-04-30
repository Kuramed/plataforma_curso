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
            AcadCtrl.renderAdminCategorias(); 
            AcadCtrl.renderAdminCursos(); 
            AcadCtrl.renderAdminModulosAulas(); 
            AcadCtrl.renderAdminTrilhas(); 
            NegCtrl.renderAdminPlanos(); 
            InterCtrl.renderAdminAlunos(); 
        } else {
            InterCtrl.renderVitrineTrilhas(); 
        }
    },

    excluirItem: (tab, id, pk, renderFunctionName) => { 
        if (['tb_categorias', 'tb_cursos', 'tb_modulos', 'tb_trilhas'].includes(tab)) {
            AcadCtrl.excluirCascata(tab, id, renderFunctionName);
        } else {
            if(confirm('Tem a certeza que deseja eliminar este item?')) { 
                svc.excluir(tab, id, pk); 
                if (typeof window[renderFunctionName] === 'function') {
                    window[renderFunctionName]();
                }
            }
        }
    },

    abrirModal: (id) => {
        const form = document.querySelector(`#${id} form`);
        if (form) form.reset(); 
        
        const hiddenInputs = document.querySelectorAll(`#${id} input[type="hidden"]`);
        hiddenInputs.forEach(input => input.value = '');
        
        bootstrap.Modal.getOrCreateInstance(document.getElementById(id)).show();
    },

    prepararEdicaoAluno: InterCtrl.prepararEdicaoAluno,
    salvarAluno: InterCtrl.salvarAluno,
    visualizarCertificadoAdmin: InterCtrl.visualizarCertificadoAdmin,
    renderAdminAlunos: InterCtrl.renderAdminAlunos, 

    prepararEdicaoCategoria: AcadCtrl.prepararEdicaoCategoria,
    prepararEdicaoCurso: AcadCtrl.prepararEdicaoCurso,
    prepararEdicaoModulo: AcadCtrl.prepararEdicaoModulo,
    prepararEdicaoAula: AcadCtrl.prepararEdicaoAula,
    prepararEdicaoTrilha: AcadCtrl.prepararEdicaoTrilha,
    prepararEdicaoPlano: NegCtrl.prepararEdicaoPlano,
    
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

    abrirTrilha: InterCtrl.abrirTrilha,
    iniciarMatricula: InterCtrl.iniciarMatricula,
    confirmarMatricula: InterCtrl.confirmarMatricula,
    concluirAulaAtual: InterCtrl.concluirAulaAtual,
    enviarAvaliacao: InterCtrl.enviarAvaliacaoNota,
    prepararCheckout: InterCtrl.prepararCheckout,
    confirmarPagamentoPlano: InterCtrl.confirmarPagamentoPlano,
    
    voltarParaTrilhas: () => { 
        document.getElementById('tela-vitrine-cursos').classList.add('d-none'); 
        document.getElementById('tela-vitrine-trilhas').classList.remove('d-none'); 
    },
    voltarParaCursos: () => { 
        document.getElementById('tela-sala-aula').classList.add('d-none'); 
        document.getElementById('tela-vitrine-cursos').classList.remove('d-none'); 
    },

    renderAdminPlanos: NegCtrl.renderAdminPlanos,
    salvarPlano: NegCtrl.salvarPlano
});

document.addEventListener('DOMContentLoaded', () => InterCtrl.renderVitrineTrilhas());