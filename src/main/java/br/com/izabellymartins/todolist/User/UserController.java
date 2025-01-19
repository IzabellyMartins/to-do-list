package br.com.izabellymartins.todolist.User;

import at.favre.lib.crypto.bcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private IUserRepository userRepository;

    // Endpoint para criar um novo usuário
    @PostMapping("/cadastro")
    public ResponseEntity<?> create(@RequestBody UserModel userModel) {
        var user = this.userRepository.findByEmail(userModel.getEmail());
        if (user != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("mensagem", "Esse e-mail já está sendo usado."));
        }

        // Hash de senha antes de salvar o usuário no banco
        var senhaCriptografada = BCrypt.withDefaults().hashToString(12, userModel.getPassword().toCharArray());
        userModel.setPassword(senhaCriptografada);

        try {
            // Salvando o usuário no banco
            UserModel userCreated = userRepository.save(userModel);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("mensagem", "Usuário criado com sucesso!", "user", userCreated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("mensagem", "Erro ao realizar cadastro."));
        }
    }


    @GetMapping("/email-exists")
    public ResponseEntity<?> emailExists(@RequestParam String email) {
        var user = this.userRepository.findByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(Map.of("exists", true));
        }
        return ResponseEntity.ok(Map.of("exists", false));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        // Verificar se o e-mail existe no banco
        var user = this.userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("mensagem", "E-mail ou senha inválidos."));
        }

        // Verificar a senha
        var isPasswordValid = BCrypt.verifyer().verify(password.toCharArray(), user.getPassword()).verified;
        if (!isPasswordValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("mensagem", "E-mail ou senha inválidos."));
        }

        // Retornar mensagem de sucesso
        return ResponseEntity.ok(Map.of("mensagem", "Login realizado com sucesso!", "user", user));
    }

}

