	//Definindo a chamada do gr�fico (chart)
	google.load('visualization', '1.0', {'packages':['corechart']});
    google.setOnLoadCallback(drawChart);
	
	//Vetor para armazenar os dados vindos de outra p�gina JS
	function gerar_dados(){
		var vet_dados = new array();
		var tamanho = vet_dados.length;
		var contador;
		//Vetor din�mico
		for (contador = 1; contador <= tamanho; contador++){
			vet_dados.push();
		}
	}
	
	//Inicializando o processo de cria��o do gr�fico
    function drawChart() {
		
		//Criando o gr�fico atrav�s da vari�vel DATA
        var data = new google.visualization.DataTable();
            data.addColumn('string', 'Dias da Semana');
            data.addColumn('number', 'Produto 1');
            data.addColumn('number', 'Produto 2');
            data.addColumn('number', 'Produto 3');
            data.addColumn('number', 'Produto 4');
            data.addColumn('number', 'Meta de Vendas');
            data.addRows([
             ['Segunda-feira', gerar_dados()],
             ['Ter�a-feira', gerar_dados()],
             ['Quarta-feira', gerar_dados()],
             ['Quinta-feira', gerar_dados()],
             ['Sexta-feira', gerar_dados()],
			 ['S�bado', gerar_dados()],
			 ['Domingo', gerar_dados()]
          ]);
     
		//Customizando o gr�fico atrav�s da vari�vel OPTIONS
        var options = {
            'legend': 'right',
            'title' : 'Venda de Produtos',
            'is3D'  : true,
            'width' : 900,
            'height': 500,
            seriesType: "bars",
            series: {4: {type: "line"}}
          };
             
        //Instanciando o gr�fico para ser visualizado na interface com o usu�rio - vari�vel CHART_DIV
		var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
        
		//Executando um draw no gr�fico passando por par�metro os valores das vari�veis DATA e OPTIONS
		chart.draw(data, options);
      }