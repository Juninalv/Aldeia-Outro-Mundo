async function carregarPagina(url) {
  try {
    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error("Página não encontrada.");
    }

    const conteudo = await resposta.text();

    document.querySelector("#main-content").innerHTML = conteudo;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } catch (erro) {
    console.error(erro);
  }
}