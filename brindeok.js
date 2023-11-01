class Brinde {
    constructor(nome, tipoVariacao) {
        this.nome = nome;
        this.tipoVariacao = tipoVariacao;
        this.variacoes = [];
    }

    adicionarVariacao(descricao, codigo, imagem) { // Adicione um terceiro parâmetro para a imagem
        const novaVariacao = {
            descricao,
            codigo,
            imagem, // Armazene a imagem aqui
            tamanhos: []
        };
        this.variacoes.push(novaVariacao);
        return this; // Permite encadeamento de chamadas
    }

    adicionarTamanho(codigoVariacao, descricaoTamanho, codigoTamanho) {
        const variacao = this.variacoes.find(v => v.codigo === codigoVariacao);
        if (variacao) {
            variacao.tamanhos.push({ descricao: descricaoTamanho, codigo: codigoTamanho });
        } else {
            console.warn(`Variacao com codigo ${codigoVariacao} não encontrada!`);
        }
        return this; // Permite encadeamento de chamadas
    }
}

class EtapaBrindes {
    constructor(valorAlvo, qtBrindePermitido) {
        this.configuracao = {
            valorAlvo,
            qtBrindePermitido
        };
        this.brindes = [];
    }

    verificarValorAlvo(valorCarrinho) {
        return valorCarrinho >= this.configuracao.valorAlvo;
    }

    adicionarBrinde(nome, tipoVariacao) {
        const novoBrinde = new Brinde(nome, tipoVariacao);
        this.brindes.push(novoBrinde);
        return novoBrinde; // Retorna o brinde para que possamos continuar a configuração
    }
}

// Uso da nova estrutura
var etapa1 = new EtapaBrindes(200.00, 1);

// Configurando brindes, variações e tamanhos
etapa1.adicionarBrinde('Camisa Masculina', 'cor')
    .adicionarVariacao('Preta', 'MascP', 'https://global.cdn.magazord.com.br/semprebasicos/img/2023/10/produto/219/go-200-2-0.jpg?ims=fit-in/475x650/filters:fill(white)')
    .adicionarTamanho('MascP', 'PP', 'GO200-2-PP-CAMPANHA')
    .adicionarTamanho('MascP', 'P', 'GO200-2-P-CAMPANHA')
    .adicionarTamanho('MascP', 'M', 'GO200-2-M-CAMPANHA')
    .adicionarTamanho('MascP', 'G', 'GO200-2-G-CAMPANHA')
    .adicionarTamanho('MascP', 'GG', 'GO200-2-GG-CAMPANHA')
    .adicionarTamanho('MascP', 'XGG', 'GO200-2-XGG-CAMPANHA')
    .adicionarVariacao('Branca', 'MascB', 'https://global.cdn.magazord.com.br/semprebasicos/img/2023/10/produto/213/go-200-1-0.jpg?ims=fit-in/475x650/filters:fill(white)')
    .adicionarTamanho('MascB', 'PP', 'GO200-1-PP-CAMPANHA')
    .adicionarTamanho('MascB', 'P', 'GO200-1-P-CAMPANHA')
    .adicionarTamanho('MascB', 'M', 'GO200-1-M-CAMPANHA')
    .adicionarTamanho('MascB', 'G', 'GO200-1-G-CAMPANHA')
    .adicionarTamanho('MascB', 'GG', 'GO200-1-GG-CAMPANHA')
    .adicionarTamanho('MascB', 'XGG', 'GO200-1-XGG-CAMPANHA');

