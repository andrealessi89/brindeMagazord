var brindesArray = {
  "Etapa1": [{
      "configuracao": {
          "valor_alvo": 200.00,
          "qt_brinde_permitido": 1
      },
      "grupo_1": [{
          "nome": "Camisa Masculina",
          "tipo_variacao": "cor",
          "variacao": [{
              "descricao": "Preta",
              "codigo": "CMP",
              "tamanhos": ["P", "M", "G", "GG"]
          }, {
              "descricao": "Branca",
              "codigo": "CMB",
              "tamanhos": ["P", "M", "G", "GG"]
          }]
      }],
      "grupo_2": [{
          "nome": "Camisa Feminina",
          "tipo_variacao": "cor",
          "variacao": [{
              "descricao": "Preta",
              "codigo": "CFP",
              "tamanhos": ["P", "M", "G", "GG"]
          }, {
              "descricao": "Branca",
              "codigo": "CFB",
              "tamanhos": ["P", "M", "G", "GG"]
          }]
      }]
  }]
};

$(document).ajaxComplete(function(event, xhr, settings) {
    if (settings.url ==  "/checkout/cart?operation=atualizaValoresCarrinho" || settings.url == "/checkout/cart?operation=deleteItem" || settings.url == "/checkout/cart?operation=adicionaItem" || settings.url == "/checkout/cart?operation=removeItem") {
        console.log('no ajax');
        init2()
    }
});


$(document).ready(function() {
    console.log('no ready');
    init2();
});


function init2() {

    getIdRemoveBrindes()
    createLayoutInicial()
    createProgressBar();
    var ultimaEtapaVencida = null;
    ultimaEtapaVencida = VerificarEtapas();
    if(ultimaEtapaVencida){
    VerificaLocalStorageValor(ultimaEtapaVencida);
    }
    VerifyDivInCart();
    if (ultimaEtapaVencida) { 
        createLayoutSelectProducts(ultimaEtapaVencida);
    }
    
    updateProgressBar();
    AdicionaBotaoProximo();

        //adicionando ao contexto
    $('.btnAlterar').click(function(){
        btnAlterarBrindes();
    });

    $('.validar').click(function(){
        validarCheck();
    });

}


function btnAlterarBrindes() {
    localStorage.removeItem('Brinde');
    localStorage.removeItem('etapaCompletada');
    VerifyDivInCart();
    Zord.reload();
}


