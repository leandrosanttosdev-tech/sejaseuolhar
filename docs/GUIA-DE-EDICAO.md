# Guia de edição · Seja Seu Olhar

Como trocar textos, fotos, cores, horários e feriados do site, sem precisar ser programador. A apresentação técnica do projeto está no [README](../README.md).

## Como abrir

Dê dois cliques em `index.html`. Ele abre no navegador.

Para editar com recarregamento automático, use o VS Code com a extensão **Live Server** (botão direito no `index.html` e depois "Open with Live Server").

## Estrutura

```
sejaseuolhar/
├── index.html        → todo o conteúdo (textos, seções, links)
├── css/style.css     → visual (cores, fontes, tamanhos, versão celular)
├── js/main.js        → interações (agendamento, calendário, feriados, horários)
├── img/              → imagens
├── video/            → vídeos da seção "Em movimento"
└── docs/             → este guia
```

## O que é clicável

- Menu com rolagem suave até cada seção. O link da seção atual fica sublinhado.
- Menu de celular em tela cheia, que fecha no X ou com a tecla Esc.
- Todos os botões "Agendar" abrem o WhatsApp (11) 96721-3865 com uma mensagem pronta. Para trocar o número ou a mensagem, procure por `wa.me` no `index.html`.
- Na janela de agendamento, a cliente escolhe a data num calendário. Domingo, segunda, dias que já passaram e feriados (nacionais, de Sergipe e de Aracaju) ficam bloqueados, e os feriados do mês aparecem listados embaixo. Dá para escolher até 3 meses à frente. Todos os botões da janela (procedimento, dia, horário, "primeira vez") marcam com um toque e desmarcam com outro toque no mesmo botão.
  - Depois da data, a cliente escolhe o horário (8h30, 9h30, 10h30, 11h30, 13h30, 14h30, 15h30 ou 16h30). Se escolher o dia de hoje, os horários que já passaram ficam bloqueados. Para mudar os horários, procure por `name="horario"` no `index.html` e apague ou copie uma linha.
  - O botão "Outro horário" abre duas rodinhas, como o despertador do celular: a cliente arrasta a hora e os minutos para cima ou para baixo (de 8h30 a 17h30, de 15 em 15 minutos). Horários que não existem ou já passaram ficam riscados, e a rodinha pula sozinha para o mais próximo. O horário escolhido aparece em destaque no topo. Para mudar o primeiro horário, o último ou o intervalo, procure por `OUTRO_HORARIO` no `js/main.js`.
  - Por último, a cliente escreve o nome completo (obrigatório: nome e sobrenome; as iniciais viram maiúsculas sozinhas e "da", "de", "dos" ficam minúsculos), diz se é a primeira vez ou se já é cliente e pode deixar uma observação. Tudo isso vai na mensagem do WhatsApp. O telefone não é pedido porque a Anne já recebe a mensagem do número da cliente. O nome fica guardado no aparelho da cliente para já vir preenchido na próxima vez.
  - Para incluir feriados de 2027, uma folga ou uma viagem: abra `js/main.js`, procure por `FERIADOS` e acrescente uma linha no formato `'2027-01-01': 'Nome do dia',`.
- Os links do Instagram abrem o @sejaseuolhar.
- Antes e depois: dá para arrastar com o mouse ou com o dedo, e também usar as setas do teclado.
- Perguntas frequentes abrem uma de cada vez, com animação.
- O botão flutuante "Agendar" aparece depois do topo e some na chamada final.
- "Role para ver mais" e "Voltar ao topo".
- As seções aparecem com uma animação suave ao rolar a página. A animação é desligada automaticamente para quem configurou o aparelho com menos movimento.

## Animações