etapa1.adicionarBrinde('Camisa Feminina', 'cor')
    .adicionarVariacao('Preta', 'FemP', 'https://global.cdn.magazord.com.br/semprebasicos/img/2023/10/produto/189/go-100-2-0.jpg?ims=fit-in/475x650/filters:fill(white)')
    .adicionarTamanho('FemP', 'PP', 'GO100-2-PP-CAMPANHA') // ta sem estoque
    .adicionarTamanho('FemP', 'P', 'GO100-2-P-CAMPANHA')
    .adicionarTamanho('FemP', 'M', 'GO100-2-M-CAMPANHA')
    .adicionarTamanho('FemP', 'G', 'GO100-2-G-CAMPANHA')
    .adicionarTamanho('FemP', 'GG', 'GO100-2-GG-CAMPANHA')
    .adicionarTamanho('FemP', 'XGG', 'GO100-2-XGG-CAMPANHA')
    .adicionarVariacao('Branca', 'FemB', 'https://global.cdn.magazord.com.br/semprebasicos/img/2023/10/produto/183/go-100-1-0.jpg?ims=fit-in/475x650/filters:fill(white)')
    .adicionarTamanho('FemB', 'PP', 'GO100-1-PP-CAMPANHA') // ta sem estoque
    .adicionarTamanho('FemB', 'P', 'GO100-1-P-CAMPANHA')
    .adicionarTamanho('FemB', 'M', 'GO100-1-M-CAMPANHA')
    .adicionarTamanho('FemB', 'G', 'GO100-1-G-CAMPANHA')
    .adicionarTamanho('FemB', 'GG', 'GO100-1-GG-CAMPANHA')
    .adicionarTamanho('FemB', 'XGG', 'GO100-1-XGG-CAMPANHA'); // ta sem estoque


$(document).ready(function () {
    $(document).ajaxComplete(function (event, xhr, settings) {
        if (settings.url == "/checkout/cart?operation=atualizaValoresCarrinho" || settings.url == "/checkout/cart?operation=deleteItem" || settings.url == "/checkout/cart?operation=adicionaItem" || settings.url == "/checkout/cart?operation=removeItem") {
            init();
        }
    });
    init();
});



function init() {
    getIdRemoveBrindes().then(() => {
        console.log('Todos os brindes foram removidos.');
        // Aqui você pode adicionar qualquer lógica adicional que deve ocorrer após a remoção dos brindes
    }).catch(error => {
        console.error('Houve um erro ao remover os brindes:', error);
    });
    createLayoutBase();
    updateProgressBar();
    verificarEAdicionarBrindeCarrinho();
    verificarValorCarrinhoEAtualizarBrinde();
    AdicionaBotaoProximo();
    $('.validar').click(function(){
        validarCheck();
    });
}

function validarCheck() {
    // Verifica se algum brinde foi selecionado no localStorage
    const brindeSelecionadoCodigo = localStorage.getItem('brindeTamanhoSelecionado');
    
    // Se um brinde foi selecionado, tenta adicioná-lo ao carrinho
    if (brindeSelecionadoCodigo) {
        AddBrindeCarrinho(brindeSelecionadoCodigo).then(() => {
            // Se o brinde foi adicionado com sucesso, redireciona para o pagamento
            console.log('Brinde adicionado ao carrinho, pode prosseguir para o pagamento.');
            $('.btn-next').click();
            //window.location.href = '/caminho-para-pagamento'; // Substitua pelo caminho correto
        }).catch((error) => {
            // Se houve um erro ao adicionar o brinde, trata o erro
            console.error('Erro ao adicionar o brinde:', error);
            // Aqui você pode mostrar uma mensagem ao usuário ou tomar alguma ação de recuperação
        });
    } else {
        // Se nenhum brinde foi selecionado, emite um alerta e impede o prosseguimento
        alert('Por favor, selecione um brinde antes de prosseguir para o pagamento.');
    }
}


