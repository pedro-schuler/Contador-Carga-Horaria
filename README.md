# Contador-Carga-Horaria
Pequeno aplicativo Client-Side para controlar as cargas horárias e turnos de serviço no ambiente do CAIS-RE e TWR-RF.

Por não ser utilizada uma arquitetura servidor-cliente, o aplicativo foi mantido o mais simples possível para que fosse possível utilizá-lo inteiramente no ambiente do browser. Os browsers testados foram o Google Chrome (Versão 55) e Mozilla Firefox (Versão 49), que são os browsers homologados para uso dentro do ambiente do CINDACTA 3.
IMPORTANTE: O APLICATIVO NÃO FOI TESTADO NO IE, PORTANTO PODE APRESENTAR ALGUM MAL FUNCIONAMENTO.

# Página de Configuração

1 - As legendas dos operadores devem ser preenchidas envoltas em aspas e separadas por vírgulas. O padrão utilizado para legendas foi o do CAIS-RE.
Ex: "A","B","C","D"...
Ex.2: "A1","A2","A3","A4","B1","B2","B3"...

2 - O número de dias no mês é um número entre 28 e 31, devendo ser obrigatoriamente um número inteiro positivo. Qualquer outro preenchimento desse campo será ignorado, e apenas a parte inteira será considerada.

3 - O número máximo de operadores por turno é apenas um inteiro positivo, podendo assumir qualquer valor. Entretanto é importante que frisar que a performance da aplicação diminui consideravelmente a medida que novos operadores são inseridos.

4 - As tabelas da aplicação foram construídas para apresentarem 3 turnos, entretanto essa configuração pode ser mudada caso o escalante necessite. Ainda não foi incluída uma funcionalidade que ajuste a apresentação tabular para outros casos.

5 - A quantidade de dígitos na legenda fornece apenas um parâmetro para checagem correta do preenchimento da tabela principal, que contém as legendas dos operadores e os turnos e dias trabalhados.

6 - As cargas horárias devem ser preenchidas como um número fracionário, separados por PONTO. Após o ponto NÃO deve ser inserido o número de minutos , e sim a fração de hora correspondente aos minutos trabalhados.
Correto: 10.25
Errado: 10,25

# Tabela de dias

1 - Calcular: Apresenta em nova página os valores calculados da carga horária e os dias de etapas comuns e etapas eventuais

2 - Salvar Valores: Ao clicar nesse botão será gerado um link de download chamado "Download JSON". É necessário clicar novamente nesse botão para que seja feito o download do arquivo com as legendas e os parâmetros de configuração.

# Orientações gerais

1 - Após o download do arquivo 'dados.json' esse arquivo deverá ser colocado NO MESMO DIRETÓRIO do arquivo 'contagemcargahoraria.html'. Ou seja, o arquivo deverá ser copiado para o diretório raiz da aplicação.

2 - O botão 'Carregar Valores' preenche não apenas a tabela com as legendas dos operadores, como também os parâmetros de configuração salvos no momento que a tabela foi preenchida.

3 - A carga horária computada inclui todos os turnos trabalhados pelo operador, entretanto o cálculo de etapas poderá ser divergente. Como a FAB não paga mais de uma etapa ao dia, será apresentado apenas a etapa eventual (Que possui um valor maior) e a etapa comum será autimaticamente descontada. Não é necessário que o escalante retire manualmente a etapa comum dos dias trabalhados.
Ex: Caso o operador A trabalhe no dia 1 os turnos manhã e noite, o dia 1 aparecerá apenas nas etapas eventuais e não nas etapas comuns.

4 - A tabela final pode ser copiada diretamente no LibreOffice Calc ou Microsoft Excel utilizando o recurso 'colar especial' (No LibreOffice o atalho é ctrl+shift+v). O formato de exibição é o mesmo utilizado nas planilhas de auxílio-alimentação, não precisando de qualquer intervenção do operador.
