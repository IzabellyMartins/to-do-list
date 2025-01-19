document.addEventListener("DOMContentLoaded", function () {
    // Inserir o conteúdo da barra de navegação
    document.getElementById("navbar-placeholder").innerHTML = `
    <nav class="navbar">
        <div class="navbar-logo">
            <img src="assets/taskicon.png" alt="logo">
            <span class="navbar-title">Lista de Tarefas</span>
        </div>
        <a href="#" class="toggle-button">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </a>
        <div class="navbar-links">
            <ul>
                <li><a href="index.html">Início</a></li>
                <li id="auth-link"><a href="login.html">Entrar</a></li>
                <li><a href="#">Sobre</a></li>
                <li><a href="#">Contato</a></li>
            </ul>
        </div>
    </nav>
    `;

    const toggleButton = document.getElementsByClassName("toggle-button")[0];
    const navbarLinks = document.getElementsByClassName("navbar-links")[0];

    toggleButton.addEventListener("click", () => {
        navbarLinks.classList.toggle("active");
    });

    // Verificar se o usuário está logado e ajustar o link de "Entrar/Sair"
    const authLink = document.getElementById("auth-link");
    const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";

    if (isLoggedIn) {
        authLink.innerHTML = `<a href="#" id="logout-link">Sair</a>`;

        // Adicionar evento ao novo botão "Sair"
        const logoutLink = document.getElementById("logout-link");
        logoutLink.addEventListener("click", function (e) {
            e.preventDefault();
            sessionStorage.removeItem("loggedIn");
            exibirMensagem("sucesso", "Deslogado com sucesso!");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 3000);
        });
    }

    // Adicionar funcionalidade ao formulário de cadastro
    const form = document.querySelector("form");
    if (form && form.id === "registerForm") {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            const nome = document.getElementById("nome").value;
            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;
            const confirmarSenha = document.getElementById("confirmar-senha").value;

            if (senha !== confirmarSenha) {
                exibirMensagem("erro", "As senhas não conferem.");
                return;
            }

            try {
                const emailResponse = await fetch(`/users/email-exists?email=${email}`);
                const emailExists = await emailResponse.json();

                if (emailExists.exists) {
                    exibirMensagem("erro", "Este e-mail já está em uso.");
                    return;
                }

                const response = await fetch("/users/cadastro", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nome, email, password: senha }),
                });

                const data = await response.json();

                if (response.status === 201) {
                    exibirMensagem("sucesso", "Usuário cadastrado com sucesso!");
                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 3000);
                } else {
                    exibirMensagem("erro", data.mensagem || "Erro ao realizar cadastro.");
                }
            } catch (error) {
                exibirMensagem("erro", "Erro ao conectar com o servidor.");
            }
        });
    }

    // Adicionar funcionalidade ao formulário de login
    const loginForm = document.querySelector("#loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("senha").value;

            try {
                const response = await fetch("/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    exibirMensagem("sucesso", data.mensagem);
                    sessionStorage.setItem("loggedIn", "true");
                    setTimeout(() => {
                        window.location.href = "dashboard.html";
                    }, 3000);
                } else {
                    exibirMensagem("erro", data.mensagem || "Erro ao realizar login.");
                }
            } catch (error) {
                exibirMensagem("erro", "Erro ao conectar com o servidor.");
            }
        });
    }
});

// Função reutilizável para exibir mensagens de sucesso ou erro
function exibirMensagem(tipo, mensagem) {
    let mensagemContainer = document.getElementById("mensagem");

    if (!mensagemContainer) {
        mensagemContainer = document.createElement("div");
        mensagemContainer.id = "mensagem";
        mensagemContainer.style.position = "relative";
        mensagemContainer.style.marginBottom = "15px";
        document.querySelector("form")?.insertAdjacentElement("beforebegin", mensagemContainer);
    }

    mensagemContainer.innerHTML = `
        <div class="mensagem-conteudo ${tipo === "sucesso" ? "mensagem-sucesso" : "mensagem-erro"}">
            ${mensagem}
        </div>
    `;

    mensagemContainer.style.display = "block";
    setTimeout(() => {
        mensagemContainer.style.display = "none";
    }, 3000);
}