async function getIdRemoveBrindes() {
    console.log('removendo brinde');
    const promises = [];
    $('.cart-item').each(function() {
      console.log('1')
      const $cartItem = $(this);
      if ($cartItem.text().includes("CAMPANHA")) {
        console.log('achou')
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
      url: 'https://semprebasicos.sandbox.magazord.com.br/checkout/cart?operation=deleteItem',
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

async function AddBrindeCarrinho(codigo) {
    var data = new FormData();
    data.append("produtos[0][codigo]", codigo);
    data.append("produtos[0][quantidade]", 1);
    data.append("produtos[0][deposito]", 0);

    try {
        const response = await $.ajax({
            url: "https://semprebasicos.sandbox.magazord.com.br/checkout/cart?operation=AddMultiples",
            data: data,
            type: "POST",
            processData: false,
            contentType: false
        });

        console.log("Brinde adicionado com sucesso:", response);
        // Aqui você pode adicionar qualquer lógica adicional necessária após a adição bem-sucedida
        return response; // Retorna a resposta para o chamador
    } catch (err) {
        console.error("Erro ao adicionar o brinde:", err.responseText);
        throw new Error("Erro ao adicionar o brinde no carrinho"); // Lança um erro para ser capturado pelo chamador
    }
}




function AdicionaBotaoProximo(){
    var botaovalidar = `
      <a 
      class="validar"
      style=" width: 100%; -webkit-text-size-adjust: 100%; --cor-primaria: #fff; --cor-bordas: #e1e1e1; --cor-texto: #252525; --cor-texto-secundario: #666; --cor-base-darken-strong: #000; --cor-verde-action: #5ba637; --cor-verde-action-hover: #4a9028; --container: 1240px; --cor-base: #000000; --cor-base-light: #1a1a1a; --cor-base-light-20: #cccccc; --cor-base-light-10: #f3f3f3; --cor-base-darken: #000000; --cor-secundaria: #000000; font: inherit; overflow: visible; text-transform: none; -webkit-appearance: button; position: relative; min-width: 100px; min-height: 30px; margin: 0; padding: 5px 10px; text-align: center; text-overflow: ellipsis; line-height: 30px; cursor: pointer; box-sizing: border-box; border-style: solid; border-width: 1px; color: #fff; border-radius: 4px; font-size: .8125em; font-weight: bold; background: #04a16d; border-color: #04a16d; width: 78%;">
      <span>
        Ir para o pagamento
      </span>
      <span class="icon-seta-dir">
      </span>
      </a>`;
    
      $('.validar').remove();
      $('.btn-next').hide();
      $('.summary-fixed').append(botaovalidar);
      $('.proxima-etapa').append(botaovalidar);
    }



function verificarEtapaAtual() {
    // Valor total do carrinho
    const valorCarrinho = GetValorCarrinho();
    console.log('Valor do carrinho', valorCarrinho);

    // Usar o método verificarValorAlvo para verificar se o valor do carrinho atingiu o valor alvo
    const etapaAlcancada = etapa1.verificarValorAlvo(valorCarrinho);
    console.log('Etapa alcançada:', etapaAlcancada);

    return etapaAlcancada;
}

function verificarEAdicionarBrindeCarrinho() {
    // Verifica se existe uma seleção de brinde no localStorage
    const brindeSelecionadoCodigo = localStorage.getItem('brindeTamanhoSelecionado');
    if (brindeSelecionadoCodigo && $('.lista-carrinho .cart-item.brinde').length === 0) {
        // Encontra o brinde correspondente ao código armazenado
        const brinde = encontrarBrindePorCodigo(brindeSelecionadoCodigo);
        if (brinde) {
            // Adiciona o layout do brinde no carrinho
            addLayoutItemBrindeCarrinho(brinde);
        }
    }
}


function removerLayoutBrindeCarrinho() {
    // Selecione o elemento do brinde no carrinho e remova-o
    $('.lista-carrinho .cart-item.brinde').remove();
}

function verificarValorCarrinhoEAtualizarBrinde() {
    const valorCarrinho = GetValorCarrinho();
    const valorAlvo = etapa1.configuracao.valorAlvo;

    if (valorCarrinho < valorAlvo) {
        // Se o valor do carrinho for menor que o valor alvo, remova o brinde do localStorage
        localStorage.removeItem('brindeTamanhoSelecionado');

        // Remova o layout do brinde do carrinho
        removerLayoutBrindeCarrinho();
    } else {
        // Se o valor do carrinho ainda está acima do valor alvo, verifique se o brinde já foi selecionado
        verificarEAdicionarBrindeCarrinho();
    }
}

function addLayoutItemBrindeCarrinho(brinde) {
    const { nome, img_etapa, tamanho } = brinde; // Agora também pega o tamanho do brinde

    const divCarrinhoBrinde = `
        <div class="cart-item brinde" data-item-deposito="1">
            <div class="flex center space-between">
                <div class="column-itens flex center">
                    <figure style="margin-left: 15px;"><img itemprop="thumbnailUrl" title="" src="${img_etapa}" alt="${nome} - ${tamanho.descricao}" width="290" height="290"></figure>
                    <div class="nome-produto flex column">
                        <a href="#" title="${nome}"><strong>Brinde Selecionado<br></strong>  ${nome} - ${tamanho.descricao}</a>  
                        <a href="javascript:;" class="btntrocar" style="
                            background: #871f82;
                            color: white;
                            width: 100px;
                            text-align: center;
                            padding: 5px;
                            border-radius: 7px;
                            margin-top: 5px;
                        ">Trocar Brinde</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('.lista-carrinho').append(divCarrinhoBrinde);

    $('.btntrocar').click(function () {
        localStorage.removeItem('brindeTamanhoSelecionado');
        Zord.checkout.atualizaQuantidadeEspecificaCarrinho();
    });
}


function encontrarBrindePorCodigo(codigo) {
    for (let brinde of etapa1.brindes) {
        for (let variacao of brinde.variacoes) {
            for (let tamanho of variacao.tamanhos) {
                if (tamanho.codigo === codigo) {
                    return {
                        nome: brinde.nome,
                        img_etapa: variacao.imagem,
                        tamanho: tamanho // Agora também retorna o tamanho
                    };
                }
            }
        }
    }
    return null; // Retorna null se o brinde não for encontrado
}



function GetValorCarrinho() {
    var valorTotal = $('.valores .value').text();
    valorTotal = valorTotal.replace('R$', '').replace(/\./g, '').replace(',', '.');
    console.log('função get', valorTotal);
    return parseFloat(valorTotal);
}

function updateProgressBar() {
    const valorCarrinho = GetValorCarrinho();
    const valorAlvo = etapa1.configuracao.valorAlvo; // Supondo que você tenha uma etapa com valorAlvo definido
    const porcentagem = (valorCarrinho / valorAlvo) * 100;

    $('.progress-bar-fill').css('width', `${porcentagem}%`);
    $('.progress-message strong').text(`${porcentagem.toFixed(0)}%`);

    // Se o valor do carrinho atingir ou ultrapassar o valor alvo, adicione a borda roxa
    if (valorCarrinho >= valorAlvo) {
        $('.progress-icon').css('border-color', '#871f82');

        const brindeSelecionadoCodigo = localStorage.getItem('brindeTamanhoSelecionado');
        if(brindeSelecionadoCodigo){
            $('.progress-message').text('Você ganhou um brinde! ele ja está no seu carrinho!');
        }else{
            $('.progress-message').text('Você ganhou um brinde! selecione!');
        }
         // Mensagem de sucesso
        createEscolhaBrindeLayout()
    } else {
        const valorRestante = valorAlvo - valorCarrinho;
        $('.progress-icon').css('border-color', 'transparent');
        $('.progress-message').text(`Faltam R$ ${valorRestante.toFixed(2)} para você completar e ganhar um brinde`); // Mensagem de quanto falta
    }
}

function checkBrindeLimit(etapaName) {
    // Implemente a lógica para verificar o limite de brindes
    // Exemplo:
    let brindesSelecionados = JSON.parse(localStorage.getItem(etapaName)) || [];
    return brindesSelecionados.length < MAX_BRINDES_PERMITIDOS; // Substitua MAX_BRINDES_PERMITIDOS pelo seu valor real
}


function createEscolhaBrindeLayout() {
    // Limpa as opções de brindes anteriores
    $('.caseEscolhaBrinde .opcoesbrindes').empty();

    if (localStorage.getItem('brindeTamanhoSelecionado')) {
        // Se existir, esconde as opções de brindes e não continua com a função
        $('.caseEscolhaBrinde').hide();
        console.log('Seleção de brinde já existe no localStorage.');
        return; // Sai da função para não executar o restante do código
    }

    etapa1.brindes.forEach((brinde) => {
        let selectVariacaoElement = '';
        let initialImg = brinde.variacoes.length > 0 ? brinde.variacoes[0].imagem : '';

        if (brinde.tipoVariacao === 'cor' && brinde.variacoes.length > 0) {
            const optionsVariacao = brinde.variacoes.map(variacao => `<option value="${variacao.codigo}" data-img="${variacao.imagem}">${variacao.descricao}</option>`).join('');
            selectVariacaoElement = `<select class="select-variacao" data-brinde-nome="${brinde.nome}">${optionsVariacao}</select>`;
        }

        const brindeElement = `
            <div class="brinde-opcao">
                <div class="imgbrinde">
                    <img class="brinde-img" src="${initialImg}">
                </div>
                <span>${brinde.nome}</span>
                ${selectVariacaoElement}
                <select class="select-tamanho"></select>
                <button class="btn-brinde">Selecionar</button>
            </div>`;
        $('.caseEscolhaBrinde .opcoesbrindes').append(brindeElement);
    });

    // Atualiza os tamanhos e a imagem com base na variação selecionada
    $('.select-variacao').on('change', function () {
        const selectedVariacaoCodigo = $(this).val();
        const brindeNome = $(this).data('brinde-nome');

        // Encontra o brinde correspondente pelo nome
        const brinde = etapa1.brindes.find(b => b.nome === brindeNome);

        if (!brinde) {
            console.error('Brinde não encontrado:', brindeNome);
            return;
        }

        // Encontra a variação correspondente pelo código
        const variacao = brinde.variacoes.find(v => v.codigo === selectedVariacaoCodigo);

        if (!variacao) {
            console.error('Variacao não encontrada para o código:', selectedVariacaoCodigo);
            return;
        }

        // Atualiza a imagem com base na variação selecionada
        const imgSrc = variacao.imagem || $(this).find('option:selected').data('img'); // Usa a imagem da variação ou a URL do atributo de dados
        $(this).closest('.brinde-opcao').find('.brinde-img').attr('src', imgSrc);

        // Atualiza os tamanhos disponíveis para a variação selecionada
        const selectTamanho = $(this).closest('.brinde-opcao').find('.select-tamanho');
        selectTamanho.empty(); // Limpa os tamanhos anteriores

        variacao.tamanhos.forEach(tamanho => {
            selectTamanho.append(`<option value="${tamanho.codigo}">${tamanho.descricao}</option>`);
        });
    });

    // Inicializa os tamanhos para a primeira variação selecionada
    $('.select-variacao').each(function () {
        $(this).trigger('change');
    });

    $('.btn-brinde').click(function (event) {
        event.preventDefault();
        const tamanhoCodigo = $(this).siblings('.select-tamanho').val();

        // Adiciona o código do tamanho do brinde selecionado ao localStorage
        localStorage.setItem('brindeTamanhoSelecionado', tamanhoCodigo);

        // Desabilita a seleção e remove o botão após a escolha
        $(this).siblings('.select-variacao, .select-tamanho').prop('disabled', true);
        $(this).remove();

        // Esconde a seleção de brindes após a escolha
        $('.caseEscolhaBrinde').hide();
        $('.caseEscolhaBrinde').hide();
        console.log('hidou2')
        Zord.checkout.atualizaQuantidadeEspecificaCarrinho();

        // Aqui você pode adicionar qualquer outra lógica necessária após a seleção do brinde
        // Por exemplo, atualizar o carrinho, mostrar uma mensagem de confirmação, etc.
    });




}


function createLayoutBase() {
    const style = `
    <style><!--

    .opcoesbrindes{
      width: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    }

    .imgbrinde{
      width:50%;
    }

    .brinde-opcao{
      width: 200px;
    margin-top: 25px;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    align-items: center;

    }

    .opcoesbrindes .select-variacao{
      width:100%;
      border-radius: 9px;
    }

    .opcoesbrindes button{
          width: 100%;
    background-color: #871f82;
    color: white;
    border-radius: 5px;
    margin-top: 5px;
    }

    .caseEscolhaBrinde{
        
      display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    background: white;
    margin-bottom: 25px;
    padding: 25px;
    }


    .caseProgresso{
    margin-bottom: 31px;
    width: 100%;
    margin-top: 30px;
    }

    .caseimgbrinde{
        overflow:hidden;
        width:80px;
        border-radius: 50px;
    }


    .etapa-atingida {
    border: 2px solid #871f82;
}

    .progress-bar {
    width: 85%;
    height: 13px;
    background-color: #ffffff;
    position: relative;
    margin-bottom: 10px;
    border-radius: 7px;
    }

    .alternativaMsg{
    display: flex;
    flex-direction: column;
    align-items: center;
    }

    .brinde-conquistado {
        background-color: #fff;
        border-radius: 55px;
        border: 5px #04a16d solid;
    }

    .alternativaMsg p{
    width: 82px;
    font-size: 9px;
    margin-bottom: 5px;
    }

    .alternativaMsg h2{
    font-size: 50px;
    background: #000000;
    border-radius: 13px;
    padding: 0px 10px;
    color: white;
    }

    .progress-bar-fill {
    width: 0%;
    height: 100%;
    background-color: #871f82;
    position: absolute;
    top: 0;
    left: 0;
    max-width: 100%;
        border-radius: 5px;
    border: 3px white solid;
}
    }

    .progress-message{
    font-size: 10px;
    text-align: left;
    padding-top: 0px;
    }

    .progress-message strong{
    font-size:15px;
    }


    .progress-message h2{
    font-size: 17px;
    width: 100%;
    background: black;
    color: white;

    }

    .shirt-icon2 {
    position: absolute;
    top: 5px;
    transform: translateX(-50%);
    animation: float 1s ease-in-out infinite;
    width: 50px;
    margin-top: 2px;
    border-radius: 55px;
}

    .shirt-icon {
    position: absolute;
    top: 5px;
    transform: translateX(-50%);
    animation: float 1s ease-in-out infinite;
    width: 43px;
    margin-top: 3px;
    border-radius: 55px
    }

    @keyframes float {
    0% {
    transform: translateY(-25px);

    }
    50% {
    transform: translateY(-30px);

    }
    100% {
    transform: translateY(-25px);
    }
    }

    .progress-message{
        font-size: 12px;
        font-size: 12px;
    margin-top: 17px;
    margin-bottom: 12px;
    }

    .progress-message strong{
        color: #e5006d;
    }

   

    .btnTrocar{
      background: #00a441;
    padding: 5px 15px;
    border-radius: 4px;
    color: white;
    font-weight: bolder;
    font-size: 12px;
    }
    .msgsuperior{
      margin-top: -24px;
    position: absolute;
    font-weight: bolder;
    font-size: 15px;

    }

    .progress-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-image: url(https://global.cdn.magazord.com.br/semprebasicos/img/2023/11/avatar/247/etapabrinde.png);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        position: absolute;
        padding:5px;
        right: -55px;
        top: 50%;
        transform: translateY(-50%);
        border: 3px solid transparent;
        transition: border-color 0.3s;
    }
    
    
    /* Quando a barra de progresso estiver cheia, mude a borda da bolinha para roxa */
    .progress-bar-fill.etapa-atingida + .progress-icon {
        border-color: #871f82; /* Cor roxa */
    }
    --></style>
    `

    $('body').append(style);

    $(".title-cart-area").after(`

        <div class="caseProgresso"> </div>

      <div class="caseEscolhaBrinde">
      <h1></h1>
      <div class="opcoesbrindes">
      </div>

      </div>
      <div class="casebtnAlterar">
         
      </div>
      `);

    const divprogress = `<div class="progress-bar">
    <div class="msgsuperior">
<p>Complete 200 reais e ganhe uma camiseta</p>
    </div>
    <div class="progress-bar-fill"></div>
    <div class="progress-icon"></div>

    </div>
    <div class="progress-message"></div>`
    $('.caseProgresso').append(divprogress);
    console.log('criou');

    var etapaAtual = verificarEtapaAtual();
    let msgAViso;
    if (etapaAtual) {

        msgAViso = 'Oba! Você ganhou 1 brinde, selecione a baixo:';
        $('.caseEscolhaBrinde h1').html(msgAViso);
    } else {
        $('.caseEscolhaBrinde h1').html('');
    }
    if ($('.progress-icon').length === 0) {
        $('.progress-bar').append('<div class="progress-icon"></div>');
    }
}