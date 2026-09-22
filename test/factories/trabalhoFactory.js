import { faker } from '@faker-js/faker';

export function novoTrabalho() {
    const timestamp = Date.now();
    const titulo = `Título - ${timestamp}`;
    const descricao = faker.lorem.sentence(10)
    
    return {
        titulo: titulo,
        descricao: descricao,
    };
};