function createLayoutSelectProducts(ultimaEtapaVencida) {

    $(".btnAlterar").click(function(){

    })
    const getLocalEtapaCompletada = localStorage.getItem('etapaCompletada')

    if(getLocalEtapaCompletada && getLocalEtapaCompletada == ultimaEtapaVencida){
        
        $(".caseEscolhaBrinde").html("Você ja selecionou seu brinde, continue comprando para ganhar mais!")
        $(".casebtnAlterar").html('<a href="javascript:;" class="btnAlterar">Quero alterar meus brindes</a>');   
        $(".caseEscolhaBrinde").css ('height', '20px')
        return false;
    }
    const grupoEtapa = brindesArray[`Etapa${ultimaEtapaVencida}`];
    const totalGrupos = grupoEtapa[0]["configuracao"]['grupos_total'];
    console.log(grupoEtapa[0]["configuracao"]['qt_brinde_permitido']);
    let first = true;
    for (var i = 1; i <= totalGrupos; i++) {

        var grupo = grupoEtapa[0]['grupo_' + i];
        var selectNome = '';
        var selectTamanho = '';

        grupo.forEach(function(item, index) {
            selectNome += `<option value="${item.codigo}">${item.nome}</option>`;
            if (item.tipo_variacao === "tamanho" && index === 0) {
                item.variacao.forEach(function(variacao) {
                    selectTamanho += `<option value="${variacao.codigo}">${variacao.descricao}</option>`;
                });
            }
        });

        let div = `
                    <div class="caseGrupo" rel=${'grupo_'+i}>
                        <div class="produto">
                            <div class="imagemcase">
                                <img src="https://global.cdn.magazord.com.br/blacktarg/img/2022/12/produto/2577/1.png?ims=fit-in/96x96/filters:fill(white)" style=" height: 96px;">
                              <div class="overlay" style="display: none;">
                                 <i class="check-icon fa fa-check">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                   <path fill="#fff" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                 </svg>
                                 </i>
                              </div>
                            </div>
                            <div class="variacoesProd">
                                <select data-gtm-form-interact-field-id="0" class="selectProduto">
                                    ${selectNome}
                                </select>
                            </div>
                            <div class="variacoesTamanho">
                                <select data-gtm-form-interact-field-id="1" class="selectVariacao" rel=${'grupo_'+i}>
                                    ${selectTamanho}
                                </select>
                            </div>
                            <button class="queroesseBtn" >Quero esse!</button>
                        </div>
                    </div>

         `;

         

            if (first) {
                let message = "Selecione o brinde:";
                let symbol = "OU";
                // Verifica a quantidade de brindes que podem ser escolhidos na etapa
                if (grupoEtapa[0]["configuracao"]['qt_brinde_permitido'] === 2) {
                symbol = "E";
                }
                div += `<div class="alternativaMsg"><p>${message}</p><h2>${symbol}</h2></div>`;
                first = false;
            }





        $('.caseEscolhaBrinde').append(div)
        //console.log(arrayEtapa['grupo_' + i]);

        $('.selectProduto').on('change', function() {
            const rel = $(this).closest(".caseGrupo").attr("rel");
            const selecionado = $(this).val();
            const variacoes = grupoEtapa[0][rel].find(item => item.codigo === selecionado)?.variacao || null;


            if (variacoes) {
                const options = variacoes.map(variacao => `<option value="${variacao.codigo}">${variacao.descricao}</option>`).join("");
                $('.selectVariacao[rel="' + rel + '"]').html(options);
            } else {
                //console.log('não contém variações');
            }

            const variacoesImg = grupoEtapa[0][rel].find(item => item.codigo === selecionado)?.img || null;
            if (variacoesImg) {
                $(this).closest(".caseGrupo").find(".imagemcase img").attr("src", variacoesImg);
            }
        });

        $('.selectProduto').change();

       

    }

    var selectedBrindes = [];
     $('.queroesseBtn').click(function() {
            const parentDiv = $(this).closest("div");
            const produto = parentDiv.find(".selectProduto").val();
            const variacao = parentDiv.find(".selectVariacao").val();
            let codprod = "";

            if (variacao) {
                codprod = variacao;
                //console.log('tem variação e é a ', codprod);
            } else {
                codprod = produto;
                //console.log('nao tem variação');
            }

            const qtBrindePermitidos = grupoEtapa[0]['configuracao']['qt_brinde_permitido'];
            const brindesLocal = getLocalStorage('Brinde');

        if (qtBrindePermitidos == 1) {
        //parentDiv.css('background', 'green');
        parentDiv.find('.overlay').show();
        $(".caseEscolhaBrinde").find("button").hide();
        $(".caseEscolhaBrinde").find(".selectProduto").prop("disabled", true);
        $(".caseEscolhaBrinde").find(".selectVariacao").prop("disabled", true);

            
        localStorage.setItem('etapaCompletada', 1);

        }


        if (qtBrindePermitidos == 1 && selectedBrindes.length == 1) {
            selectedBrindes = [];
            selectedBrindes.push(codprod);
        } else if (selectedBrindes.length < qtBrindePermitidos) {
            selectedBrindes.push(codprod);
        } else {
            alert("Você já selecionou o número máximo de brindes permitidos");
            
        }

        localStorage.setItem('Brinde', selectedBrindes);

        if (qtBrindePermitidos == 2) {
            parentDiv.find('.overlay').show();
            parentDiv.find("button").hide();
            parentDiv.find(".selectProduto").prop("disabled", true);
            parentDiv.find(".selectVariacao").prop("disabled", true);

            const brindesLocal = getLocalStorage('Brinde');
            //console.log('brindes local:', brindesLocal)
            
            if (brindesLocal !== null) {
                const qtBrindeNoLocal = brindesLocal.split(',').length;
                //console.log('quantos brindes tem:', qtBrindeNoLocal)
                if(qtBrindeNoLocal == 2){
                    localStorage.setItem('etapaCompletada', 2);
                }
                
            }       
        }

        VerifyDivInCart();
            return false;
        });

}


