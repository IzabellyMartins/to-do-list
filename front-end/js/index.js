document.addEventListener('DOMContentLoaded', function () {
    // Inserir o conteúdo da barra de navegação
    document.getElementById('navbar-placeholder').innerHTML = `
    <nav class="navbar">
        <div class="navbar-logo">
            <img src="assets/taskicon.png" alt="logo">
            <span class="navbar-title">To Do List</span>
        </div>
        <a href="#" class="toggle-button">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </a>
        <div class="navbar-links">
            <ul>
                <li><a href="index.html">Início</a></li>
                <li><a href="login.html">Entrar</a></li>
                <li><a href="#">Sobre</a></li>
                <li><a href="#">Contato</a></li>
            </ul>
        </div>
    </nav>
    `;

    // Adicionar funcionalidade ao botão toggle
    const toggleButton = document.getElementsByClassName("toggle-button")[0];
    const navbarLinks = document.getElementsByClassName("navbar-links")[0];

    toggleButton.addEventListener("click", () => {
        navbarLinks.classList.toggle("active");
    });
});




