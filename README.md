<div align="center">

# Seja Seu Olhar

**Landing page do estúdio Seja Seu Olhar: extensão de cílios, Método UP EYES, nanopigmentação e brow lamination em Aracaju-SE.**

[![Site no ar](https://img.shields.io/badge/site-no%20ar-C2006B?style=flat-square)](https://leandrosanttosdev-tech.github.io/sejaseuolhar/)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Sem dependências](https://img.shields.io/badge/depend%C3%AAncias-0-1F1A1C?style=flat-square)

[**Ver o site**](https://leandrosanttosdev-tech.github.io/sejaseuolhar/) · [Guia de edição](docs/GUIA-DE-EDICAO.md) · [Histórico de versões](CHANGELOG.md)

</div>

---

## Sobre o projeto

Site de uma página, focado em conversão: a visitante conhece os procedimentos, vê resultados e agenda pelo WhatsApp em poucos toques. Feito com HTML, CSS e JavaScript puros, sem frameworks nem etapa de build, para carregar rápido no celular e ser simples de manter.

## Funcionalidades

- **Agendamento guiado:** janela com escolha do procedimento, calendário, horário e dados da cliente. No fim, abre o WhatsApp com a mensagem pronta.
  - Calendário que bloqueia domingos, segundas, datas passadas e feriados nacionais, de Sergipe e de Aracaju.
  - Horários prontos e um seletor em roleta (estilo despertador) para escolher outro horário.
  - Validação de nome completo, com formatação automática das iniciais.
- **Responsivo:** testado de celulares pequenos (320px) e Galaxy Fold até monitores grandes, incluindo celular deitado e iPad.
- **Antes e depois** com controle de arrastar (mouse, toque e teclado).
- **Vídeos sob demanda:** só baixam perto da seção e respeitam o modo de economia de dados.
- **Acessibilidade:** navegação por teclado, rótulos ARIA e suporte a `prefers-reduced-motion`.
- **SEO e compartilhamento:** metadados Open Graph, dados estruturados (Schema.org) e ícones para a tela inicial.
- **Segurança e privacidade:** política de segurança de conteúdo (CSP) que só libera o próprio site, o Google Fonts e o Google Maps; nenhum dado sai do aparelho sem a cliente tocar em enviar no WhatsApp; [política de privacidade](privacidade.html) conforme a LGPD.

## Tecnologias

| Camada | Uso |
| --- | --- |
| HTML5 semântico | Estrutura e conteúdo |
| CSS3 | Layout com Grid e Flexbox, variáveis de tema, animações e scroll-snap |
| JavaScript (ES5+) | Interações sem bibliotecas externas, compatível com navegadores antigos |
| GitHub Pages | Hospedagem e publicação contínua a partir da branch `main` |

## Estrutura

```
.
├── index.html            # Conteúdo e marcação da página
├── privacidade.html      # Política de privacidade (LGPD)
├── 404.html              # Página de erro para endereços inexistentes
├── sitemap.xml           # Lista de páginas para o Google
├── css/
│   └── style.css         # Estilos, tema e responsividade
├── js/
│   └── main.js           # Interações (menu, agendamento, calendário, vídeos…)
├── img/                  # Imagens e ícones
├── video/                # Vídeos da seção "Em movimento"
└── docs/
    └── GUIA-DE-EDICAO.md # Como trocar textos, fotos, cores, horários e feriados
```

## Rodando localmente

Não há dependências para instalar.

```bash
git clone https://github.com/leandrosanttosdev-tech/sejaseuolhar.git
cd sejaseuolhar
```

Abra o `index.html` no navegador ou use um servidor local, por exemplo a extensão **Live Server** do VS Code:

```bash
npx serve .
```

## Publicação

Todo push na branch `main` publica o site automaticamente pelo GitHub Pages em 1 ou 2 minutos.

Ao alterar `css/style.css` ou `js/main.js`, aumente o número de versão (`?v=`) nas referências do `index.html`. Assim os navegadores baixam os arquivos novos em vez de usar a cópia antiga guardada.

## Padrão de commits

O projeto segue o [Conventional Commits](https://www.conventionalcommits.org/pt-br/):

| Tipo | Quando usar |
| --- | --- |
| `feat` | Nova funcionalidade |
| `fix` | Correção de problema |
| `style` | Ajuste visual, sem mudar comportamento |
| `docs` | Documentação |
| `chore` | Configuração e manutenção |

Exemplo: `feat(agendamento): adiciona escolha de horário`

## Licença

Código de uso exclusivo. Textos, marca e imagens pertencem ao estúdio Seja Seu Olhar. Veja [LICENSE](LICENSE).

---

<div align="center">
Desenvolvido por <a href="https://github.com/leandrosanttosdev-tech">Leandro Santos</a>
</div>
