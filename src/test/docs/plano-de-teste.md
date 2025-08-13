# Plano de Teste

**Sistema de Gerenciamento de Finanças Pessoais**

## 1 - Introdução

O Sistema de Gerenciamento de Finanças Pessoais é uma aplicação web desenvolvida para ajudar usuários a controlar suas receitas e despesas, estabelecer metas financeiras e gerar relatórios mensais. O sistema permite que os usuários registrem suas transações financeiras, gerenciem contas bancárias, estabeleçam métodos de pagamento e visualizem seus dados através de relatórios interativos, promovendo um melhor controle e organização financeira.

## 2 - Arquitetura
O sistema utiliza uma arquitetura em camadas com Node.js e Express.js para o backend, implementando uma API REST. Para o armazenamento, consulta e alteração de dados da aplicação, utiliza MySQL como banco de dados principal com Prisma ORM para gerenciamento das operações de banco de dados. A arquitetura segue os princípios de separação de responsabilidades com camadas de apresentação (Routes & Controllers), lógica de negócio (Services), acesso a dados (Repositories) e persistência (Database).

## 3 - Categorização dos Requisitos em Funcionais x Não Funcionais

   Requisito Funcional    | Requisito Não Funcional |
-----------|--------|
RF001 – O sistema deve permitir o cadastro de usuários  |  NF001 – O sistema deve ser desenvolvido em Node.js com Express   | 
RF002 – O sistema deve permitir que o usuário realize login  |  NF002 – O banco de dados utilizado deverá ser o MySQL   | 
RF003 – O sistema deve permitir o cadastro de contas financeiras  |  NF003 – O sistema deve responder ao processo de login em 3 segundos ou menos   |
RF004 – O sistema deve permitir a listagem de contas financeiras |  NF004 – O sistema deve ser seguro e proteger os dados dos usuários  |
RF005 – O sistema deve permitir o cadastro de transações (receitas e despesas)   |  NF005 – O sistema deve calcular valores de parcelas e adicionar o restante da divisão à última parcela  |
RF006 – O sistema deve permitir a listagem de transações  |  NF006 – O sistema deve calcular transações recorrentes automaticamente usando cron jobs |
RF007 – O sistema deve permitir a atualização de transações  |  NF007 – O sistema deve permitir busca de transações baseada em filtros aplicados |
RF008 – O sistema deve permitir a remoção de transações  |   |
RF009 – O sistema deve permitir transações parceladas  |   |
RF010 – O sistema deve permitir transações recorrentes  |   |
RF011 – O sistema deve permitir o gerenciamento de métodos de pagamento  |   |
RF012 – O sistema deve permitir transferências entre contas  |   |
RF013 – O sistema deve permitir o estabelecimento de metas financeiras |   |
RF014 – O sistema deve permitir operações administrativas (listagem de todos os usuários, contas e transações) |   |

### Casos de Teste

Funcionalidades   | Comportamento Esperado | Verificações |  Critérios de Aceite  |
-----------|--------|--------|--------| 
Autenticação (Login) |  ● Ao digitar email e senha corretamente o usuário irá logar no sistema. <br> ● O sistema deve retornar um token de acesso válido. <br> ● O token deve ter validade e permitir acesso às rotas protegidas. | ●	Login no sistema com sucesso <br>●	Email inválido <br>●	Campos obrigatórios não preenchidos <br>●	Senha incorreta <br>●	Token de acesso válido gerado <br>●	Validação de formato de email <br>●	Criptografia da senha| ●	Autenticação bem-sucedida com credenciais válidas <br>●	Redirecionamento ou acesso liberado às funcionalidades <br>●	Tempo de resposta dentro do esperado (≤ 3 segundos)

Funcionalidades   | Comportamento Esperado | Verificações |  Critérios de Aceite  |
-----------|--------|--------|--------| 
Gerenciamento de Usuários |  ● Usuários podem ser cadastrados com nome, email e senha. <br> ● Administradores podem listar todos os usuários. <br> ● Usuários podem atualizar seus próprios dados. <br> ● Usuários podem alterar suas senhas. <br> ● Usuários podem ser excluídos do sistema. <br> ● Sistema deve validar unicidade de email.| ●	Cadastro com dados válidos <br>●	Validação de senha forte <br>●	Email único no sistema <br>●	Listagem com paginação <br>●	Busca por filtros (nome, email, ID) <br>●	Atualização de dados pessoais <br>●	Alteração de senha com confirmação <br>●	Exclusão de usuário| ●	Usuário cadastrado com sucesso <br>●	Dados persistidos no banco <br>●	Validações de negócio aplicadas <br>●	Operações CRUD funcionais

Funcionalidades   | Comportamento Esperado | Verificações |  Critérios de Aceite  |
-----------|--------|--------|--------| 
Gerenciamento de Contas |  ● Usuários podem cadastrar contas financeiras (Salário, Corrente, Poupança). <br> ● Contas devem ter nome, tipo, saldo inicial e opcionalmente um ícone. <br> ● Usuários podem listar suas contas com filtros. <br> ● Contas podem ser atualizadas e excluídas. <br> ● Sistema deve validar unicidade de nome e tipo por usuário. | ●	Cadastro de conta com dados válidos <br>●	Validação de tipos de conta <br>●	Saldo inicial numérico <br>●	Nome único por tipo e usuário <br>●	Listagem com paginação <br>●	Filtros por nome, tipo, saldo <br>●	Atualização de dados da conta <br>●	Exclusão de conta| ●	Conta cadastrada e vinculada ao usuário <br>●	Dados persistidos corretamente <br>●	Validações de unicidade aplicadas <br>●	Operações CRUD funcionais