- **Abertura:** cortina rosa com "SEJA SEU OLHAR" que sobe e revela o site.
- **Topo:** a foto começa com zoom e se aproxima devagar, com movimento contínuo; o título entra linha por linha; parallax ao rolar; selo giratório "Método UP EYES"; brilho passando no botão principal; contador de seguidoras.
- **Fotos:** todas as fotos (UP EYES, serviços, sobre, Instagram) aparecem com um efeito de cortina e zoom suave. Nos serviços e no Instagram, a foto dá zoom ao passar o mouse.
- **Faixa em movimento** com os serviços, logo depois dos selos.
- **Antes e depois:** a barra desliza sozinha uma vez para mostrar que dá para arrastar.
- Cartões com brilho rosa que segue o mouse, barra de progresso no topo e luz rosa em movimento na chamada final.

Para uma foto nova ganhar o efeito de cortina, coloque `img-reveal` na classe dela.

## Vídeos (seção "Em movimento")

Fica logo depois do antes e depois e **está oculta** enquanto os vídeos não chegam. Para ativar:

1. Salve na pasta `video/` os arquivos abaixo.
2. No `index.html`, procure por `id="videos" hidden` e apague a palavra `hidden`.

- `reel-1.mp4` e `reel-2.mp4`
- vertical (formato Reels), 720p, de 8 a 15 segundos e **menos de 4 MB cada** (comprima no HandBrake ou no freeconvert.com)

Para não pesar no celular:

- o vídeo só baixa quando a cliente chega perto da seção;
- toca sem som e só enquanto está na tela, pausando ao sair;
- com internet lenta ou modo de economia de dados, não baixa sozinho: aparece um botão de play;
- o botão no canto liga o som (um vídeo com som por vez).

**Para tirar a seção:** no `index.html`, apague do comentário `VÍDEOS (EM MOVIMENTO)` até `FIM VÍDEOS`.

## Segurança: serviços externos liberados

Cada página (`index.html`, `mentoria.html`, `privacidade.html` e `404.html`) tem no começo uma linha `Content-Security-Policy`. Ela só deixa o site carregar arquivos dele mesmo, do Google Fonts e do Google Maps, o que impede scripts estranhos de rodarem.

**Se for incluir um serviço novo** (Google Analytics, Pixel do Facebook, outro mapa, vídeo do YouTube...), libere o endereço dele nessa linha, em todas as páginas. Senão, o navegador bloqueia o serviço sem avisar. Pelo mesmo motivo, scripts e estilos novos devem ficar nos arquivos `.js` e `.css`, e não escritos dentro do HTML (nada de `<script>` com código, `<style>` ou `style="..."`): o navegador bloqueia.

## Página da mentoria (prévia)

A `mentoria.html` ainda tem textos, preços, turmas e depoimentos de exemplo. Por isso:

- ela está no `.gitignore` (junto com `css/mentoria.css` e `js/mentoria.js`) e não vai para o GitHub;
- o botão "Mentoria" do menu e a chamada para a mentoria no `index.html` estão com `hidden`.

**Para publicar:** confirme os dados reais com a Anne (depoimentos só com autorização das alunas), tire as 3 linhas do `.gitignore`, apague o selo "Prévia de teste" da página, tire os dois `hidden` do `index.html` e inclua a página no `sitemap.xml`.

## Página de erro (404)

A `404.html` aparece quando alguém abre um endereço que não existe. Os caminhos dela começam com `/sejaseuolhar/`. Se o site ganhar domínio próprio, troque nas linhas marcadas com `(URL)`.

## Privacidade

A página `privacidade.html` explica à cliente o que acontece com os dados dela. Se o site passar a coletar algo novo (e-mail, telefone, formulário com servidor, Analytics), atualize o texto e a data no topo da página.

## Como trocar as cores

No começo de `css/style.css`, altere as variáveis:

```css
--rosa: #C2006B;       /* cor dos botões e destaques */
--preto: #1F1A1C;      /* seções escuras */
--fundo: #F8F4F1;      /* fundo da página (off-white quente) */
```

## Como colocar as fotos

