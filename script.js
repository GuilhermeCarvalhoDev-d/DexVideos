function carregarDadosVideos() {
    const cards = document.querySelectorAll('.video');

    cards.forEach(card => {
        const videoId = card.getAttribute('data-videoid');
        if (!videoId) return;

        // 1. Coloca a capa (thumbnail) e o link no botão da imagem (#btvideo e #iconvideo)
        const img = card.querySelector('#iconvideo');
        const linkImg = card.querySelector('#btvideo');
        if (img) img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        if (linkImg) linkImg.href = `https://www.youtube.com/watch?v=${videoId}`;

        // 2. Coloca o link do vídeo no botão do título (#btnomevideo)
        const linkTitulo = card.querySelector('#btnomevideo');
        if (linkTitulo) linkTitulo.href = `https://www.youtube.com/watch?v=${videoId}`;

        // 3. Importa Título e Canal da API oEmbed do YouTube
        const urlOembed = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

        fetch(urlOembed)
            .then(res => res.json())
            .then(data => {
                // Preenche o Título (#titulo-video)
                const titulo = card.querySelector('#titulo-video');
                if (titulo) titulo.innerText = data.title;

                // Preenche o Autor (.autorl)
                const autor = card.querySelector('.autorl');
                if (autor) {
                    autor.innerText = data.author_name;
                    autor.href = data.author_url;
                }
            })
            .catch(() => {
                const titulo = card.querySelector('#titulo-video');
                if (titulo) titulo.innerText = 'Título indisponível';
            });
    });
}

document.addEventListener('DOMContentLoaded', carregarDadosVideos);



// Função para configurar a barra de pesquisa
function configurarPesquisa() {
    const inputPesquisa = document.getElementById('search');
    if (!inputPesquisa) return;

    inputPesquisa.addEventListener('keypress', function(e) {
        // Executa a busca ao pressionar 'Enter'
        if (e.key === 'Enter') {
            const termoBusca = inputPesquisa.value.toLowerCase().trim();
            if (!termoBusca) return;

            const cards = document.querySelectorAll('.video');
            let encontrado = false;

            cards.forEach(card => {
                const tituloElemento = card.querySelector('#titulo-video');
                if (!tituloElemento) return;

                const tituloTexto = tituloElemento.innerText.toLowerCase();

                // Verifica se o título do vídeo contém o texto digitado
                if (tituloTexto.includes(termoBusca) && !encontrado) {
                    encontrado = true;

                    // Rola a página até o card encontrado
                    card.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });

                    // Aplica um efeito de destaque temporário
                    card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                    card.style.transform = 'scale(1.05)';
                    card.style.boxShadow = '0 0 15px #ff0000';

                    // Remove o destaque após 2 segundos
                    setTimeout(() => {
                        card.style.transform = 'scale(1)';
                        card.style.boxShadow = 'none';
                    }, 2000);
                }
            });

            if (!encontrado) {
                alert('Nenhum vídeo encontrado com esse título!');
            }
        }
    });
}

// Executa a configuração da pesquisa junto com os dados da página
document.addEventListener('DOMContentLoaded', () => {
    carregarDadosVideos();
    configurarPesquisa();
});



const formulario = document.getElementById("loginForm");

// Função para gerar SHA-256
async function gerarHashSHA256(texto) {

    const encoder = new TextEncoder();
    const dados = encoder.encode(texto);

    const hashBuffer = await crypto.subtle.digest("SHA-256", dados);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    const hashHex = hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");

    return hashHex;
}


formulario.addEventListener("submit", async function(event) {

    event.preventDefault();

    // Dados do formulário
    const usuario = document.getElementById("user").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const endereco = document.getElementById("endereco").value;
    const cpf = document.getElementById("cpf").value;

    // Imagem
    const imagem = document.getElementById("imagemuser");

    if (imagem.files.length === 0) {
        alert("Selecione uma imagem!");
        return;
    }

    const arquivoImagem = imagem.files[0];

    // Gerar hash SHA-256 da senha
    const senhaHash = await gerarHashSHA256(senha);

    // Dados que serão salvos
    const dados =
        "====================================\n" +
        "        DEXVIDEOS - CADASTRO\n" +
        "====================================\n\n" +

        "Usuário: " + usuario + "\n" +
        "E-mail: " + email + "\n" +
        "Senha SHA-256: " + senhaHash + "\n" +
        "Endereço: " + endereco + "\n" +
        "CPF: " + cpf + "\n" +
        "Imagem: " + arquivoImagem.name + "\n" +
        "Tipo da imagem: " + arquivoImagem.type + "\n" +
        "Tamanho: " + arquivoImagem.size + " bytes\n\n" +

        "Data do cadastro: " +
        new Date().toLocaleString("pt-BR") +
        "\n\n" +

        "====================================";


    // Criar arquivo TXT
    const arquivoTXT = new Blob(
        [dados],
        {
            type: "text/plain;charset=utf-8"
        }
    );


    // Criar link para download
    const link = document.createElement("a");

    link.href = URL.createObjectURL(arquivoTXT);

    link.download = usuario + "_dexvideos.txt";

    link.click();

    // Liberar memória
    URL.revokeObjectURL(link.href);

    alert("Cadastro realizado com sucesso!");

});

const inputImagem = document.getElementById("imagemuser");
const previewImagem = document.getElementById("previewImagem");

inputImagem.addEventListener("change", function() {

    const arquivo = this.files[0];

    if (arquivo) {

        const urlImagem = URL.createObjectURL(arquivo);

        previewImagem.src = urlImagem;

        previewImagem.style.display = "block";

    } else {

        previewImagem.style.display = "none";
        previewImagem.src = "";

    }

});
