# Contador-Carga-Horaria
Pequeno aplicativo Client-Side para controlar as cargas horárias e turnos de serviço no ambiente do CAIS-RE e TWR-RF.

Por não ser utilizada uma arquitetura servidor-cliente, o aplicativo foi mantido o mais simples possível para que fosse possível utilizá-lo inteiramente no ambiente do browser. Os browsers testados foram o Google Chrome (Versão 55) e Mozilla Firefox (Versão 49), que são os browsers homologados para uso dentro do ambiente do CINDACTA 3.
IMPORTANTE: O APLICATIVO NÃO FOI TESTADO NO IE, PORTANTO PODE APRESENTAR ALGUM MAL FUNCIONAMENTO.

# Página de Configuração

## Configuração Principal

1 - As legendas dos operadores devem ser preenchidas envoltas em aspas e separadas por vírgulas. O padrão utilizado para legendas foi o do CAIS-RE.
Ex: "A","B","C","D"...
Ex.2: "A1","A2","A3","A4","B1","B2","B3"...

2 - O número de dias no mês é um número entre 28 e 31, devendo ser obrigatoriamente um número inteiro positivo. Qualquer outro valor gerará uma mensagem de erro sendo impossível prosseguir, caso seja utilizado um número fracionário a parte fracionária será desconsiderada  (Ex.: 29.3 se tornará 29).

3 - O número máximo de operadores por turno define quantas quadrículas estarão disponíveis em cada turno da tabela de operadores. Esse campo aceita valores entre 2 e 20. Em teoria não há limite para esse campo, entretanto, por questões de performance, é recomendado que esse número seja o menor possível.

3 - A quantidade máxima de trocas que um operador pode efetuar. Não são consideradas as trocas em que que o operador é proposto, e sim aquelas em que ele é o proponente. Esse valor não impede o registro das trocas, apenas emite um alerta avisando que o operador em questão infringiu o número máximo de trocas previstas pelo órgão. Caso não deseje limitar trocas, utilize "99" na configuração desse campo.

4 - É a carga horária mínima definida na ICA que trata deste assunto, o campo aceita valores entre 100 e 170 horas. Esse campo serve apenas para gerar um alerta para o escalante que um determinado operador não cumpriu com a carga horária mínima estabelecida.

## Configurações Avançadas

1 - O número máximo de turnos é definido por padrão ser 3 turnos por dia. Esse campo não aceita outros valores, ele foi mantido caso surja alguma necessidade especial de dividir os dias em mais turnos, mas as tabelas da aplicação não estão adaptadas para isso.

2 - A quantidade de dígitos na legenda serve para informar à aplicação qual o formato de legendas utilizado. As legendas do CAIS-RE apresentam só um dígito nesse campo, e foi utilizado este padrão.

3 - As cargas horárias diurnas e noturnas devem somar 24 horas, e só aceitam valores dentro desse intervalo, não permitindo números negativos. A parte facrionária das horas deve ser separada por ponto, e não por vírgula.
Correto: 10.25
Errado: 10,25

4 - A FAB só paga uma etapa por dia, seja ela eventual ou comum. Caso o operador trabalhe dois turnos no mesmo dia é dado preferência às etapas eventuais, que remuneram melhor. A aplicação remove automaticamente as etapas comuns nos dias em que houver conflito com as etapas eventuais, mas caso o escalante deseje imprimir na tela todos os dias trabalhados essa função pode ser configurada para "não".

## Botões de configuração

Configurar - São criadas novas tabelas em branco seguindo os valores determinados pelos campos de configuração. É recomendável que se crie uma nova tabela todo mês.

Carregar dados - Caso essa opção seja selecionada os valores de configuração são carregados a partir de um arquivo e os valores definidos na página de configuração serão IGNORADOS. Só utilize essa opção caso tenha certeza que as configurações salvas atendem à sua expectativa.

# Página de Inserção

## Tabela de Operadores

Preenchimento: As quadrículas podem ser preenchidas com a quantidade de dígitos definida na configuração ou carregadas a partir do arquivo salvo. A aplicação rejeitará caso se tente preencher um número maior de dígitos nesses campos. Caso seja preenchido um operador que não conste na configuração de legendas a aplicação recusará a calcular as cargas horárias e apresentará em vermelho o turno em que foi inserido o operador errado.

## Registro de Trocas

Preenchimento: Todos os campos deverão ser preenchidos. Um operador não poderá realizar troca consigo mesmo e as trocas não podem ser efetuadas se o turno do proponente e do proposto for o mesmo. Qualquer troca que atenda esses critérios será salva na lista de trocas, ainda que essa troca cause conflito de turnos com o proponente ou proposto.

Registro: A troca não é salva automaticamente após o preenchimento do formulário, é necessário sempre clica no botão registrar, caso contrário a troca será perdida.

## Botões de cálculo

Carga Horária - Aqui são calculadas as cargas horárias de todos os operadores e as respectivas etapas eventuais e comuns. Não é feita a distinção entre servidores militares e civis, ficando a cargo do escalante definir quais são as informações relevantes em cada caso.

Trocas - Aqui é apresentada a lista de todas as trocas realizadas pelos operadores. As trocas são apresentadas por ordem de proponente, e não por data de registro.

Salvar Dados - Ao clicar nessa função é gerado um link para download do arquivo com as configurações. O download NÃO inicia automaticamente, é necessário clicar novamente no botão, agora chamado de Download, para que seja concluído o salvamento dos dados.

# Orientações gerais

1 - Após o download do arquivo 'dados.json' esse arquivo deverá ser colocado NO MESMO DIRETÓRIO do arquivo 'contagemcargahoraria.html'. Ou seja, o arquivo deverá ser copiado para o diretório raiz da aplicação.

2 - A tabela final pode ser copiada diretamente no LibreOffice Calc ou Microsoft Excel utilizando o recurso 'colar especial' (No LibreOffice o atalho é ctrl+shift+v). O formato de exibição é o mesmo utilizado nas planilhas de auxílio-alimentação, não precisando de qualquer intervenção do operador.