Funcionalidades   | Comportamento Esperado | Verificações |  Critérios de Aceite  |
-----------|--------|--------|--------| 
Gerenciamento de Transações | ● Usuários podem cadastrar transações (receita/despesa). <br> ● Transações devem ter nome, tipo, categoria, valor, data e descrição. <br> ● Suporte a transações parceladas com cálculo automático. <br> ● Suporte a transações recorrentes. <br> ● Transações vinculadas a contas e métodos de pagamento. <br> ● Listagem com filtros diversos. | ●	Cadastro de receita e despesa <br>●	Validação de valor positivo <br>●	Tipos válidos (income/expense) <br>●	Vinculação a conta existente <br>●	Método de pagamento compatível <br>●	Transações parceladas <br>●	Transações recorrentes <br>●	Listagem com filtros <br>●	Atualização e exclusão| ●	Transação cadastrada corretamente <br>●	Cálculos de parcelas precisos <br>●	Recorrência funcionando via cron <br>●	Filtros de busca eficientes <br>●	Integridade referencial mantida

Funcionalidades   | Comportamento Esperado | Verificações |  Critérios de Aceite  |
-----------|--------|--------|--------| 
| Autenticação e Autorização | ● Rotas protegidas devem exigir token válido. <br> ● Usuários só podem acessar seus próprios dados. <br> ● Administradores têm acesso a funcionalidades especiais. | ● Token JWT válido requerido <br> ● Verificação de propriedade de recursos <br> ● Validação de permissões administrativas <br> ● Tratamento de tokens expirados | ● Acesso negado sem autenticação <br> ● Usuários isolados em seus dados <br> ● Administradores com acesso total |
| Validação de Dados  | ● Todos os endpoints devem validar dados de entrada. <br> ● Mensagens de erro claras e específicas. <br> ● Validação de tipos e formatos.     | ● Validação com schemas Zod <br> ● Mensagens de erro descritivas <br> ● Validação de tipos de dados <br> ● Campos obrigatórios verificados | ● Dados inválidos rejeitados <br> ● Respostas de erro informativas <br> ● Sistema robusto contra entradas maliciosas |
| Integridade Referencial   | ● Relacionamentos entre entidades mantidos. <br> ● Cascatas de exclusão configuradas. <br> ● Validação de existência de recursos relacionados.                       | ● Contas vinculadas a usuários <br> ● Transações vinculadas a contas válidas <br> ● Métodos de pagamento válidos <br> ● Exclusões em cascata funcionais            | ● Consistência dos dados garantida <br> ● Relacionamentos íntegros <br> ● Operações atômicas |
| Paginação e Filtros | ● Listagens devem suportar paginação. <br> ● Filtros de busca funcionais. <br> ● Controle de limite de resultados.              | ● Parâmetros de page e limit <br> ● Filtros por múltiplos campos <br> ● Contagem total de registros <br> ● Validação de parâmetros de paginação | ● Performance adequada em listagens <br> ● Busca eficiente <br> ● Experiência de usuário otimizada |

## 4 - Classificação de Bugs

Os Bugs serão classificados com as seguintes severidades:

ID 	| Nível de Severidade |	Descrição 
-----------|--------|--------
1	| Blocker |	●	Bug que bloqueia o teste de uma função ou feature, causa crash na aplicação ou impede completamente o uso do sistema. <br>●	Falha de autenticação que impede login. <br>●	Falha na conexão com banco de dados. <br>●	Endpoint crítico retornando erro 500. <br>●	Bloqueia a entrega. 
2	| Grave |	●	Funcionalidade principal não funciona como esperado. <br>●	Dados financeiros incorretos ou perdidos. <br>●	Falha na validação de segurança. <br>●	Transações não sendo salvas corretamente. <br>●	Cálculos financeiros incorretos.
3	| Moderada |	●	Funcionalidade não atinge certos critérios de aceitação, mas sua funcionalidade em geral não é afetada. <br>●	Filtros de busca não funcionando. <br>●	Paginação com comportamento inesperado. <br>●	Mensagem de erro ou sucesso não é exibida adequadamente. <br>●	Validações de campo faltando.
4	| Pequena |	●	Quase nenhum impacto na funcionalidade, porém atrapalha a experiência do usuário. <br>●	Erro ortográfico em mensagens. <br>●	Formatação inconsistente de dados. <br>●	Pequenos erros de validação. <br>●	Performance ligeiramente abaixo do esperado.

### 5 - Definição de Pronto 
Será considerada pronta as funcionalidades que passarem pelas verificações e testes descritos neste TestPlan, não apresentarem bugs com a severidade acima de Moderada, e passarem por uma validação de negócio de responsabilidade do time de produto. Adicionalmente, todas as funcionalidades devem ter:
- Cobertura de testes de integração implementada
- Validação de dados com schemas Zod funcionando
- Documentação da API atualizada
- Testes automatizados passando sem falhas
- Performance dentro dos critérios estabelecidos (≤ 3 segundos para login)