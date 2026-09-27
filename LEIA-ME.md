# Seja Seu Olhar · Landing page

Site de uma página, responsivo (computador, tablet e celular), feito só com HTML, CSS e JavaScript puro. Não precisa instalar nada.

## Como abrir

Dê dois cliques em `index.html`. Ele abre no navegador.

Para editar com recarregamento automático, use o VS Code com a extensão **Live Server** (botão direito no `index.html` e depois "Open with Live Server").

## Estrutura

```
seja-seu-olhar-site/
├── index.html        → todo o conteúdo (textos, seções, links)
├── css/style.css     → visual (cores, fontes, tamanhos, versão celular)
├── js/main.js        → interações
└── img/              → imagens
    ├── foto-principal.jpg
    ├── logo.jpg
    └── favicon.png
```

## O que é clicável

- Menu com rolagem suave até cada seção. O link da seção atual fica sublinhado.
- Menu de celular em tela cheia, que fecha no X ou com a tecla Esc.
- Todos os botões "Agendar" abrem o WhatsApp (11) 96721-3865 com uma mensagem pronta. Para trocar o número ou a mensagem, procure por `wa.me` no `index.html`.
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

Fica logo depois do antes e depois. Para os vídeos aparecerem, salve na pasta `video/`:

- `reel-1.mp4` e `reel-2.mp4`
- vertical (formato Reels), 720p, de 8 a 15 segundos e **menos de 4 MB cada** (comprima no HandBrake ou no freeconvert.com)

Enquanto o arquivo não existir, aparece o espaço reservado. Para não pesar no celular:

- o vídeo só baixa quando a cliente chega perto da seção;
- toca sem som e só enquanto está na tela, pausando ao sair;
- com internet lenta ou modo de economia de dados, não baixa sozinho: aparece um botão de play;
- o botão no canto liga o som (um vídeo com som por vez).

**Para tirar a seção:** no `index.html`, apague do comentário `VÍDEOS (EM MOVIMENTO)` até `FIM VÍDEOS`.

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

Arraste a pasta inteira para o **Netlify Drop** (app.netlify.com/drop) ou use Vercel ou GitHub Pages. Depois é só ligar um domínio próprio, como sejaseuolhar.com.br.

### Prévia do link (WhatsApp, Instagram, Facebook)

Ao compartilhar o link, aparece a imagem `img/compartilhar.jpg` com título e descrição. Para funcionar:

1. No começo do `index.html`, troque `https://sejaseuolhar.com.br/` pelo endereço real do site nas 3 linhas marcadas com `(URL)`.
2. Publique e cole o link no **developers.facebook.com/tools/debug** e clique em "Extrair novamente". Isso atualiza a prévia no WhatsApp, Instagram e Facebook.
3. O WhatsApp guarda a prévia antiga por um tempo. Se testar antes de ajustar, espere algumas horas ou mande o link com `?v=2` no final.

O ícone que aparece quando alguém salva o site na tela inicial do celular é o `img/icone-celular.png`.
