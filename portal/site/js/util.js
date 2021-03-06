$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
util = function(){
	var _setNameUser = function(){
		$(".userName").each(function( index ) {
			 valElement = $(this).html();
			 valElement = valElement.replace("userName", $.sessionStorage.getItem('userName'));
			 $(this).html(valElement);
		});
	}
	var _logout = function(){
		$.sessionStorage.clear();
        var baseUrl = location.protocol + "//" + location.host;
        location.href = baseUrl;
	}
	var _formatReal = function(int){
        var tmp = int+'';
		decimal = tmp.split(".");
		if(typeof decimal[1] == "undefined") {
			tmp = tmp + '00';
		}else if(decimal[1].length < 2){
			tmp = tmp + '0';
		}
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
		if(tmp.search('.') != -1)
			tmp = tmp.replace('.','');
		
        if( tmp.length > 6 )
                tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
				
        return tmp;
	}
	var _formatParseFloat = function(v){
		var tmp = v;
		tmp = tmp.replace(".","");
		tmp = tmp.replace(",",".");
		tmp = parseFloat(tmp);
		return tmp;
	}
	var _load_details_product = function(id){
		$.ajax({
            type: 'GET',
			async: false,
			dataType: "json",
            url: 'api/products/details/'+id,
            success: function (data) {
				$("#modal1 #descricaoProduto").html(data.descricao);
				$("#modal1 #imagemProduto").attr('src',data.imagem);
				$("#modal1 #quantity").val("1");				
				$("#modal1 #observacaoProduto").html(data.observacao);
				$("#modal1 #precoProduto").html('R$ '+util.formatReal(data.valor));
				$("#modal1 #btnComprar").attr('onclick','util.addProductCart('+id+');');
				$("#modal1").openModal();
				
				//bloqueia a digitação de letras
				$('#modal1 #quantity').keypress(function(key) {
					if(key.charCode < 48 || key.charCode > 57) return false;
				});				
            },
			statusCode: {
				400: function(error) {
				  Materialize.toast(error.responseJSON.status, 4000);
				}
			}
        });
	}
	var _load_category_product = function(id){
		var $selectDropdown = 
		$("#dwCategoria")
        .empty()
        .html(' ');
		
		$.ajax({
            type: 'GET',
			dataType: "json",
			async: false,
            url: '/api/categories',
            success: function (data) {
				$.each(data, function(index, categoria) {
					 $.each(categoria, function (i, item) {
					$selectDropdown.append(
					$("<option></option>")
					.attr("value",item.cat_id)
					.text(item.cat_nm)
					);
				
					});
				});
						//$("#listaProdutos").html(listaProdutos);

			},
			statusCode: {
				400: function(error) {
				  Materialize.toast(error.responseJSON.status, 4000);
				}
			}
        });



	}
	var _filter_category_product = function(id){
		 $.ajax({
            type: 'GET',
			dataType: "json",
			async: false,
            url: 'api/products/' + id,
            success: function (data) {
				var listaProdutos = "";
				$.each(data, function(index, produtos) {
					 $.each(produtos, function (i, item) {
						var div  = "<div class='col s4 center'>";
								div += "<div class='row'><img src='"+item.imagem+"' height='100px' onerror='util.imageError(this);'/></div>";
								div += "<div class='row'>"+ item.descricao.substring(0,80);
									if (item.descricao.length > 80){
										div +="...";
									}
								div += "</div>";
								div += "<div class='row'>"+util.formatReal(item.valor)+"</div>";
								div += "<div class='row'>"
									div += "<button onclick='util.load_details_product(this.id);' id='"+item.id+"' class='btn'>[+] Detalhes</button>";
								div += "</div>";
							div += "</div>";
						listaProdutos+=div;						
					});
				});
						$("#listaProdutos").html(listaProdutos);
			},
			statusCode: {
				400: function(error) {
				  Materialize.toast(error.responseJSON.status, 4000);
				}
			}
        });
		
	}
	var _addProductCart = function(id){
		if(!sessionStorage.getItem('userName')){
			Materialize.toast('Faça o login para comprar produtos!', 4000);
			return false;
		}
		if($("#modal1 #quantity").val() == "0"){
			$("#modal1 #quantity").addClass("invalid");
			Materialize.toast('A quantidade do item deve ser maior que 0!', 4000);
			return false;		
		}
		cartNow = $.sessionStorage.getItem('cartProducts');
		if(cartNow == null || cartNow == ''){		
			var cart = [
				{
					"id": id,
					"imagem": $("#modal1 #imagemProduto").attr('src'),
					"descricao":$("#modal1 #descricaoProduto").html(),
					"quantidade":$("#modal1 #quantity").val(),
					"valor": $("#modal1 #precoProduto").html().replace('R$ ','')
				}
			];
		$.sessionStorage.setItem('cartProducts', JSON.stringify(cart));
		}else{
			var newCart = [];
			var isNewProduct = false;
			$.each(JSON.parse(cartNow), function(index, item) {
				if(item.id ==id){
					newCart.push({"id":id,
								  "imagem":item.imagem,
								  "descricao":item.descricao,
								  "quantidade":$("#modal1 #quantity").val(),
								  "valor":item.valor
								});
					isNewProduct = true;
				}else{
					newCart.push({"id":item.id,
								  "imagem":item.imagem,
								  "descricao":item.descricao,
								  "quantidade":item.quantidade,
								  "valor":item.valor
								});				
				}
			});
			if(!isNewProduct){
					newCart.push({"id":id,
								  "imagem": $("#modal1 #imagemProduto").attr('src'),
								  "descricao":$("#modal1 #descricaoProduto").html(),
								  "quantidade":$("#modal1 #quantity").val(),
								  "valor": $("#modal1 #precoProduto").html().replace('R$ ','')
								});
			}
			$.sessionStorage.setItem('cartProducts', JSON.stringify(newCart));
		}
		Materialize.toast('Item adicionado no carrinho!', 4000);
	}
	var _loadHeader = function (){
		$.ajax({
			type:'GET',
			dataType: 'html',
			async:false,
			url:'header.html',
			success: function(data){
				$(".headerPage").html(data);
				//habilitar submenu qdo usuário está logado como cliente
				$(".dropdown-button").dropdown();
			}
		});
	}
	var _loadFooter = function (){
		$.ajax({
			type:'GET',
			dataType: 'html',
			async:false,
			url:'footer.html',
			success: function(data){
				$(".page-footer").html(data);
			}
		});
	}
	//validacao para formularios
	var _valida_form = function (form){
        
        var isValid = true;
        
		$(form+" .validate" ).each(function( index ) {
			if($(this).val() == ""){
				Materialize.toast('Os campos devem estar preenchidos!', 4000);
                isValid = false;
				$(this).addClass('invalid');
				return false;
			}
			if($(this).attr('class').search("invalid") != -1 && $(this).attr('type') == "email"){
				Materialize.toast('O email informado não é valido!', 4000);
                isValid = false;
				$(this).addClass('invalid');
				return false;
			}
		});
		return isValid;		
	}
	var _dataAgora = function(){
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
			dd='0'+dd
		} 

		if(mm<10) {
			mm='0'+mm
		} 

		today = mm+'/'+dd+'/'+yyyy;
		return today;	
	}
	var _setLocationSession = function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(_setPosition);
		} else { 
			Materialize.toast('Geolocation is not supported by this browser!', 4000);
			return false;
		}
	}
	var _setPosition = function (position) {
		$.sessionStorage.setItem('lat', position.coords.latitude);
		$.sessionStorage.setItem('long', position.coords.longitude);
	}
	var _imageError	= function(element){
		$(element).attr('src','img/no-images.jpg');
	}
	return {
		setNameUser: _setNameUser,
		logout: _logout,
		formatReal: _formatReal,
		load_details_product: _load_details_product,
		addProductCart: _addProductCart,
		loadHeader: _loadHeader,
		loadFooter: _loadFooter,
		load_category_product: _load_category_product,
		filter_category_product: _filter_category_product,
		valida_form: _valida_form,
		dataAgora: _dataAgora,
		setLocationSession: _setLocationSession,
		imageError: _imageError,
		formatParseFloat: _formatParseFloat
	}
}();

/*
$.makeTable = function (mydata) {
    var table = $('<table border=1>');
    var tblHeader = "<tr>";
    for (var k in mydata[0]) tblHeader += "<th>" + k + "</th>";
    tblHeader += "</tr>";
    $(tblHeader).appendTo(table);
    $.each(mydata, function (index, value) {
        var TableRow = "<tr>";
        $.each(value, function (key, val) {
            TableRow += "<td>" + val + "</td>";
        });
        TableRow += "</tr>";
        $(table).append(TableRow);
    });
    return ($(table));
};
*/