# Status Report Refactor - TODO

## Funcionalidades Principais

- [x] Estrutura do dashboard com layout principal
- [x] Componentes de abas (Status das Demandas, Entregas Previstas, Equipe CRM)
- [x] Gráfico de distribuição por status (Pie Chart)
- [x] Tabela de demandas com filtros
- [x] Upload de arquivo Excel com mapeamento de "Fase Atual"
- [x] Download do template Excel
- [x] Exportação de dados para Excel
- [x] Atualização automática do dashboard após upload
- [x] Persistência de dados no localStorage
- [x] Responsividade e design visual

## Bugs Conhecidos

- Nenhum no momento

## Notas

- Usar XLSX para leitura/escrita de arquivos Excel
- Mapeamento de "Fase Atual": Backlog, Refinamento, Estimativa, Aprovação, Desenvolvimento, Homologação, Deploy, Implementadas
- Dados de exemplo incluem 30 demandas ativas
