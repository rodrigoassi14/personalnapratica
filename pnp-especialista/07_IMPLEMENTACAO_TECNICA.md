# GUIA DE IMPLEMENTAÇÃO TÉCNICA

Agnóstico de framework. Respeite a stack existente.

## 1. Inspecione antes de editar
Identifique framework, package manager, rotas, página atual, componentes compartilhados, tokens, assets, depoimentos, CTA/Hotmart, analytics/pixels, quiz e breakpoints.

Não altere stack/dependências sem necessidade.

## 2. Reaproveite a implementação atual
Se substituir a página: preserve rota e componentes.
Se precisar rota separada: reuse por composição, não duplicação cega.

Não decidir domínio/rota sem evidência no projeto.

## 3. Centralize dados
Exemplo conceitual:
```ts
const specialistOffer = {
  productName: "PNP Especialista",
  tagline: "Aprenda a Aplicar",
  accessMonths: 12,
  online: true,
  referencePrice: 3997,
  offerPrice: 1997,
  installments: { count: 12, value: 166.41 },
  first50Price: 997,
  cashbackPreviousCourse: true,
  guaranteeDays: null,
  checkoutUrl: null
}
```
Adapte à stack real.

## 4. Garantia
Não hardcodar 7 dias. Manter componente antigo desativado se útil.

## 5. Checkout
Não inventar URL e não assumir silenciosamente checkout do produto antigo. Centralizar e marcar `TODO: confirmar checkout PNP Especialista`.

Se não houver URL confirmada, preferir âncora interna para oferta ou placeholder seguro no ambiente de desenvolvimento.

## 6. Quiz
Preservar lógica/tracking. Trocar perguntas e resultado. Não parecer diagnóstico médico.

## 7. SEO
Se o projeto usa SEO, atualizar:
- title: `PNP Especialista | Emagrecimento e Definição Muscular`;
- description: `Formação técnica para Personal Trainers e estudantes de Educação Física que querem dominar periodização e construção de programas para emagrecimento e definição muscular.`
- OG equivalente.

Não inventar rating/schema.

## 8. Analytics
Preservar pixels, analytics, eventos e tags. Atualizar labels de produto sem quebrar integrações.

## 9. Acessibilidade
Alt, labels, foco, accordions, contraste, botões e hierarquia de headings.

## 10. Performance
Não adicionar bibliotecas pesadas, assets enormes ou scripts desnecessários.

## 11. Responsividade
Testar pelo menos 375, 768, 1024 e 1440px.

## 12. Escopo
Evitar refactors generalizados. Esta é migração de conteúdo/posicionamento dentro de design existente.