//VERIFICA SE O VALOR DO CARRINHO BATE COM A QUANTIDADE DE BRINDES QUE TEM NO LOCALSTORAGE, CASO AO CONTRARIO ELE DELETA O LOCALSTORAGE
function VerificaLocalStorageValor(ultimaEtapaVencida) {
  const etapaAtual = ultimaEtapaVencida;

  //console.log('1', etapaAtual)
  
  const valorAlvo = brindesArray[`Etapa${etapaAtual}`][0]['configuracao']['valor_alvo'];
  const qtPermitido = brindesArray[`Etapa${etapaAtual}`][0]['configuracao']['qt_brinde_permitido'];
  //console.log('2', valorAlvo)
  //console.log('3', qtPermitido)
  
  const brindesLocal = getLocalStorage('Brinde');

  if (!brindesLocal) {
    console.log('Não há brindes no localStorage ainda.');
    return true;
  }

  const qtBrindeNoLocal = brindesLocal.split(',').length;

  if (qtBrindeNoLocal > qtPermitido) {
    console.log('Quantidade de brindes maior do que o permitido na etapa.');
    localStorage.removeItem('Brinde');
    localStorage.removeItem('etapaCompletada');

    return false;
  }

  return true;
}

// Verifica a etapa que o usuario esta
function VerificarEtapas() {
    var valorCarrinho = GetValorCarrinho();
    //console.log('VALOR CARRINHO', valorCarrinho)
    var ultimaEtapaVencida = 0;
    Object.keys(brindesArray).forEach(function(etapa) {
        var valor_alvo = brindesArray[etapa][0].configuracao.valor_alvo;
        if (valorCarrinho >= valor_alvo && etapa.slice(-1) > ultimaEtapaVencida) {
            ultimaEtapaVencida = etapa.slice(-1);
        }
    });
    if (ultimaEtapaVencida === 0) {
        localStorage.removeItem("Brinde")
        const divBrinde = $(".brinde");
        divBrinde ? divBrinde.remove() : null;
        console.log('Você não conseguiu nenhum brinde ainda');
        localStorage.removeItem("Brinde")
        localStorage.removeItem("etapaCompletada")
        return false;
    } else {
        console.log('Você venceu a etapa ' + ultimaEtapaVencida);
        return ultimaEtapaVencida;
    }
}



//Analissa o local Storage para adicionar a div dos produtos
function VerifyDivInCart() {
    const localStorageBrinde = CheckLocalStorage();

    // Remove a div de brinde sempre que a página for recarregada
    $(".brinde").remove();

    // Adiciona a div de brinde se existir no localStorage
    if (localStorageBrinde) {
        localStorageBrinde.forEach((item) => addLayoutItemBrindeCarrinho(item));
        return true;
    } else {
        console.log('Não há brinde no localStorage');
        return false;
    }
}

// Cria div para inserir os outros elementos
function createLayoutInicial() {
    $("#cart-area").prepend(`

        <div class="caseProgresso"> </div>
      <div class="caseEscolhaBrinde">
      </div>
      <div class="casebtnAlterar">
         
      </div>
      `);

    $('.caseProgresso').before('<p style="font-size:14px; margin-bottom:30px">Compre  <strong>R$400</strong> e leve um boné ou camiseta! Aumente para <strong>R$600</strong> e ganhe ambos para incrementar seu estilo!</p>');
}


// Verifica se possui o localstorage
function CheckLocalStorage() {
    const brindesLocal = getLocalStorage('Brinde');
    return brindesLocal ? brindesLocal.split(',') : false;
}


//ADICIONA UMA DIV COM PRODUTO BRINDE NO CARRINHO DE COMPRA
function addLayoutItemBrindeCarrinho(item) {
    const produto = getProdutoByCodigo(item);

    if (!produto) return;

    const divCarrinhoBrinde = `
        <div class="cart-item brinde" data-item-deposito="1">
            <div class="flex center space-between">
                <div class="column-itens flex center">
                    <figure><img itemprop="thumbnailUrl" title="" src="${produto.img}" alt="${produto.nome} -" }width="290" height="290" }=""></figure>
                    <div class="nome-produto flex column">   <a href="#" title="${produto.nome}"><strong>Brinde Selecionado<br></strong>  ${produto.nome} </a>  </div>
                </div>
            </div>
        </div>
    `;

    $('.lista-carrinho').append(divCarrinhoBrinde);
}


function getLocalStorage(key) {
    return localStorage.getItem(key);
}


