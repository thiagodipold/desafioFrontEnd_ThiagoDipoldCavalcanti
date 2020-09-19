jQuery(document).ready(function() {

    let divMap = jQuery('.map--style');
    const buttonSearch = jQuery('#buttonSearch');

    jQuery('.header__menu__navigation--items a').click(function(e){
        //Remove a mudança de URL nos itens do menu.
        e.preventDefault();
    });

    function limpar_formulario_cep() {
        // Limpa valores do formulário de cep.
        jQuery("#cep").val("");
        jQuery("#cidade").val("");
        jQuery("#rua").val("");
    }

    function aparecer_nova_busca(){
        //Cria um novo botão no container do mapa.
        let buttonNewSearch = jQuery('<button></button>').text('Realizar Nova Busca');
        buttonNewSearch.attr({
            id: 'novaBusca',
            class: 'form__button'
        });
        jQuery('.container--new-search').append(buttonNewSearch);
    }

    function limpar_container_mapa(){
        //Limpa todos os elementos do container do mapa.
        jQuery(".container__map .container--text, .container__map .container--title").text("");
        jQuery('#novaBusca').remove();
        divMap.removeAttr('src');
    }

    function desabilitar_botao_busca(){
        //Desabilita a função de busca, até que uma nova seja requisitada através do botão "Realizar nova Busca".
        jQuery(".form__items").prop('disabled', true);
        jQuery('.form__button').toggleClass('form__button--disabled');
        jQuery('.container__map__close').toggleClass('container__map__close--hidden');
        jQuery('.form__items').toggleClass('form__items--disable');
    }

    function inserir_titulo_historico(){
        //Cria o titulo de histórico quando um novo CEP for incluído.
        jQuery('.container__historic-search--list').text('');
        jQuery('.container__historic-search--title').addClass('container__historic-search--visible');
    }

    //Função para resetar o container map.
    jQuery('body').on('click', '#novaBusca, .container__map__close', function(){
        limpar_formulario_cep();
        limpar_container_mapa();
        jQuery('.form__button').toggleClass('form__button--disabled');
        jQuery('.container__map__close').toggleClass('container__map__close--hidden');
        jQuery('.form__items').toggleClass('form__items--disable');   
        jQuery(".form__items").prop('disabled', false);
        jQuery("#cep").focus();
    });

    //Abrir opção consultar CEP.
    jQuery("#consultarCEP").click(function(e){
        e.preventDefault();
        jQuery('.container__form__consulta').toggleClass('container__form__consulta--enabled');
    });

    //Variável para guardar histórico de buscas.
    let historicoBusca = [];

    //Funcionalidade 'Não sei meu CEP'.
    jQuery("#buttonSearchCEP").click(function(){
        var uf = jQuery('#estado').val();
        var cidade = jQuery('#cidade').val();
        var rua = jQuery("#rua").val();

        //Verifica número minímo de caracteres e realiza a consulta.
        if(cidade.length >= 3){
            if(rua.length >= 3){
                jQuery.getJSON(`https://viacep.com.br/ws/${uf}/${cidade}/${rua}/json/?callback=?`, function(dados) {

                    if(!("erro" in dados)){
                        //Recebe os dados do endereço mais aproximado do retorno da pesquisa
                        jQuery("#cep").val(dados[0].cep);
                        jQuery("#cep").focus();
                    } else{
                        alert('Endereço não encontrado');
                    }
                    
                });
            }

            else{
                alert("O logradouro deve conter pelo menos 3 caracteres");
                jQuery("#rua").focus();     
            }
        }
        else{
            alert("A cidade deve conter pelo menos 3 caracteres.");
            jQuery('#cidade').focus();
        }
    });
        
    
    //Quando o botão buscar CEP for clicado.
    jQuery("#buttonSearch").click(function() {

        //Nova variável "cep" somente com dígitos.
        var cep = jQuery('#cep').val().replace(/\D/g, '');

        //Verifica se campo cep possui valor informado.
        if (cep != "") {

            //Expressão regular para validar o CEP.
            const validacep = /^[0-9]{8}$/;

            //Valida o formato do CEP.
            if(validacep.test(cep)) {

                //Consulta o webservice viacep.com.br/
                jQuery.getJSON(`https://viacep.com.br/ws/${cep}/json/?callback=?`, function(dados) {

                    if (!("erro" in dados)) {
                        //Preenche a query do mapa de acordo com o CEP indicado.
                        let queryMap = `https://www.google.com/maps/embed/v1/place?q=${dados.cep}+&key=AIzaSyDIfXHwkcsBA0Vmd5zOvceiWlMzRVaRQ94&zoom=16`;
                        divMap.attr('src', queryMap);            

                        //Atualiza os campos com os valores da consulta.
                        jQuery("#ruaBusca").text(dados.logradouro);
                        jQuery("#bairro").text(dados.bairro);
                        jQuery("#cidadeBusca").text(`${dados.localidade} - ${dados.uf}`);
                        jQuery("#cepBusca").text(dados.cep);
                        
                        //Desabilita o botão de busca.
                        desabilitar_botao_busca();
                        aparecer_nova_busca();

                        //Adiciona historico de busca do CEP
                        historicoBusca.push(dados.cep);
                        inserir_titulo_historico();
                        for(var i = historicoBusca.length-1; i >= 0; i--){
                            jQuery('.container__historic-search--list').append(`<p>${historicoBusca[i]}</p>`);
                        }
                        
                    } //end if.
                    else {
                        //CEP pesquisado não foi encontrado.
                        limpar_formulario_cep();
                        alert("CEP não encontrado.");
                    }
                });
            } //end if.
            else {
                //cep é inválido.
                limpar_formulario_cep();
                alert("Formato de CEP inválido.");
            }
        } //end if.
        else {
            //cep sem valor, limpa formulário.
            limpar_formulario_cep();
            jQuery("#cep").focus();
            alert("Informe um CEP na caixa em destaque.");
        }
    });

});

