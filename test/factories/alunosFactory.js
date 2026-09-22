import { faker } from '@faker-js/faker';

export function novoAluno() {
    const timestamp = Date.now();
    const nome = faker.person.firstName();
    const sobrenome = faker.person.lastName();
    const email = `${nome}.${sobrenome}.${timestamp}@gmail.com`.toLowerCase();
    const matricula = timestamp;
    const senha = faker.string.alpha(6);

    return {
        nome: nome,
        email: email,
        matricula: matricula,
        senha: senha
    };
};