//Retorna o produto referente ao código passado
function getProdutoByCodigo(codigo) {
  const etapas = Object.keys(brindesArray).length;
  for (let i = 1; i <= etapas; i++) {
    const grupo = brindesArray['Etapa' + i][0];

    for (let j = 1; j <= grupo['configuracao']['grupos_total']; j++) {
      const produto = grupo['grupo_' + j].find((p) =>
        p.codigo === codigo || (p.variacao && p.variacao.some((v) => v.codigo === codigo))
      );

      if (produto) {
        return produto;
      }
    }
  }
  return null;
}


//Captura o valor do carrinho
function GetValorCarrinho() {

    var valorTotal = $('.total-boleto .value');
    var valor_carrinho = 0;

    if(valorTotal.length == 0){
        var valor_carrinho = $('.resumo-valores .value').text().replace('.', '').split(' ')[1].replace(',', '.');
        var valor_carrinho = parseFloat(valor_carrinho);
        return valor_carrinho;
    }else{
        var valor_carrinho = $('.total-boleto .value').text().replace('.', '').split(' ')[1].replace(',', '.');
        var valor_carrinho = parseFloat(valor_carrinho);
        return valor_carrinho;
    }
}


function createProgressBar(){
    const divprogress = `<div class="progress-bar">
  <div class="progress-bar-fill"></div>
  <img class="shirt-icon" src="https://global.cdn.magazord.com.br/blacktarg/img/2023/02/produto/2926/etapa1.png">
  <img class="shirt-icon2" src="https://global.cdn.magazord.com.br/blacktarg/img/2023/02/produto/2927/untitled-2.png">
</div>
<div class="progress-message"></div>`

$('.caseProgresso').append(divprogress);
}

function ProgressBarPorsent() {
  var valorCarrinho = GetValorCarrinho();
  const valorTotal = 600;
  const porcentagem = (valorCarrinho / valorTotal) * 100;
  $('.progress-bar-fill').css('width', porcentagem + '%');
}

function updateProgressBar() {
  var valorCarrinho = GetValorCarrinho();

$(".shirt-icon2").css('background', 'lightgray');
$(".shirt-icon2").css('border-radius', '55px');
$(".shirt-icon").css('background', 'lightgray');
$(".shirt-icon").css('border-radius', '55px');

  if(valorCarrinho >= 400){
    $(".shirt-icon").css('background', '#00ac73');
    $(".shirt-icon").css('border-radius', '55px');
  }

  if(valorCarrinho >= 600){
    $(".shirt-icon2").css('background', '#00ac73');
    $(".shirt-icon2").css('border-radius', '55px');
  }

  const valorTotal = 600;
  const porcentagem = (valorCarrinho / valorTotal) * 100;
  $('.progress-bar-fill').css('width', porcentagem + '%');

  if (valorCarrinho >= 600) {
  $('.progress-message').html('<h2>Parabéns! Você conquistou 2 brindes! selecione:</h2>');
} else if (valorCarrinho >= 400) {
  var falta = 600 - valorCarrinho;
  if (falta < 0) {
    falta = 0;
  }
  $('.progress-message').html('Faltam apenas <strong>' + falta.toFixed(2) + '</strong> reais para você conseguir levar os 2 brindes <br> <h2>Parabéns você conquistou um brinde! selecione:</h2> <br> ');
} else {
  var falta = 400 - valorCarrinho;
  $('.progress-message').html('Faltam ' + falta.toFixed(2) + ' reais para você completar a primeira etapa');
}
}

function AdicionaBotaoProximo(){
var botaovalidar = `
  <a 
  class="validar"
  style=" -webkit-text-size-adjust: 100%; --cor-primaria: #fff; --cor-bordas: #e1e1e1; --cor-texto: #252525; --cor-texto-secundario: #666; --cor-base-darken-strong: #000; --cor-verde-action: #5ba637; --cor-verde-action-hover: #4a9028; --container: 1240px; --cor-base: #000000; --cor-base-light: #1a1a1a; --cor-base-light-20: #cccccc; --cor-base-light-10: #f3f3f3; --cor-base-darken: #000000; --cor-secundaria: #000000; font: inherit; overflow: visible; text-transform: none; -webkit-appearance: button; position: relative; min-width: 100px; min-height: 30px; margin: 0; padding: 5px 10px; text-align: center; text-overflow: ellipsis; line-height: 30px; cursor: pointer; box-sizing: border-box; border-style: solid; border-width: 1px; color: #fff; border-radius: 4px; font-size: .8125em; font-weight: bold; background: #04a16d; border-color: #04a16d; width: 78%;">
  <span>
    Avançar
  </span>
  <span class="icon-seta-dir">
  </span>
  </a>`;

  $('.validar').remove();
  $('.btn-next').hide();
  $('.summary-fixed').append(botaovalidar);
  $('.proxima-etapa').append(botaovalidar);
}


