$( document ).ready(function() {

  /*************************************
  var legendasOperadores guarda apenas as legendas que serão utilizadas nos
  cálculos.

  var operador guarda o objeto operador com suas 3 propriedades

  *************************************/
  var legendasOperadores = ["A","B","C","D","E","F","G","H","I","J",
                            "K","L","M","N","O","P","Q","R","S","T"];

  var arrayTabelaDias = [];

  var arrayRegistroTrocas = [];

  var operador = [];

  var configuracao = {
    numeroDias: 31,
    numeroTurnos: 3,
    numeroOperadoresPorTurno: 5,
    digitosLegendas: 1,
    cargaHorariaDiurna: 7.25,
    cargaHorariaNoturna: 10.25,
    quantidadeTrocas: 6,
    cargaHorariaMinima: 144,
    removerEtapasComuns: "true"
  };

  /*************************************
  Isso é um polyfill pra garantir que a função de checagem de inteiros está
  disponível para nosso validador de inputs.
  *************************************/
  Number.isInteger = Number.isInteger || function(valor) {
    return typeof valor === "number" && 
                  isFinite(valor) && 
                  Math.floor(valor) === valor;
  };

  /*************************************
  Essa função recebe o valor do input do usuário e confirma se ele é do
  tipo (int ou float) correto e se está dentro do intervalo esperado. Além
  de receber o nome do campo que está sendo avaliado para exibição correta
  dos alertas na tela.
  *************************************/
  function validarInputConfiguracao(input,tipo,minimo,maximo,campo){

    if (tipo === "int"){

      if (isNaN(input)){
        alert("O valor de " + campo + " precisa ser um número");
        return -1;
      }

      if (!Number.isInteger(input)){
        alert("O valor de " + campo + " precisa ser um número inteiro");
        return -1;
      }

    }

    if (tipo === "float"){

      if (isNaN(input)){
        alert("O valor de " + campo + " precisa ser um número");
        return -1;
      }

    }

    if (input < minimo){
      alert("O valor de " + campo + " precisa ser um número entre " + minimo +
            " e " + maximo);
      return -1;
    }

    if (input > maximo){
      alert("O valor de " + campo + " precisa ser um número entre " + minimo +
            " e " + maximo);
      return -1;
    }

    return 1;

  }

  /*************************************
  Essa função recebe todos os inputs inseridos na página de configurações e valida
  de acordo com as regras estabelecidas
  Caso algum dos valores não obedeça aos parâmetro a função retorna -1.
  *************************************/
  function validarConfiguracao(nDias,nTurnos,nOperadores,nLegendas,nDiurna,nNoturna,nTrocas,nCargaMinima){

    var n_dias        = validarInputConfiguracao(nDias,"int",28,31,"número de dias");
    /*var n_turnos      = validarInputConfiguracao(nTurnos,"int",3,3,"número de turnos");*/
    var n_turnos      = 1;
    var op_turnos     = validarInputConfiguracao(nOperadores,"int",2,20,"número de operadores");
    var digit_legenda = validarInputConfiguracao(nLegendas,"int",1,3,"dígitos das legendas");
    var carga_diurna  = validarInputConfiguracao(nDiurna,"float",0,24,"carga horária diurna");
    var carga_noturna = validarInputConfiguracao(nNoturna,"float",0,24,"carga horária noturna");
    var n_trocas      = validarInputConfiguracao(nTrocas,"int",1,99,"quantidade trocas");
    var carga_min     = validarInputConfiguracao(nCargaMinima,"float",100,170,"carga horária mínima");

    if (n_dias === 1 && n_turnos === 1 && op_turnos === 1 && digit_legenda === 1 && carga_diurna === 1 && 
        carga_noturna === 1 && n_trocas === 1 && carga_min === 1) {

      return 1;

    }
    else{
      return -1;
    }

  }

  /*************************************
  Essa função recebe o array tabela dias e verifica se os operadores inseridos
  obedecem as regras definidas nas ICAS.
  A função também pode verificar se a troca inserida no formulário não gera conflitos
  com a escala proposta. Pra isso é necessário passar o argumento 'trocas' como true
  *************************************/
  function validarInputOperadores(arrayInputTabelaDias,arrayOperadores,n_dias,n_turnos,n_operadores,troca){

    /*************************************
    O arrayTabelaDias é acessado da forma:
    arrayTabelaDias[i][j][k]

    Onde i = número do dia (1->configuracao.numeroDias)
         j = número do turno (1->configuracao.numeroTurnos)
         k = posição do operador (1->configuracao.numeroOperadoresPorTurno)
    *************************************/

    /*Esse for checa se todos os usuários inseridos existem*/
    for (var i = 1; i <= n_dias; i++) {
      for (var j = 1; j <= n_turnos; j++) {
        for (var k = 1; k <= n_operadores; k++) {

          var legendaTestada  = arrayInputTabelaDias[i][j][k];
          var operadorExiste  = arrayOperadores.indexOf(legendaTestada);

          if (operadorExiste === -1){

            if (legendaTestada === ""){
              continue;
            }
            else{
              alert("Você inseriu um usuário não cadastrado no dia " + i);
              $( "#linhaTurno" + i + j ).addClass( "danger" );
              return -1;
            }

          }

        }
      }
    }

    /*Esse for checa se um operador foi inserido duas vezes no mesmo turno*/
    for (var i = 1; i <= n_dias; i++) {
      for (var j = 1; j <= n_turnos; j++) {
        for (var k = 1; k <= n_operadores; k++) {

          var legendaTestada = arrayInputTabelaDias[i][j][k];

          if (legendaTestada === ""){
            continue;
          }
          else{

            for (var l = k + 1; l <= n_operadores; l++) {

              var outrasLegendas = arrayInputTabelaDias[i][j][l];

              if (outrasLegendas === legendaTestada){
                if (troca){

                  alert("A troca não pode ser efetuada devido à um choque de turnos");
                  return -1;

                }
                else{

                  alert("Você inseriu a legenda " + legendaTestada + " mais de uma vez no dia " + i);
                  $( "#linhaTurno" + i + j ).addClass( "danger" );
                  return -1;

                }
          
              }

            }

          }

        }
      }
    }

    /*Esse for checa se um Usuário foi inserido em turnos adjacentes*/
    for (var i = 1; i <= n_dias; i++) {
      for (var j = 1; j <= n_turnos; j++) {
        for (var k = 1; k <= n_operadores; k++) {

          var legendaTestada = arrayInputTabelaDias[i][j][k];

          if (legendaTestada === ""){
            continue;
          }
          else{

            for (var l = 1; l <= n_operadores; l++) {

              var turnoAdjacente = j+1;

              if (turnoAdjacente === 4){

                var diaAdjacente = i + 1;

                var outrasLegendas = arrayInputTabelaDias[diaAdjacente][1][l];

                if (outrasLegendas === legendaTestada){
                  if (troca){

                    alert("A troca não pode ser efetuada devido à um choque de turnos");
                    return -1;

                  }
                  else{

                    alert("Você inseriu a legenda " + legendaTestada + " em turnos ajacentes");
                    $( "#linhaTurno" + i + j ).addClass( "danger" );
                    $( "#linhaTurno" + diaAdjacente + 1 ).addClass( "danger" );
                    return -1;

                  }
          
                }

              }
              else{

                var outrasLegendas = arrayInputTabelaDias[i][turnoAdjacente][l];

                if (outrasLegendas === legendaTestada){
                  if (troca){

                    alert("A troca não pode ser efetuada devido à um choque de turnos")

                  }
                  else{

                    alert("Você inseriu a legenda " + legendaTestada + " em turnos ajacentes");
                    $( "#linhaTurno" + i + j ).addClass( "danger" );
                    $( "#linhaTurno" + i + turnoAdjacente ).addClass( "danger" );
                    return -1;

                  }
                  
                }

              }

            }

          }

        }
      }
    }

    return 1;

  }

  
  /*************************************
  Essa função verifica todos os campos do formulário de trocas e impede o registro
  caso algum dos campos não tenha sido preenchido, o proponente seja o mesmo
  que o proposto, os turnos propostos sejam os mesmos ou que a mesma troca já
  tenha sido registrada.
  *************************************/
  function validarFormularioTroca(proponente,proposto,diaProponente,diaProposto,turnoProponente,turnoProposto,arrayRegistroTrocas){

    if (proponente === "" || proposto === "" || diaProponente === "" ||
        diaProposto === "" || turnoProponente === "" || turnoProposto === ""){
      alert("Todos os campos precisam ser preenchidos");
      return -1;
    }

    if (proponente === proposto){
      alert("O proponente não pode ser o mesmo que o proposto")
      return -1;
    }

    if (diaProponente === diaProposto && turnoProponente === turnoProposto){
      alert("A troca precisa ser feita entre turnos distintos")
      return -1;
    }

    for (var i = 0; i < arrayRegistroTrocas.length; i++) {

      if (  arrayRegistroTrocas[i].proponente === proponente &&
            arrayRegistroTrocas[i].proposto === proposto &&
            arrayRegistroTrocas[i].diaProponente === diaProponente &&
            arrayRegistroTrocas[i].diaProposto === diaProposto &&
            arrayRegistroTrocas[i].turnoProponente === turnoProponente &&
            arrayRegistroTrocas[i].turnoProposto === turnoProposto){

        alert("Esta troca já foi registrada");
        return -1;

      }

    }

    return 1;

  }
  /*************************************
  Essa função cria a tabela que será utilizada para o input de dados.
  Foi necessário algum voodoo pra fazer funcionar, não olhe!
  *************************************/
  function criarTabelaDias(qtdeDias,qtdeTurnos,opTurno,qtdeLegendas){

    var aux = $( "#tabelaCargaHoraria");

    aux.append( "<tbody>" );

    for (var i = 1; i < qtdeDias + 1; i++) {

      aux.append( "<tr><td id='linhaDia" + i + "'>Dia " + i +"</td></tr>" );

      for (var j = qtdeTurnos; j > 0; j--) {

        $( "#linhaDia" + i ).after( "<td id='linhaTurno" + i + j + "'></td>" );

        for (var k = 1; k < opTurno + 1; k++) {
          $( "#linhaTurno" + i + j ).append("<input type='text' "+
                  "class='smallinput inputUsuario form-control' maxlength='" + qtdeLegendas +
                  "' id='" + i + "-" + j + "-" + k + "'>");
        }

      }

    }

    aux.append( "</tbody>" );

  }

  /*************************************
  Essa função cria a tabela que será utilizada para exibir os dados
  na segunda página da aplicação.
  *************************************/
  function criarTabelaResultados(arrayOperadores){

    aux = $("#tabelaCargaOperadores");

    aux.append("<tbody>");

    arrayOperadores.forEach( function(legendaOperador){

      aux.append("<tr id='linhaTabelaCargaOperadores-" + legendaOperador + "'>"+
                "<td>" + legendaOperador + "</td>"+
                "<td><span id='operador" + legendaOperador + "-cargaHoraria'></span></td>"+
                "<td><span id='operador" + legendaOperador + "-etapaComum'></span></td>"+
                "<td><span id='operador" + legendaOperador + "-etapaEventual'></span></td>"+
                "</tr>");

    });

    aux.append("</tbody>");

  }

  /*************************************
  Essa função recebe como parâmetros o número de dias e as legendas de
  operadores configuradas pelo usuário e monta os selects de acordo com
  as opções disponíveis.
  *************************************/
  function configurarFormularioTrocas(arrayOperadores, n_dias){

    inputProponente     = $("#inputProponente");
    inputProposto       = $("#inputProposto");
    inputDiaProponente  = $("#inputDiaProponente");
    inputDiaProposto    = $("#inputDiaProposto");

    arrayOperadores.forEach( function(legendaOperador){

      inputProponente.append("<option value='" + legendaOperador + "'>" +
                              legendaOperador + "</option>");

      inputProposto.append("<option value='" + legendaOperador + "'>" +
                            legendaOperador + "</option>");

    });

    for (var i = 1; i <= n_dias; i++) {

      inputDiaProponente.append("<option value='" + i + "'>" + i + "</option>");

      inputDiaProposto.append("<option value='" + i + "'>" + i + "</option>");

    }

  }

  /*************************************
  Essa função é um construtor de objetos
  Os objetos criados tem as propriedades proponente, proposto, diaProponente
  diaProposto, turnoProponente, turnoProposto e dataRegistro

  O uso da função é:
  X = new objetoTrocas(A,B,C,I,J,K,L);

  Assim é criado um objeto X que tem suas propriedades acessas da seguinte
  forma:
  X.proponente (Resultado A)
  X.proposto (Resultado B)
  X.diaProponente (Resultado C)
  X.diaProposto (Resultado I)
  X.turnoProponente (Resultado J)
  X.turnoProposto (Resultado K)
  X.dataRegistro (Resultado L)
  *************************************/
  function objetoTrocas(proponente,proposto,diaProponente,diaProposto,turnoProponente,turnoProposto,dataRegistro){
    this.proponente       = proponente;
    this.proposto         = proposto;
    this.diaProponente    = diaProponente;
    this.diaProposto      = diaProposto;
    this.turnoProponente  = turnoProponente;
    this.turnoProposto    = turnoProposto;
    this.dataRegistro     = dataRegistro;
  }

  /*************************************
  Essa função é um construtor de objetos
  Os objetos criados tem as propriedades cargaHoraria, etapasComuns e
  etapasEventuais

  O uso da função é:
  X = new objetoOperador(I,J,K);

  Assim é criado um objeto X que tem suas propriedades acessas da seguinte
  forma:
  X.cargaHoraria (Resultado I)
  X.etapasComuns (Resultado J)
  X.etapasEventuais (Resultado K)

  *************************************/
  function objetoOperador(cargahoraria,etapascomuns,etapaseventuais){
    this.cargaHoraria     = cargahoraria;
    this.etapasComuns     = etapascomuns;
    this.etapasEventuais  = etapaseventuais;
  }

  /*************************************
  Os operadores criados nessa função ficam disponíveis em:
  operador["X"]
  onde X é a legenda do operador retirada do array legendasOperadores

  O operador é criado utilizando o construtor de objetos "objetoOperador"
  Todas as propriedades são acessíveis em:
  operador["X"].cargaHoraria
  operador["X"].etapasComuns
  operador["X"].etapasEventuais

   ************************************/
  function criarOperadores(arrayOperadores){

    arrayOperadores.forEach( function(legendaOperador){

      operador[legendaOperador] = new objetoOperador(0,[],[]);

    });

  }

  criarOperadores(legendasOperadores);

  /*************************************
  Essa função zera todos os operadores para evitar que os valores continuem
  sendo somados caso os cálculos sejam efetuados novamente.
  *************************************/
  function zerarOperadores(arrayOperadores){

    arrayOperadores.forEach( function(legendaOperador){

      operador[legendaOperador].cargaHoraria = 0;
      operador[legendaOperador].etapasComuns = [];
      operador[legendaOperador].etapasEventuais = [];

    });

  }

  /*************************************
  Essa função recebe os parâmetros do formulário de trocas, cria um objetoTrocas
  e em seguida armazena esse objeto na última posição do array que guarda todo
  o registro de trocas (arrayRegistroTrocas).
  *************************************/
  function registrarTroca(arrayRegistroTrocas,proponente,proposto,diaProponente,diaProposto,turnoProponente,turnoProposto){

    var dataRegistro = moment();
    var troca        = new objetoTrocas(proponente,proposto,diaProponente,diaProposto,turnoProponente,turnoProposto,dataRegistro);
    arrayRegistroTrocas.push(troca);

  }

  /*************************************
  Essa função recebe os parâmetros setados no formulário de trocas e
  verifica se a troca é possível de ser realizada. Opcionalmente a função também
  altera o arrayTabelaDias e os inputs dos usuários.
  Caso o operador proposto ou proponente não seja encontrado no turno indicado
  a função é cancelada e a troca é registrada de qualquer forma, nesse caso
  não alteração do array salvo ou dos inputs de usuário.
  *************************************/
  function executarTroca(arrayTabelaDiasSalvo,proponente,proposto,diaProponente,diaProposto,turnoProponente,turnoProposto,n_operadores,verificar){

    var posicaoProponenteNoTurno;
    var posicaoPropostoNoTurno;
    var arrayParaTestarTroca  = JSON.parse(JSON.stringify(arrayTabelaDiasSalvo));
    var trocaPossivel         = -1;
    var achouUsuario          = false

    if (turnoProponente === "M"){ turnoProponente = 1;}
    if (turnoProponente === "T"){ turnoProponente = 2;}
    if (turnoProponente === "N"){ turnoProponente = 3;}

    if (turnoProposto === "M"){ turnoProposto = 1;}
    if (turnoProposto === "T"){ turnoProposto = 2;}
    if (turnoProposto === "N"){ turnoProposto = 3;}

    diaProponente = parseInt(diaProponente, 10);
    diaProposto   = parseInt(diaProposto, 10);

    for (var i = 1; i <= n_operadores; i++) {

      if (arrayParaTestarTroca[diaProponente][turnoProponente][i] === proponente){
        posicaoProponenteNoTurno = i;
        achouUsuario = true;
      }
      if (i === n_operadores && !achouUsuario){
        if (verificar){
          alert("Proponente não encontrado no turno informado");
          return 1;
        }        
      }
    }

    achouUsuario = false;

    for (var j = 1; j <= n_operadores; j++) {

      if (arrayParaTestarTroca[diaProposto][turnoProposto][j] === proposto){
        posicaoPropostoNoTurno = j;
        achouUsuario = true;
      }
      if (j === n_operadores && !achouUsuario){
        if (verificar){
          alert("Proposto não encontrado no turno informado");
          return 1;
        }        
      }
    }

    arrayParaTestarTroca[diaProponente][turnoProponente][posicaoProponenteNoTurno]  = proposto;
    arrayParaTestarTroca[diaProposto][turnoProposto][posicaoPropostoNoTurno]        = proponente;

    if (verificar){

      trocaPossivel = validarInputOperadores(arrayParaTestarTroca,legendasOperadores,
                                            configuracao.numeroDias,
                                            configuracao.numeroTurnos,
                                            configuracao.numeroOperadoresPorTurno,
                                            true);

    }
    if (!verificar){

      arrayTabelaDias = JSON.parse(JSON.stringify(arrayParaTestarTroca));
      $( "#" + diaProponente + "-" + turnoProponente + "-" + posicaoProponenteNoTurno ).val(proposto);
      $( "#" + diaProposto + "-" + turnoProposto + "-" + posicaoPropostoNoTurno ).val(proponente);

      trocaPossivel = 1;


    }

    

    return trocaPossivel;

  }

  /*************************************
  Essa função recebe o índice do registro no arrayRegistroTrocas e elimina
  o referido registro do array permanentemente.
  *************************************/
  function deletarTroca(indice,arrayRegistroTrocas){

    arrayRegistroTrocas.splice(indice, 1);

  }

  /*************************************
  Essa função varre os inputs do usuário e salva um array com todos os valores
  preenchidos. Esse array é salvo na variável arrayTabelaDias e pode ser
  acessado da forma:
  arrayTabelaDias[i][j][k]

  Onde i = número do dia (1->configuracao.numeroDias)
       j = número do turno (1->configuracao.numeroTurnos)
       k = posição do operador (1->configuracao.numeroOperadoresPorTurno)
  *************************************/
  function criarArrayTabelaDias(n_dias, n_turnos, n_operadores){

    for (var i = 1; i <= n_dias; i++) {
      arrayTabelaDias[i] = [];
      for (var j = 1; j <= n_turnos; j++) {
        arrayTabelaDias[i][j] = [];
        for (var k = 1; k <= n_operadores; k++) {

          arrayTabelaDias[i][j][k] = $( "#" + i + "-" + j + "-" + k ).val();

        }
      }
    }

    return 1;

  }

  /*************************************
  Essa função calcula as horas de apenas 1 operador
  e recebe como argumento a legenda do operador envolta em apóstrofos
  Ex: cargaHoraria("X");, a variável cargaHoráriaDiurna e a variável
  cargaHoráriaNoturna

  Para calcular todas as legendas é necessário passar todos os operadores
  como argumento para a função.
  *************************************/
  function cargaHoraria(legendaOperador, cargaDiurna, cargaNoturna){

    var CargaHoraria = 0;

    CargaHoraria = operador[legendaOperador].etapasComuns.length * cargaDiurna;
    CargaHoraria += operador[legendaOperador].etapasEventuais.length * cargaNoturna;

    if ( CargaHoraria < 0 ) {
      alert("Aconteceu algum problema inesperado na contagem de carga do" +
            " operador " + legendaOperador + ". Contacte o Schuler e pare de" +
            " utilizar o programa enquanto o problema não for resolvido.");
    }

    operador[legendaOperador].cargaHoraria = CargaHoraria;
  }

  /*************************************
  Essa função calcula as cargas horárias de TODOS os operadores que estiverem
  listados na variável legendasOperadores.
  É necessário que essa função seja chamada ANTES da função removerEtapasComuns,
  do contrário o cálculo de carga horária estará incorreto.
  Também é necessário que essa função seja chamada APÓS a função
  calcularEtapasTodos, do contrário as propriedades operador["X"].etapasComuns e
  operador["X"].etapasEventuais não estarão setados.
  *************************************/
  function calcularCargasHorarias(arrayOperadores, cargaDiurna, cargaNoturna){

    arrayOperadores.forEach( function(legendaOperador){

      cargaHoraria(legendaOperador, cargaDiurna, cargaNoturna);

    });

  }

  /*************************************
  Essa função determina os dias em que apenas 1 operador recebe as etapas
  eventuais ou comuns e recebe como argumento a legenda do operador envolta
  em apóstrofos
  Ex: diasEtapas("X");

  Para calcular todas as legendas é necessário passar todos os operadores
  como argumento para a função.
  *************************************/
  function diasEtapas(legendaOperador, n_dias, n_turnos, n_operadores){

    /**********************************************
    ***********************************************
    **                                           **
    **  i = dia                                  **
    **  j = turno                                **
    **  k = posição do operador dentro do turno  **
    **                                           **
    ***********************************************
    **********************************************/

    for (var i = 1; i <= n_dias; i++) {
      for (var j = 1; j <= n_turnos; j++) {
        for (var k = 1; k <= n_operadores; k++) {

          valorCelula = arrayTabelaDias[i][j][k];

          if (valorCelula === ""){
            continue;
          }
          else {

            if ( valorCelula == legendaOperador){
              if (j == 1 || j == 2){

                operador[legendaOperador].etapasComuns.push(i);

              }
              if (j == 3){

                operador[legendaOperador].etapasEventuais.push(i);

              }
            }

          }

        }
      }
    }

  }

  /*************************************
  Essa função remove as etapas comuns de todos os operadores caso seja
  verificado que o mesmo já receberá uma etapa eventual no mesmo dia
  *************************************/
  function removerEtapasComuns(arrayOperadores){

  	arrayOperadores.forEach( function(legendaOperador){

  		var indiceRemover = -1;
  		var removida = [];

  		for (var i = 0; i < operador[legendaOperador].etapasEventuais.length; i++) {

  			indiceRemover = operador[legendaOperador].etapasComuns.indexOf(
  							operador[legendaOperador].etapasEventuais[i]);

  			if(indiceRemover == -1){
  				continue;
  			}
  			else{
  				removida = operador[legendaOperador].etapasComuns.splice
  													(indiceRemover, 1);
  				indiceRemover = -1;
  			}

  		}

    });

  }

  /*************************************
  Essa função adiciona as etapas comuns e eventuais de TODOS os operadores
  que estiverem listados na variável legendasOperadores às respectivas
  propriedades do objeto Operador.
  *************************************/
  function calcularEtapasTodos(arrayOperadores, n_dias, n_turnos, n_operadores){

    arrayOperadores.forEach( function(legendaOperador){

      diasEtapas(legendaOperador, n_dias, n_turnos, n_operadores);

    });

  }

  /*************************************
  Essa função percorre o array com todos os registro de trocas e cria a tabela
  de registro de trocas para uma exibição amigável dos dados além de um botão
  para deletar o registro.
  *************************************/
  function preencheTabelaTrocas(arrayOperadores, arrayRegistroTrocas, quantidadeTrocas){

    aux = $( "#tabelaTrocas" );

    aux.append("<tbody>");

    arrayOperadores.forEach( function(legendaOperador){

      var numeroTroca   = 0;
      var dataRegistro  = "";

      for (var i = 0; i < arrayRegistroTrocas.length; i++) {

        if (arrayRegistroTrocas[i].proponente === legendaOperador) {

          numeroTroca += 1;

          if (numeroTroca > quantidadeTrocas) {
            alert("O operador " + arrayRegistroTrocas[i].proponente + " possui " +
                  "mais que " + quantidadeTrocas + " trocas");
          }

          dataRegistro = moment(arrayRegistroTrocas[i].dataRegistro).format("DD/MM");

          aux.append("<tr id='linhaTabelaTroca-" + i + "'>"+
                      "<td>" + arrayRegistroTrocas[i].proponente + "</td>"+
                      "<td>" + numeroTroca + "</td>"+
                      "<td>" + arrayRegistroTrocas[i].diaProponente + "-" + arrayRegistroTrocas[i].turnoProponente + "</td>" +
                      "<td>" + arrayRegistroTrocas[i].proposto + "</td>" +
                      "<td>" + arrayRegistroTrocas[i].diaProposto + "-" +
                      arrayRegistroTrocas[i].turnoProposto + "</td>" +
                      "<td>" + dataRegistro + "</td>" +
                      "<td><button type='button' name='deletarRegistro-" +
                      i + "' class='btn btn-danger btn-sm btn-deletar' id='deletarRegistro-" +
                      i + "'><i class='fa fa-trash' aria-hidden='true'></i></button></td>" +
                      "</tr>");
        }

      }

    });

    aux.append("</tbody>");

    $( '.btn-deletar' ).on( "click", function(){

      var id          = $(this).attr('id');
      var idSeparado  = id.split("-");

      indice          = idSeparado[1];

      deletarTroca(indice,arrayRegistroTrocas);

      alert("Troca deletada!");

      $("#tabelaTrocas tbody").remove();

      preencheTabelaTrocas(arrayOperadores, arrayRegistroTrocas, quantidadeTrocas);

    });

  }

  /*************************************
  Essa função apenas mostra informação contextual ao usuário
  Caso não tenham sido feitas trocas no mês é exibido um painel
  indicativo de que não houveram trocas registradas.
  *************************************/
  function mostraAvisoTrocas(arrayRegistroTrocas){

    if (arrayRegistroTrocas.length === 0) {
      $( '#painelAvisoTrocas' ).show();
    } else {
      $( '#painelAvisoTrocas' ).hide();
    }

  }
  /*************************************
  Essa função preenche a tabela FINAL com as cargas horárias dos operadores.
  A tabela inicial é feita pelo input dos usuários.
  *************************************/
  function preencheTabelaResultado(arrayOperadores,cargaHorariaMinima){

    var operadoresAbaixoMinimo = 0;

    arrayOperadores.forEach( function(legendaOperador){

      var fraseEtapasComuns = "(" + operador[legendaOperador].etapasComuns.length + ") / ";
      var fraseEtapasEventuais = "(" + operador[legendaOperador].etapasEventuais.length + ") / ";

      for (var i = 0; i < operador[legendaOperador].etapasComuns.length; i++) {
        fraseEtapasComuns += operador[legendaOperador].etapasComuns[i] + ", ";
      }

      for (var j = 0; j < operador[legendaOperador].etapasEventuais.length; j++) {
        fraseEtapasEventuais += operador[legendaOperador].etapasEventuais[j] + ", ";
      }

      $("#operador" + legendaOperador + "-cargaHoraria").html(
                            operador[legendaOperador].cargaHoraria +" horas");

      $("#operador" + legendaOperador + "-etapaComum").html(
                            fraseEtapasComuns);

      $("#operador" + legendaOperador + "-etapaEventual").html(
                            fraseEtapasEventuais);

      if ( operador[legendaOperador].cargaHoraria < cargaHorariaMinima ){

        if ( operador[legendaOperador].cargaHoraria > 0){
          $( "#linhaTabelaCargaOperadores-" + legendaOperador ).addClass( "danger" );
          operadoresAbaixoMinimo += 1;
        }
        
      }

      if ( operador[legendaOperador].cargaHoraria > cargaHorariaMinima ){

        $( "#linhaTabelaCargaOperadores-" + legendaOperador ).addClass( "success" );
        
      }

    });

    if ( operadoresAbaixoMinimo > 0 ) {

      $( "#corpoPainelAvisoCargaHoraria" ).html("Aconteceu algum problema. Há " + operadoresAbaixoMinimo +
                                              " operador(es) abaixo da carga horária mínima.");
      $( "#painelAvisoCargaHoraria" ).show();
    }

  }

  /*************************************
  Essa função preenche a tabela com os inputs dos usuários. Os inputs serão
  preenchidos caso exista o arquivo dados.json na raiz da aplicação.
  *************************************/
  function preencheTabelaOperadores(){

    $( "input[class='smallinput inputUsuario form-control']" ).each(function(){

        var id = $(this).attr('id');
        var idSeparado = id.split("-");
        var valor = "";
        var i = 0;
        var j = 0;
        var k = 0;

        i = idSeparado[0];
        j = idSeparado[1];
        k = idSeparado[2];
        valor = arrayTabelaDias[i][j][k];

        $(this).val(valor);


    });
  }

  /*************************************
  As funções abaixo controlam apenas os botões da nossa interface e invocam
  as funções de cálculo corretas no momento adequado.
  *************************************/
  $( '#botaoConfigurarAmbiente' ).on( "click", function(){

    var configuracaoCorreta = -1;

    var legendas        = $( '#inputLegendaOperadores' ).val();
    legendasOperadores  = JSON.parse("[" + legendas + "]");

    var numeroDias                  = parseFloat($( '#inputNumeroDias' ).val());
    /*****************************************************************************
    /**  As tabelas não estão adaptadas pra um número de turnos maior que 3.   **/
    /**  Até lá impedimos o usário de inserir essa configuração.               **/
    /****************************************************************************/
    /*var numeroTurnos                = parseFloat($( '#inputNumeroTurnos' ).val());*/
    var numeroTurnos                = 3;
    var numeroOperadoresPorTurno    = parseFloat($( '#inputNumeroOperadoresPorTurno' ).val());
    var digitosLegendas             = parseFloat($( '#inputDigitosLegendas' ).val());
    var cargaHorariaDiurna          = parseFloat($( '#inputCargaHorariaDiurna' ).val());
    var cargaHorariaNoturna         = parseFloat($( '#inputCargaHorariaNoturna' ).val());
    var quantidadeTrocas            = parseFloat($( '#inputNumeroTrocas' ).val());
    var cargaHorariaMinima          = parseFloat($( '#inputCargaHorariaMinima' ).val());
    var removerEtapasComuns         = $( '#inputRemoverEtapasComuns' ).val();

    configuracaoCorreta = validarConfiguracao(numeroDias,numeroTurnos,numeroOperadoresPorTurno,
                                              digitosLegendas,cargaHorariaDiurna,cargaHorariaNoturna,
                                              quantidadeTrocas,cargaHorariaMinima);    

    if (configuracaoCorreta === 1) {

      configuracao.numeroDias               = numeroDias;
      configuracao.numeroTurnos             = numeroTurnos;
      configuracao.numeroOperadoresPorTurno = numeroOperadoresPorTurno;
      configuracao.digitosLegendas          = digitosLegendas;
      configuracao.cargaHorariaDiurna       = cargaHorariaDiurna;
      configuracao.cargaHorariaNoturna      = cargaHorariaNoturna;
      configuracao.quantidadeTrocas         = quantidadeTrocas;
      configuracao.removerEtapasComuns      = removerEtapasComuns;

      criarOperadores(legendasOperadores);

      criarTabelaDias(configuracao.numeroDias,
                      configuracao.numeroTurnos,
                      configuracao.numeroOperadoresPorTurno,
                      configuracao.digitosLegendas);

      configurarFormularioTrocas(legendasOperadores, configuracao.numeroDias);

      criarTabelaResultados(legendasOperadores);

      $( '#paginaInsercoes' ).show();
      $( '#call-to-action' ).hide();
      $( '#paginaConfiguracoes' ).hide();

      $('body').scrollTop(0);

    }

  });

  $( '#botaoCarregarValores' ).on( "click", function(){

    arrayTabelaDias     = arrayTabelaDiasSalvo;
    configuracao        = configuracaoSalvo;
    legendasOperadores  = legendasOperadoresSalvo;
    arrayRegistroTrocas = arrayRegistroTrocasSalvo;

    alert("Cuidado ao utilizar essa função. Tenha certeza que os valores" +
          " configurados são os que você espera.");

    criarOperadores(legendasOperadores);

    criarTabelaDias(configuracao.numeroDias,
                    configuracao.numeroTurnos,
                    configuracao.numeroOperadoresPorTurno,
                    configuracao.digitosLegendas);

    configurarFormularioTrocas(legendasOperadores, configuracao.numeroDias);

    criarTabelaResultados(legendasOperadores);

    preencheTabelaOperadores();

    $( '#paginaInsercoes' ).show();
    $( '#call-to-action' ).hide();
    $( '#paginaConfiguracoes' ).hide();

    $('body').scrollTop(0);

  });

  $( '#botaoRegistrarTroca' ).on( "click", function(){

    var formularioCorreto     = -1;
    var trocaPossivel         = -1;
    var arrayTabelaDiasSalvo  = [];

    proponente      = $( '#inputProponente' ).val();
    proposto        = $( '#inputProposto' ).val();
    diaProponente   = $( '#inputDiaProponente' ).val();
    diaProposto     = $( '#inputDiaProposto' ).val();
    turnoProponente = $( '#inputTurnoProponente' ).val();
    turnoProposto   = $( '#inputTurnoProposto' ).val();

    criarArrayTabelaDias(configuracao.numeroDias,
                          configuracao.numeroTurnos,
                          configuracao.numeroOperadoresPorTurno);

    arrayTabelaDiasSalvo = JSON.parse(JSON.stringify(arrayTabelaDias));

    formularioCorreto = validarFormularioTroca(proponente,proposto,diaProponente,diaProposto,
                                                turnoProponente,turnoProposto,arrayRegistroTrocas);

    trocaPossivel = executarTroca(arrayTabelaDiasSalvo,proponente,proposto,diaProponente,diaProposto,
                                    turnoProponente,turnoProposto,configuracao.numeroOperadoresPorTurno,true);

    if (formularioCorreto === 1 && trocaPossivel === 1) {

      registrarTroca(arrayRegistroTrocas,proponente,proposto,diaProponente,
                      diaProposto,turnoProponente,turnoProposto);

      executarTroca(arrayTabelaDiasSalvo,proponente,proposto,diaProponente,diaProposto,
                    turnoProponente,turnoProposto,configuracao.numeroOperadoresPorTurno,false);

      alert("Troca registrada");

      $( '#inputProponente' ).val("");
      $( '#inputProposto' ).val("");
      $( '#inputDiaProponente' ).val("");
      $( '#inputDiaProposto' ).val("");
      $( '#inputTurnoProponente' ).val("");
      $( '#inputTurnoProposto' ).val("");

    }

  });

  $( '#botaoCalcular' ).on( "click", function(){

    $( "#tabelaCargaHoraria td").removeClass( "danger" );

    var todosUsuariosCorretos = -1;

    criarArrayTabelaDias(configuracao.numeroDias,
                          configuracao.numeroTurnos,
                          configuracao.numeroOperadoresPorTurno);

    todosUsuariosCorretos = validarInputOperadores(arrayTabelaDias,legendasOperadores,
                                                    configuracao.numeroDias,
                                                    configuracao.numeroTurnos,
                                                    configuracao.numeroOperadoresPorTurno,false);

    if (todosUsuariosCorretos === 1) {

      zerarOperadores(legendasOperadores);

      calcularEtapasTodos(legendasOperadores,
                          configuracao.numeroDias,
                          configuracao.numeroTurnos,
                          configuracao.numeroOperadoresPorTurno);

      calcularCargasHorarias(legendasOperadores,
                              configuracao.cargaHorariaDiurna,
                              configuracao.cargaHorariaNoturna);

      if ( configuracao.removerEtapasComuns === "true" ) {
        removerEtapasComuns(legendasOperadores);
      }

      preencheTabelaResultado(legendasOperadores,configuracao.cargaHorariaMinima);

      $( '#divCargaOperadores' ).show();
      $( '#paginaInsercoes' ).hide();

      $('body').scrollTop(0);

    }

  });

  $( '#botaoAcompanharTrocas' ).on( "click", function(){

    preencheTabelaTrocas(legendasOperadores, arrayRegistroTrocas, configuracao.quantidadeTrocas);

    mostraAvisoTrocas(arrayRegistroTrocas);

    $( '#divTabelaTrocas' ).show();
    $( '#paginaInsercoes' ).hide();

    $('body').scrollTop(0);

  });

  $( '#botaoMostrarTabela' ).on( "click", function(){

    zerarOperadores(legendasOperadores);

    $( '#paginaInsercoes' ).show();
    $( '#divCargaOperadores' ).hide();

    $( "#tabelaCargaOperadores tr").removeClass( "danger" );
    $( "#corpoPainelAvisoCargaHoraria" ).html( "" );
    $( "#painelAvisoCargaHoraria" ).hide();

    $('body').scrollTop(0);

  });

  $( '#botaoMostrarTabela2' ).on( "click", function(){

    $("#tabelaTrocas tbody").remove();

    $( '#paginaInsercoes' ).show();
    $( '#divTabelaTrocas' ).hide();

    $('body').scrollTop(0);

  });

  $( '#botaoSalvarValores' ).on( "click", function(){

    var todosUsuariosCorretos = -1;

    criarArrayTabelaDias(configuracao.numeroDias,
                          configuracao.numeroTurnos,
                          configuracao.numeroOperadoresPorTurno);

    todosUsuariosCorretos = validarInputOperadores(arrayTabelaDias,legendasOperadores,
                                                    configuracao.numeroDias,
                                                    configuracao.numeroTurnos,
                                                    configuracao.numeroOperadoresPorTurno);

    if (todosUsuariosCorretos === 1) {

      var dados = "text/json;charset=utf-8, arrayTabelaDiasSalvo = " +
                  encodeURIComponent(JSON.stringify(arrayTabelaDias)) +
                  "; configuracaoSalvo = " +
                  encodeURIComponent(JSON.stringify(configuracao)) +
                  "; legendasOperadoresSalvo = " +
                  encodeURIComponent(JSON.stringify(legendasOperadores)) +
                  "; arrayRegistroTrocasSalvo = " +
                  encodeURIComponent(JSON.stringify(arrayRegistroTrocas)) + ";";

      $( "#botaoSalvarValores" ).hide();
      $( "#botaoSalvarValores" ).after('<a class="btn btn-success" id="botaoDownloadDados" href="data:' + dados + '" download="dados.json">Download <i class="fa fa-download" aria-hidden="true"></i></a>');

      $( "#botaoDownloadDados" ).on( "click", function(){
        $( "#botaoDownloadDados" ).remove();
        $( "#botaoSalvarValores" ).show();
      });

    }

  });

  $( "#paragrafoConfiguracoes" ).on("click", function(){

    if ($( "#configuracoesAvancadas" ).hasClass( "inativo" )){

    $( "#configuracoesAvancadas" ).fadeIn( 600 );
    $( "#paragrafoConfiguracoes" ).html("<p id='paragrafoConfiguracoes'>Configurações Avançadas <i class='fa fa-caret-up' aria-hidden='true'></i></p>");
    $( "#configuracoesAvancadas" ).removeClass( "inativo" ).addClass( "ativo" );
    return 1;

    }

    if ($( "#configuracoesAvancadas" ).hasClass( "ativo" )){

    $( "#configuracoesAvancadas" ).fadeOut( 200 );
    $( "#paragrafoConfiguracoes" ).html("<p id='paragrafoConfiguracoes'>Configurações Avançadas <i class='fa fa-caret-down' aria-hidden='true'></i></p>");
    $( "#configuracoesAvancadas" ).removeClass( "ativo" ).addClass( "inativo" );
    return 1;

    }

  });

});
