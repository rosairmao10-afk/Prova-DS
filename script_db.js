const DATABASE_URL = "postgresql://neondb_owner:npg_0iubSolUF1Xt@ep-billowing-darkness-atcpgg5e-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const host = new URL(DATABASE_URL).host;
const neonHttpEndPoint = `https://${host}/sql`;
async function executarQueryNeon(querySQL, parametros = []) {
    try {
        const resposta = await fetch(neonHttpEndPoint, {
            method: 'POST',
            headers: {
                'Neon-Connection-String': DATABASE_URL,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: querySQL,
                params: parametros
            })
        });
        if (!resposta.ok) {
             const errorTexto = await resposta.text();
             throw new Error(`Erro HTTP: ${errorTexto}`);
         }
        const dados = await resposta.json();
        return dados.rows;
    } catch (erro) {
        console.error("Falha ao comunicar com o banco de dados:", erro);
        throw erro;
    }
}
export async function insertTarefa(titulo, descricao, urgencia) {
    console.log("Cadastrando usuario no banco: ", { titulo, descricao, urgencia });
    const query = 'INSERT INTO tarefas (titulo, descricao, urgencia) VALUES($1, $2, $3) RETURNING *'
    const params = [titulo, descricao, urgencia];
    const linhas = await executarQueryNeon(query, params);
    return linhas !== null;
}
export async function consultarDiretoComFetch() {
    console.log("Buscando todas as tarefas...");

    const query = 'SELECT * FROM tarefas';
    const linhas = await executarQueryNeon(query);
    return linhas || [];
}
export async function sqlAtualizarTarefa(titulo, descricao, id, urgencia) {
    console.log("Altualizando usuario no Banco, id: ", id);
    const query = 'UPDATE tarefas SET titulo = $1, descricao = $2, urgencia = $3 WHERE id = $4 RETURNING *';
    const params = [titulo, descricao, urgencia, id];
    const linhas = await executarQueryNeon(query, params);
    return linhas !== null;
}
export async function sqlDeletarTarefa(id) {
    console.log("Deletando usuario no Banco... ", id);
    const query = 'DELETE FROM tarefas WHERE id = $1 RETURNING *';
    const params = [id];
    const linhas = await executarQueryNeon(query, params)
    return linhas !== null;
}
