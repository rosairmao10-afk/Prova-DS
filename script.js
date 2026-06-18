import {
    consultarDiretoComFetch,
    insertTarefa,
    sqlAtualizarTarefa,
    sqlDeletarTarefa,
} from './script_db.js';

// ------ Elementos principais do HTML -------------------------

const formTarefa = document.getElementById('form-tarefa');
const tabelaTarefa = document.getElementById('tabela-corpo');
const btnCancelar = document.getElementById('btn-cancelar');
const formTitulo = document.getElementById('form-titulo');
const btnSalvar = document.getElementById('btn-salvar-text');

// ================================
// =        FUNÇÕES VISUAIS       =
// ================================



function limparFormulario() {
    formTarefa.reset();
    document.getElementById('tarefa-id').value = '';

    formTitulo.textContent = 'Salvar Tarefa';
    btnSalvar.textContent = 'Salvar Tarefa';
    btnCancelar.classList.add('hidden');
}

function mostrarToast(mensagem, tipo = 'success') {
    const container = document.getElementById('toast-container');

    if (!container) return;

    const toast = document.createElement('div');

    const cores = {
        success: 'bg-green-600',
        error: 'bg-rose-600',
        info: 'bg-blue-600'
    };

    const icones = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    toast.className = `toast-enter ${cores[tipo] || cores.info} toast-message`;

    toast.innerHTML = `
        <i class="fas ${icones[tipo] || icones.info} text-lg"></i>
        <span>${mensagem}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';

        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// ============================================
// =      Ler dados no BD e criar tabela      =
// ============================================

async function criarTabelaTarefa() {
    const dados = await consultarDiretoComFetch();

    tabelaTarefa.innerHTML = '';

    if (!dados || dados.length === 0) {
        tabelaTarefa.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    Nenhuma Tarefa encontrada...
                </td>
            </tr>
        `;
        return;
    }

    
    dados.forEach(element => {
        const linha = document.createElement('tr');
        let a;

        
        if (element.urgencia === 'nao-urgente') {
           a =`<span class="badge nao-urgente">Não Urgente</span>`;
        }

        if (element.urgencia === 'urgente') {
            a = `<span class="badge urgente">Urgente</span>`; 
        }

        if (element.urgencia === 'normal') {
            a = `<span class="badge normal">Normal</span>`;
        }

        
        const date = new Date(element.criado_em).toLocaleString('pt-BR')
        linha.innerHTML = `
            <td class="cell-id">#${element.id}</td>

            <td>
                <p class="cell-name">${element.titulo}</p>
                <p class="cell-descricao">${element.descricao}</p>
            </td>

            <td><span class="badge badge-data">${date}</span></td>
            <td><span class="badge badge-data">${a}</span></td>
            

            <td>
                <div class="action-container">

                    <button
                        onclick="prepararEdicao(
                            ${element.id},
                            '${element.titulo}',
                            '${element.descricao}',
                            '${date}'
                            '${a}'
                            
                        )"
                        class="btn-action btn-edit"
                    >
                        <i class="fas fa-pen"></i>
                    </button>

                    <button
                        onclick="deletarTarefa(${element.id})"
                        class="btn-action btn-delete"
                    >
                        <i class="fas fa-trash"></i>
                    </button>

                </div>
            </td>
        `;

        tabelaTarefa.appendChild(linha);
    });
}

window.criarTabelaTarefa = criarTabelaTarefa;

// ============================================
// =        EDITAR USUÁRIO                    =
// ============================================

window.prepararEdicao = function (id, titulo, descricao, criado_em, urgencia) {
    document.getElementById('tarefa-id').value = id;
    document.getElementById('titulo').value = titulo;
    document.getElementById('descricao').value = descricao;
    document.getElementById('criado_em').value = criado_em;
    document.getElementById('urgencia').value = urgencia;

    formTitulo.textContent = 'Editar Tarefa';
    btnSalvar.textContent = 'Atualizar Tarefa';

    btnCancelar.classList.remove('hidden');
};

// ============================================
// =      SALVAR / ATUALIZAR USUÁRIO          =
// ============================================

async function lidarComEnvioDoFormulario(event) {
    event.preventDefault();

    const id = document.getElementById('tarefa-id').value;
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const criado_em = document.getElementById('criado_em').value;
    const urgencia = document.getElementById('urgencia').value;

    let sucesso = false;

    if (id) {
        console.log('Atualizando usuário...', id, titulo, descricao, criado_em, urgencia);

        sucesso = await sqlAtualizarTarefa(
            titulo,
            descricao,
            id,
            urgencia
        );

        if (sucesso) {
            mostrarToast(
                'Tarefa atualizada com sucesso!',
                'success'
            );
        }
    } else {
        console.log('Criando novo usuário...', titulo, descricao);

        sucesso = await insertTarefa(
            titulo,
            descricao);

        if (sucesso) {
            mostrarToast(
                'Tarefa cadastrada com sucesso!',
                'success'
            );
        }
    }

    if (!sucesso) {
        mostrarToast(
            'Ocorreu um erro na operação.',
            'error'
        );
        return;
    }

    limparFormulario();
    criarTabelaTarefa();
}

// ============================================
// =          DELETAR USUÁRIO                 =
// ============================================

window.deletarTarefa = async function (id) {
    const confirmar = confirm(
        'Tem certeza que deseja excluir esta tarefa?'
    );

    if (!confirmar) return;

    const sucesso = await sqlDeletarTarefa(id);

    if (sucesso) {
        mostrarToast(
            'Tarefa excluído com sucesso!',
            'success'
        );

        criarTabelaTarefa();
    } else {
        mostrarToast(
            'Erro ao excluir a tarefa.',
            'error'
        );
    }
};

// ============================================
// =            EVENTOS                       =
// ============================================

formTarefa.addEventListener(
    'submit',
    lidarComEnvioDoFormulario
);

btnCancelar.addEventListener(
    'click',
    limparFormulario
);

// ============================================
// =            INICIALIZAÇÃO                 =
// ============================================

criarTabelaTarefa();
