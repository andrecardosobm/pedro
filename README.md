# Site com animação de abertura

Página estática (HTML + CSS + JavaScript puro, sem dependências). Ao abrir, aparece a animação
de um esfíncter estilizado que se dilata e revela a imagem que ocupa a página.

```
index.html      estrutura da página
css/style.css   visual da página e da camada da animação
js/intro.js     animação de abertura (canvas)
img/imagem.jpg  a imagem que aparece depois da animação
```

Para ver no computador, basta abrir `index.html` no navegador.

## Trocar a imagem

Substitua o arquivo `img/imagem.jpg` por outro com o mesmo nome. A imagem fica centralizada,
inteira (sem cortes) e com fundo branco. Se a nova imagem tiver outro fundo, troque o
`background` de `body` em `css/style.css`.

## Ajustes da animação

No início de `js/intro.js`, em `CONFIG`:

| opção | padrão | efeito |
|---|---|---|
| `holdMs` | `700` | tempo fechado (com uma leve contração) antes de abrir |
| `openMs` | `1500` | duração da dilatação |
| `folds` | `11` | número de pregas |
| `onlyOncePerSession` | `false` | `true` mostra a animação só na primeira visita da sessão |

Também:

- O visitante pode pular a animação com o botão **Pular animação**, clicando na tela ou com Esc/Enter.
- Quem usa a opção de **reduzir movimento** do sistema vê a imagem direto.
- Sem JavaScript, a imagem aparece direto. Se algo falhar, a camada some sozinha após 8 s.

## Publicação

Por ser estático, funciona em qualquer hospedagem: GitHub Pages, Netlify, Vercel ou a hospedagem
do seu domínio (é só enviar os arquivos).
