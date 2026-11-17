# Site — Coloproctologia

Site estático (HTML + CSS + JavaScript puro, sem dependências). Ao abrir:

1. animação de abertura: um esfíncter estilizado que se dilata;
2. a abertura revela a tela de boas-vindas, com a foto do médico;
3. o botão **Entrar no site** leva à página principal.

```
index.html      conteúdo da página (inclui a tela de boas-vindas)
css/style.css   visual do site, da animação e das boas-vindas
js/intro.js     animação de abertura (canvas) e botão "Entrar no site"
img/medico.jpg  foto do médico (você adiciona; veja abaixo)
```

Para ver no computador, basta abrir `index.html` no navegador.

## Foto do médico

Salve a foto como **`img/medico.jpg`** (pasta `img`, nome exatamente `medico.jpg`, em minúsculas).
Não precisa mexer em nenhum código: a mesma foto aparece na tela de boas-vindas (em círculo) e na
seção **Sobre** (em retângulo vertical). Enquanto o arquivo não existir, aparecem as iniciais.

Use uma foto só do médico, com o rosto centralizado, de pelo menos 800 × 800 pixels.
Se a foto for `.png`, troque `medico.jpg` por `medico.png` nas duas linhas do `index.html`
que têm `src="img/medico.jpg"`.

## O que trocar antes de publicar

Procure no `index.html` pelos textos de exemplo (aparecem também na tela de boas-vindas):

- `Dr. Nome Sobrenome`, as iniciais `NS`, `CRM-UF 000000` e `RQE 00000`
- `[Cidade – UF]`, endereço, telefone e horário
- `5500000000000` nos links do WhatsApp (formato: 55 + DDD + número, só dígitos)
- Os trechos entre colchetes `[...]` em **Sobre** e **Dúvidas**

Os textos de saúde (sinais de alerta, tratamentos e dúvidas) são um ponto de partida. Revise-os.

## Ajustes da animação

No início de `js/intro.js`, em `CONFIG`:

| opção | padrão | efeito |
|---|---|---|
| `holdMs` | `700` | tempo fechado (com uma leve contração) antes de abrir |
| `openMs` | `1500` | duração da dilatação |
| `folds` | `11` | número de pregas |
| `welcome` | `true` | `false` remove a tela de boas-vindas e vai direto para o site |
| `onlyOncePerSession` | `false` | `true` mostra animação e boas-vindas só na primeira visita da sessão |

Também:

- O visitante pode pular a animação com o botão **Pular animação**, clicando na tela ou com Esc/Enter.
  Nesse caso ele vai para a tela de boas-vindas.
- Na tela de boas-vindas, o botão **Entrar no site** (ou a tecla Esc) leva à página principal.
- Quem usa a opção de **reduzir movimento** do sistema vê as boas-vindas sem a animação.
- Sem JavaScript, o site aparece direto. Se a animação falhar, a camada some sozinha após 8 s.

## Publicação

Por ser estático, funciona em qualquer hospedagem: GitHub Pages, Netlify, Vercel ou a hospedagem
do seu domínio (é só enviar os arquivos).