1. Salve as fotos na pasta `img/`. Nomes sugeridos:
   - `up-eyes-principal.jpg` e `up-eyes-detalhe.jpg`
   - `servico-cilios.jpg`, `servico-up-eyes.jpg`, `servico-nanopigmentacao.jpg` e `servico-brow-lamination.jpg`
   - `antes-cilios.jpg` e `depois-cilios.jpg` (e os outros pares de antes e depois)
   - `sobre.jpg`
   - `insta-1.jpg` até `insta-6.jpg` (quadradas, 1080x1080) para a seção "No Instagram"
2. No `index.html`, procure os comentários `<!-- FOTO: ... -->`. Cada um mostra exatamente a linha que deve substituir a `div` de marcação logo abaixo dele.

Exemplo:

```html
<!-- antes -->
<div class="service-img placeholder placeholder-dark">Foto do resultado</div>

<!-- depois -->
<img src="img/servico-cilios.jpg" alt="Extensão de cílios" class="service-img">
```

No antes e depois, as duas fotos de cada par precisam ter o mesmo enquadramento e o mesmo ângulo:

```html
<div class="ba-after"><img src="img/depois-cilios.jpg" alt="Depois" class="ba-img"></div>
<div class="ba-before"><img src="img/antes-cilios.jpg" alt="Antes" class="ba-img"></div>
```

Dica: deixe cada foto com menos de 300 KB (use o tinypng.com) para o site carregar rápido no celular.

## O que ainda falta preencher

Procure por `[` no `index.html`. Os textos entre colchetes são espaços para completar:

- Preços e duração de cada serviço
- O 3º ponto do Método UP EYES (o diferencial)
- A história da profissional em "Oi, eu sou"
- Depoimentos reais

O nome da profissional no site é **Anne Silva**. A logo do menu agora é feita em texto (classe `.logo` no `index.html`) e o ícone da aba é o `img/favicon.svg`. Os arquivos antigos `img/logo.jpg` e `img/favicon.png` (com o nome Thalita Caetano) não são mais usados.

## Para publicar

**O site já está no ar pelo GitHub Pages:** https://leandrosanttosdev-tech.github.io/sejaseuolhar/
(repositório: github.com/leandrosanttosdev-tech/sejaseuolhar)

Para atualizar depois de mudar algo, abra o terminal nesta pasta e rode:

```
git add -A
git commit -m "fix: descreva a mudança"
git push
```

Em 1 ou 2 minutos o site publicado é atualizado. Comece a mensagem com `feat:` (novidade), `fix:` (correção), `style:` (visual) ou `docs:` (textos de documentação). Veja o padrão completo no [README](../README.md#padrão-de-commits).

Se mudar o `css/style.css` ou o `js/main.js`, aumente o número depois de `?v=` nas duas linhas do `index.html` que chamam esses arquivos. Assim o celular das clientes baixa a versão nova.

Outras opções:

Arraste a pasta inteira para o **Netlify Drop** (app.netlify.com/drop) ou use Vercel ou GitHub Pages. Depois é só ligar um domínio próprio, como sejaseuolhar.com.br.

### Prévia do link (WhatsApp, Instagram, Facebook)

Ao compartilhar o link, aparece a imagem `img/compartilhar.jpg` com título e descrição. Para funcionar:

1. No começo do `index.html`, troque `https://sejaseuolhar.com.br/` pelo endereço real do site nas 3 linhas marcadas com `(URL)`.
2. Publique e cole o link no **developers.facebook.com/tools/debug** e clique em "Extrair novamente". Isso atualiza a prévia no WhatsApp, Instagram e Facebook.
3. O WhatsApp guarda a prévia antiga por um tempo. Se testar antes de ajustar, espere algumas horas ou mande o link com `?v=2` no final.

O ícone que aparece quando alguém salva o site na tela inicial do celular é o `img/icone-celular.png`.
