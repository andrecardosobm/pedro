# Site — Coloproctologia

Site estático (HTML + CSS + JavaScript puro, sem dependências) com uma animação de abertura:
um esfíncter estilizado que se dilata e revela a página inicial.

```
index.html      conteúdo da página
css/style.css   visual do site e da camada da animação
js/intro.js     animação de abertura (canvas)
```

Para ver no computador, basta abrir `index.html` no navegador.

## O que trocar antes de publicar

Procure no `index.html` pelos textos de exemplo:

- `Dr. Nome Sobrenome`, as iniciais `NS`, `CRM-UF 000000` e `RQE 00000`
- `[Cidade – UF]`, endereço, telefone e horário
- `5500000000000` nos links do WhatsApp (formato: 55 + DDD + número, só dígitos)
- Os trechos entre colchetes `[...]` em **Sobre** e **Dúvidas**
- A foto: troque o bloco `.about__photo` por `<img src="img/foto.jpg" alt="...">`

Os textos de saúde (sinais de alerta, tratamentos e dúvidas) são um ponto de partida. Revise-os.

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
- Quem usa a opção de **reduzir movimento** do sistema vai direto para o site.
- Sem JavaScript, o site aparece direto. Se algo falhar, a camada some sozinha após 8 s.

## Publicação

Por ser estático, funciona em qualquer hospedagem: GitHub Pages, Netlify, Vercel ou a hospedagem
do seu domínio (é só enviar os arquivos).
