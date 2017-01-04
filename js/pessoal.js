$( document ).ready(function() {

  /*************************************
  var legendasOperadores guarda apenas as legendas que serão utilizadas nos
  cálculos.

  var operador guarda o objeto operador com suas 3 propriedades

  *************************************/
  var legendasOperadores = ["A","B","C","D","E","F","G","H","I","J",
                            "K","L","M","N","O","P","Q","R","S","T"];

  var arrayTabelaDias = [];

  var operador = [];

  var configuracao = {
    numeroDias: 31,
    numeroTurnos: 3,
    numeroOperadoresPorTurno: 5,
    digitosLegendas: 1,
    cargaHorariaDiurna: 7.25,
    cargaHorariaNoturna: 10.25
  };

  /*************************************
  Essa função cria a tabela que será utilizada para o input de dados.
  Foi necessário algum voodoo pra fazer funcionar, não olhe!
  *************************************/
  function criarTabelaDias(qtdeDias,qtdeTurnos,opTurno,qtdeLegendas){

    var aux = $( "#tabelaCargaHoraria");

    for (var i = 1; i < qtdeDias + 1; i++) {

      aux.append( "<tr><td id='linhaDia" + i + "'>Dia " + i +"</td></tr>" );

      for (var j = qtdeTurnos; j > 0; j--) {

        $( "#linhaDia" + i ).after( "<td id='linhaTurno" + i + j + "'></td>" );

        for (var k = 1; k < opTurno + 1; k++) {
          $( "#linhaTurno" + i + j ).append("<input type='text' "+
                  "class='smallinput inputUsuario' maxlength='" + qtdeLegendas +
                  "' id='" + i + "-" + j + "-" + k + "'>");
        }

      }

    }

  }

  /*************************************
  Essa função cria a tabela que será utilizada para exibir os dados
  na segunda página da aplicação.
  *************************************/
  function criarTabelaResultados(arrayOperadores){

    aux = $("#tabelaCargaOperadores");

    arrayOperadores.forEach( function(legendaOperador){

      aux.append("<tr>"+
                "<td>" + legendaOperador + "</td>"+
                "<td><span id='operador" + legendaOperador + "-cargaHoraria'></span></td>"+
                "<td><span id='operador" + legendaOperador + "-etapaComum'></span></td>"+
                "<td><span id='operador" + legendaOperador + "-etapaEventual'></span></td>"+
                "</tr>");

    });

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
    this.cargaHoraria = cargahoraria;
    this.etapasComuns = etapascomuns;
    this.etapasEventuais = etapaseventuais;
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
  Essa função varre os inputs do usuário e salva um array com todos os valores
  preenchidos. Esse array é salvo na variável arrayTabelaDias e pode ser
  acessado da forma:
  arrayTabelaDias[i][j][k]

  Onde i = número do dia (1->configuracao.numeroDias)
       j = número do turno (1->configuracao.numeroTurnos)
       k = posição do operador (1->configuracao.numeroOperadoresPorTurno)
  *************************************/
  function criarArrayTabelaDias(arrayOperadores, n_dias, n_turnos, n_operadores){

    for (var i = 1; i <= n_dias; i++) {
      arrayTabelaDias[i] = [];
      for (var j = 1; j <= n_turnos; j++) {
        arrayTabelaDias[i][j] = [];
        for (var k = 1; k <= n_operadores; k++) {

          valorCelula = $( "#" + i + "-" + j + "-" + k ).val();

          indiceValorCelula = arrayOperadores.indexOf(valorCelula);

          if (indiceValorCelula == -1){
            if (valorCelula == ""){
              continue;
            }
            else {
              alert("Você inseriu um usuário não cadastrado no dia " + i);
            }
          }

          arrayTabelaDias[i][j][k] = valorCelula;

        }
      }
    }

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

          if (valorCelula == ""){
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
  Essa função preenche a tabela FINAL com as cargas horárias dos operadores.
  A tabela inicial é feita pelo input dos usuários.
  *************************************/
  function preencheTabelaResultado(arrayOperadores){

    arrayOperadores.forEach( function(legendaOperador){

      var fraseEtapasComuns = "(" + operador[legendaOperador].etapasComuns.length + ") / ";
      var fraseEtapasEventuais = "(" + operador[legendaOperador].etapasEventuais.length + ") / ";

      for (var i = 0; i < operador[legendaOperador].etapasComuns.length; i++) {
        fraseEtapasComuns += operador[legendaOperador].etapasComuns[i] + ", ";
      }

      for (var i = 0; i < operador[legendaOperador].etapasEventuais.length; i++) {
        fraseEtapasEventuais += operador[legendaOperador].etapasEventuais[i] + ", ";
      }

      $("#operador" + legendaOperador + "-cargaHoraria").html(
                            operador[legendaOperador].cargaHoraria +" horas");

      $("#operador" + legendaOperador + "-etapaComum").html(
                            fraseEtapasComuns);

      $("#operador" + legendaOperador + "-etapaEventual").html(
                            fraseEtapasEventuais);

    });

  }

  /*************************************
  Essa função preenche a tabela com os inputs dos usuários. Os inputs serão
  preenchidos caso exista o arquivo dados.json na raiz da aplicação.
  *************************************/
  function preencheTabelaOperadores(){

    $( "input[class='smallinput inputUsuario']" ).each(function(){

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

    var legendas = $( '#inputLegendaOperadores' ).val();
    legendasOperadores = JSON.parse("[" + legendas + "]");

    var numeroDias = $( '#inputNumeroDias' ).val();
    var numeroTurnos = $( '#inputNumeroTurnos' ).val();
    var numeroOperadoresPorTurno = $( '#inputNumeroOperadoresPorTurno' ).val();
    var digitosLegendas = $( '#inputDigitosLegendas' ).val();
    var cargaHorariaDiurna = $( '#inputCargaHorariaDiurna' ).val();
    var cargaHorariaNoturna = $( '#inputCargaHorariaNoturna' ).val();

    numeroDias = parseInt(numeroDias, 10);
    numeroTurnos = parseInt(numeroTurnos, 10);
    numeroOperadoresPorTurno = parseInt(numeroOperadoresPorTurno, 10);
    digitosLegendas = parseInt(digitosLegendas, 10);
    cargaHorariaDiurna = parseFloat(cargaHorariaDiurna);
    cargaHorariaNoturna = parseFloat(cargaHorariaNoturna);

    configuracao.numeroDias = numeroDias;
    configuracao.numeroTurnos = numeroTurnos;
    configuracao.numeroOperadoresPorTurno = numeroOperadoresPorTurno;
    configuracao.digitosLegendas = digitosLegendas;
    configuracao.cargaHorariaDiurna = cargaHorariaDiurna;
    configuracao.cargaHorariaNoturna = cargaHorariaNoturna;

    criarOperadores(legendasOperadores);

    criarTabelaDias(configuracao.numeroDias,
                    configuracao.numeroTurnos,
                    configuracao.numeroOperadoresPorTurno,
                    configuracao.digitosLegendas);

    criarTabelaResultados(legendasOperadores);

    $( '#divTabelaCargaHoraria' ).show();
    $( '#call-to-action' ).hide();
    $( '#paginaConfiguracoes' ).hide();

  });

  $( '#botaoCarregarValores' ).on( "click", function(){

    arrayTabelaDias = arrayTabelaDiasSalvo;
    configuracao = configuracaoSalvo;
    legendasOperadores = legendasOperadoresSalvo;

    alert("Cuidado ao utilizar essa função. Tenha certeza que os valores" +
          " configurados são os que você espera.")

    criarOperadores(legendasOperadores);

    criarTabelaDias(configuracao.numeroDias,
                    configuracao.numeroTurnos,
                    configuracao.numeroOperadoresPorTurno,
                    configuracao.digitosLegendas);

    criarTabelaResultados(legendasOperadores);

    preencheTabelaOperadores();

    $( '#divTabelaCargaHoraria' ).show();
    $( '#call-to-action' ).hide();
    $( '#paginaConfiguracoes' ).hide();

  });

  $( '#botaoCalcular' ).on( "click", function(){

    criarArrayTabelaDias(legendasOperadores,
                          configuracao.numeroDias,
                          configuracao.numeroTurnos,
                          configuracao.numeroOperadoresPorTurno);

    zerarOperadores(legendasOperadores);

    calcularEtapasTodos(legendasOperadores,
                        configuracao.numeroDias,
                        configuracao.numeroTurnos,
                        configuracao.numeroOperadoresPorTurno);

    calcularCargasHorarias(legendasOperadores,
                            configuracao.cargaHorariaDiurna,
                            configuracao.cargaHorariaNoturna);

    removerEtapasComuns(legendasOperadores);

    preencheTabelaResultado(legendasOperadores);

    $( '#divCargaOperadores' ).show();
    $( '#divTabelaCargaHoraria' ).hide();

  });

  $( '#botaoMostrarTabela' ).on( "click", function(){

    zerarOperadores(legendasOperadores);

    $( '#divTabelaCargaHoraria' ).show();
    $( '#divCargaOperadores' ).hide();

  });

  $('#botaoSalvarValores' ).on( "click", function(){

    criarArrayTabelaDias(legendasOperadores,
                          configuracao.numeroDias,
                          configuracao.numeroTurnos,
                          configuracao.numeroOperadoresPorTurno);

    var dados = "text/json;charset=utf-8, arrayTabelaDiasSalvo = " +
                encodeURIComponent(JSON.stringify(arrayTabelaDias)) +
                "; configuracaoSalvo = " +
                encodeURIComponent(JSON.stringify(configuracao)) +
                "; legendasOperadoresSalvo = " +
                encodeURIComponent(JSON.stringify(legendasOperadores)) + ";";

    $( "#botaoSalvarValores" ).removeClass("btn btn-success");
    $( "#botaoSalvarValores" ).html('<a class="btn btn-success" href="data:' + dados + '" download="dados.json">Download JSON</a>');

  });

});
