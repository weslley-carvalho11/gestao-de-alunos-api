import { api } from '../helpers/api.js';
import { comTokenAdmin, getToken } from '../helpers/auth.js';
import { assert, expect } from 'chai';
import { novoAluno } from '../factories/alunosFactory.js';
import { novoTrabalho } from '../factories/trabalhoFactory.js';

describe('Fluxo de Testes - Administrador', () => {

    it('deve entragar o trabalho como aluno', async () => {
        const tokenAdmin = await comTokenAdmin();
        const aluno = novoAluno();
        // console.log(aluno);

        const cadastroDeAluno = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', tokenAdmin)
            .send(aluno);
        // console.log(cadastroDeAluno.body);
        // console.log(cadastroDeAluno.body.id);

        const matriculaId = 'disciplina-historia';
        const urlMatricula = `/api/admin/disciplinas/${matriculaId}/matriculas`;
        // console.log(urlMatricula);

        const matriculaAluno = await api()
            .post(urlMatricula)
            .set('Content-Type', 'application/json')
            .set('Authorization', tokenAdmin)
            .send(
                {
                    alunoId: cadastroDeAluno.body.id
                }
            );
        // console.log(matriculaAluno.body);

        const urlRegistraTrabalho = `/api/alunos/${cadastroDeAluno.body.id}/trabalhos`;
        // console.log(urlRegistraTrabalho);
        const novotrabalho = novoTrabalho();
        // console.log(novotrabalho.titulo);
        // console.log(novotrabalho.descricao);

        const registrarEntregaDoTrabalho = await api()
            .post(urlRegistraTrabalho)
            .set('Content-Type', 'application/json')
            .set('Authorization', await getToken(aluno.email, aluno.senha))
            .send(
                {
                    disciplinaId: matriculaAluno.body.disciplinaId,
                    titulo: novotrabalho.titulo,
                    descricao: novotrabalho.descricao
                }
            );
        // console.log(registrarEntregaDoTrabalho.body);

        expect(registrarEntregaDoTrabalho.status).to.equal(201);
        expect(registrarEntregaDoTrabalho.body.alunoId).to.be.equal(cadastroDeAluno.body.id);
        expect(registrarEntregaDoTrabalho.body.disciplinaId).to.be.equal(matriculaId);
        expect(registrarEntregaDoTrabalho.body.titulo).to.be.equal(novotrabalho.titulo);
        expect(registrarEntregaDoTrabalho.body.descricao).to.be.equal(novotrabalho.descricao);
        expect(registrarEntregaDoTrabalho.body.status).to.be.equal('entregue');
    });
});
