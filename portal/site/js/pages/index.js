﻿index = function(){
	var _init = function (){
		
		//carrega cabeçalho
		util.loadHeader();
		//carrega rodape
		util.loadFooter();
		// Inicia Combo Categoria
		$('select').material_select();
		
		//carrega conteudo do modal do login
		 $.ajax({
            type: 'GET',
			async: false,
            url: 'modal-login.html',
            success: function (data) {
				$("#modal-user-login").html(data);
            }
        });

		//valida o tipo do usuário que logado
		$(".liLogged").hide();
		if($.sessionStorage.getItem('userType') == "client"){
			util.setNameUser();
			$(".lnkLogin").hide();
			$(".liLogged").show();
			
		}
		
		//carrega produtos
		 $.ajax({
            type: 'GET',
			dataType: "json",
			async: false,
            url: 'api/products',
            success: function (data) {
				var listaProdutos = "";
				$.each(data, function(index, produtos) {
					 $.each(produtos, function (i, item) {
						var div  = "<div class='col s4 center'>";
								div += "<div class='row'><img src='"+item.imagem+"' height='100px'/></div>";
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
		
		//identifica div como modal
		$('.modal-trigger').leanModal();
	}
	
	//Carrega as categorias dos produtos
	util.load_category_product();

	// Filtra os produtos por categoria
	$('select').change(function() {
		 util.filter_category_product (this.value);
 		 });
	
	var _api_user_login = function (){
		
		var requestData = JSON.stringify($('#formLogin').serializeObject());
        var baseUrl = location.protocol + "//" + location.host;
		
		$.ajax({
			url: '/api/user/login',
			type: 'POST',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: requestData
		}).done(function(data, textStatus, jqXHR) {
			$.sessionStorage.setItem('userName', data.userName);
            $.sessionStorage.setItem('userType', data.userType);

			if(data.userType == "adtf")
				location.href = baseUrl + "/index-adtf.html";
			else
			if(data.userType == "admin")
                location.href = baseUrl + "/index-admin.html";
			else
                location.href = baseUrl + "/index.html";
		}).fail(function(jqXHR, textStatus, errorThrown) {
			$('#modal-user-login-fail').openModal();
		});
	}
	var _valida_form = function (form){
        
        var isValid = true;
        
		$("#formLogin .validate" ).each(function( index ) {
			if($(this).val() == ""){
				Materialize.toast('Os campos devem estar preenchidos!', 4000);
                isValid = false;
				return false;
			}
			if($(this).attr('class').search("invalid") != -1 && $(this).attr('type') == "email"){
				Materialize.toast('O email informado não é valido!', 4000);
                isValid = false;
				return false;
			}
		});
        
        if(isValid)
            _api_user_login();
        else
            return false;
	}	
	var _api_user_resetpassword = function(form){

		var requestData = JSON.stringify($('#formResetPWS').serializeObject());

		$.ajax({
			url: '/api/user/resetpassword',
			type: 'POST',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: requestData
		}).done(function(data, textStatus, jqXHR) {
            
            console.log(data.status);
            
            if(data.status == "error"){
                console.log(data.error);
                console.log(data.message);
                $('#modal-user-resetpassword-fail').openModal();
            } else {
                $('#modal-user-resetpassword-success').openModal();
            }
		}).fail(function(jqXHR, textStatus, errorThrown) {
			$('#modal-user-resetpassword-fail').openModal();
		});
	}
	var _api_user_changepassword = function (form){
		alert("Tela sem implementação");
	}
	return {
		init:_init,
		api_user_resetpassword: _api_user_resetpassword,
		api_user_changepassword: _api_user_changepassword,
		valida_form: _valida_form
	}
}();