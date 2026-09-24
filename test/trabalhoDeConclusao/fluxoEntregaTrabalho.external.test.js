import { api } from '../helpers/api.js';
import { comTokenAdmin, getToken } from '../helpers/auth.js';
import { expect } from 'chai';
import entregasDeTrabalho from '../fixtures/entregaDeTrabalho.json' with { type: 'json'};

describe('Fluxo de Testes - Administrador', () => {

    entregasDeTrabalho.forEach(entregaDeTrabalho => {
        it(entregaDeTrabalho.titulo, async () => {
            // console.log(entregaDeTrabalho.titulo);
            const tokenAdmin = await comTokenAdmin();

            const cadastroDeAluno = await api()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAdmin)
                .send(entregaDeTrabalho.aluno);
            //   console.log(entregaDeTrabalho.aluno);
            //   console.log(cadastroDeAluno.body);

            const urlMatricula = `/api/admin/disciplinas/${entregaDeTrabalho.trabalho.disciplinaId}/matriculas`;
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
            // console.log(cadastroDeAluno.body.id);
            // console.log(matriculaAluno.body);

            const urlRegistraTrabalho = `/api/alunos/${cadastroDeAluno.body.id}/trabalhos`;
            // console.log(urlRegistraTrabalho);  

            const registrarEntregaDoTrabalho = await api()
                .post(urlRegistraTrabalho)
                .set('Content-Type', 'application/json')
                .set('Authorization', await getToken(entregaDeTrabalho.aluno.email, entregaDeTrabalho.aluno.senha))
                .send(entregaDeTrabalho.trabalho);
            // console.log(registrarEntregaDoTrabalho.body);

            expect(registrarEntregaDoTrabalho.status).to.equal(entregaDeTrabalho.respostaEsperada.statusCodeEsperada);
            expect(registrarEntregaDoTrabalho.body.alunoId).to.be.equal(cadastroDeAluno.body.id);
            expect(registrarEntregaDoTrabalho.body.disciplinaId).to.be.equal(entregaDeTrabalho.trabalho.disciplinaId);
            expect(registrarEntregaDoTrabalho.body.titulo).to.be.equal(entregaDeTrabalho.trabalho.titulo);
            expect(registrarEntregaDoTrabalho.body.descricao).to.be.equal(entregaDeTrabalho.trabalho.descricao);
            expect(registrarEntregaDoTrabalho.body.status).to.be.equal(entregaDeTrabalho.respostaEsperada.statusDoTrabalho);
        });
    });
});
