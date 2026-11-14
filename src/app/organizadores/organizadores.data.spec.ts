import { EVENTOS } from '../eventos/eventos.data';
import { ORGANIZADORES } from './organizadores.data';

// Os dados são de vocês: este teste pega o evento cujo organizador ninguém
// cadastrou — o link "Organiza" dele daria na 404.
describe('organizadores', () => {
  it('todo evento aponta para um organizador que existe', () => {
    const slugs = ORGANIZADORES.map((o) => o.slug);
    const semOrganizador = EVENTOS.filter((e) => !slugs.includes(e.organizadorSlug)).map((e) => e.slug);
    expect(semOrganizador).toEqual([]);
  });
});
