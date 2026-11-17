# Site com animação de abertura

Página estática (HTML + CSS + JavaScript puro, sem dependências). Ao abrir, aparece a animação
de um esfíncter estilizado, com fissuras anais, que se dilata e revela um carrossel de fotos.

```
index.html        estrutura da página
css/style.css     visual do carrossel e da camada da animação
js/intro.js       animação de abertura (canvas): paleta, fissuras e tempos
js/carousel.js    carrossel de fotos
img/foto1.jpg     primeira foto do carrossel (até foto5)
```

Para ver no computador, basta abrir `index.html` no navegador.

## Fotos do carrossel (até 5)

Coloque as fotos na pasta `img` com os nomes **`foto1`, `foto2`, `foto3`, `foto4` e `foto5`**,
em `.jpg`, `.jpeg`, `.png` ou `.webp`, com o nome e a extensão em minúsculas
(por exemplo `img/foto2.jpg`). Não precisa mexer em código: o site encontra sozinho as fotos que
existirem e mostra na ordem do número. Para tirar uma foto, apague o arquivo.

- Com 1 foto, ela aparece sozinha, sem setas.
- Com 2 ou mais, aparecem setas e bolinhas. Também dá para deslizar com o dedo ou usar as
  setas do teclado. Da última foto, o carrossel volta para a primeira.
- Cada foto fica inteira (sem cortes). O que sobra da tela é preenchido com a própria foto,
  ampliada e desfocada.
- Descrição para leitores de tela: em `js/carousel.js`, em `alts`, pelo número da foto.

## Ajustes da animação

No início de `js/intro.js`:

**`CONFIG`**

| opção | padrão | efeito |
|---|---|---|
| `holdMs` | `700` | tempo fechado (com uma leve contração) antes de abrir |
| `openMs` | `1500` | duração da dilatação |
| `folds` | `11` | número de pregas |
| `fissures` | posterior + anterior | lista de fissuras (veja abaixo) |
| `onlyOncePerSession` | `false` | `true` mostra a animação só na primeira visita da sessão |

Cada fissura tem `angle` (em graus: `90` = 6 horas/posterior, `270` = 12 horas/anterior),
`length` e `width` (multiplicam o tamanho padrão) e `sentinel` (`true` desenha o plicoma
sentinela na ponta). Para tirar uma fissura, apague a linha dela; para nenhuma, use `fissures: []`.

**`PALETTE`**: todas as cores da animação. `skin` é o tom de pele, do centro para fora; as
demais cores (sulcos, brilho, sombras, fissura, plicoma) estão comentadas no código. Se mudar o
tom de pele, ajuste também o `background` de `.has-intro .intro` em `css/style.css`: é a cor que
aparece por uma fração de segundo antes de a animação começar.

Também:

- O visitante pode pular a animação com o botão **Pular animação**, clicando na tela ou com Esc/Enter.
- Quem usa a opção de **reduzir movimento** do sistema vê as fotos direto.
- Sem JavaScript, aparece direto a `foto1.jpg`. Se algo falhar, a camada some sozinha após 8 s.

## Publicação

Por ser estático, funciona em qualquer hospedagem: GitHub Pages, Netlify, Vercel ou a hospedagem
do seu domínio (é só enviar os arquivos).