async function validarCheck() {
  const valorCarrinho = GetValorCarrinho();
  const brindesCarrinho = CheckLocalStorage();



  if (valorCarrinho >= 400 && valorCarrinho <= 600) {
    if (brindesCarrinho.length === 1) {
      console.log("Você tem 1 brinde no carrinho");

      const codigo = brindesCarrinho[0];
      await AddBrindeCarrinho(codigo);
    } else {
      localStorage.removeItem("etapaCompletada");
      alert("Selecione um brinde que você ganhou");
      Zord.reload();
    }
  } else if (valorCarrinho >= 600) {
    if (brindesCarrinho.length === 2) {
      console.log("Você tem 2 brindes no carrinho");
      for (const codigo of brindesCarrinho) {
        await AddBrindeCarrinho(codigo);
      }
    } else {
      localStorage.removeItem("etapaCompletada");
      alert("Selecione dois brindes que você ganhou");
      Zord.reload();
    }
  } else if(valorCarrinho < 400){
    $('.btn-next').click();
  }
   
}

async function AddBrindeCarrinho(codigo) {
  var data = new FormData();
  data.append("produtos[0][codigo]", codigo);
  data.append("produtos[0][quantidade]", 1);
  data.append("produtos[0][deposito]", 0);

  try {
    await $.ajax({
      url: "https://www.blacktarg.com.br/checkout/cart?operation=AddMultiples",
      data: data,
      type: "POST",
      processData: false,
      contentType: false
    });

    console.log("Brinde adicionado");
    $('.btn-next').click();
  } catch (err) {
    console.log(err.responseText);

    var nomeProdutoAdicionando = getProdutoByCodigo(codigo);
    if(!nomeProdutoAdicionando){
        nomeProdutoAdicionando = "Desconhecido";
    }


    if(err.responseText == "Não é possível alterar a quantidade! O produto não está mais disponível no estoque!"){
        alert("O brinde "+nomeProdutoAdicionando+" não foi adicionado pois esta fora de estoque, selecione outro:");
            localStorage.removeItem('Brinde');
            localStorage.removeItem('etapaCompletada');
    }
    console.log("Aconteceu algum erro ao adicionar o brinde no carrinho");
    await getIdRemoveBrindes();
    Zord.reload();
  }
}


async function getIdRemoveBrindes() {
  const promises = [];
  $('.cart-item').each(function() {
    const $cartItem = $(this);
    if ($cartItem.text().includes("Brinde-")) {
      promises.push(new Promise((resolve, reject) => {
        const onClick = $cartItem.find('.remove').attr('onClick');
        if (onClick) {
          const id = onClick.replace('Zord.Cart.removeItemSweetalert(', '').replace(');', '');
          const id2 = id.replace('Zord.checkout.deleteItem(', '');
          console.log('AQUI', id2);
          $('#' + id2).hide();
          RemoveBrindeCarrinho(id2)
            .then(resolve)
            .catch(reject);
        } else {
          resolve();
        }
      }));
    }
  });

  return Promise.all(promises);
}





function RemoveBrindeCarrinho(idcarrinho) {
  var data = new FormData();
  data.append('id', idcarrinho);
  return $.ajax({
    url: 'https://www.blacktarg.com.br/checkout/cart?operation=deleteItem',
    data: data,
    type: 'POST',
    processData: false,
    contentType: false
  })
    .then(() => {
      console.log('Brinde deletado do carrinho');

    })
    .catch(err => {
      console.error('Erro ao remover brinde do carrinho', err);
      throw err;
    });
}


function getBrindeNomes() {
  const nomes = [];
  for (const etapa in brindesArray) {
    const grupos = brindesArray[etapa][0];
    for (const grupo in grupos) {
      if (!grupo.includes("configuracao")) {
        const itens = grupos[grupo];
        itens.forEach(item => nomes.push(item.nome));
      }
    }
  }
  return nomes;
}