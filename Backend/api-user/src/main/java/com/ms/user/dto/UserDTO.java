package com.ms.user.dto;


import com.ms.user.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.BeanUtils;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO implements Serializable {


    private String id;

    @NotBlank
    @Pattern(regexp = "^[A-Z][a-z]+\s[A-Z][a-z]+$",
            message = "O nome completo deve conter: " +
                    "Nome e sobrenome com iniciais em Letra Maiúscula!")
    private String name;

    @NotBlank
    @Pattern(regexp = "^[a-z]{6}$",
            message = "O username não pode estar vazio: " +
                    "O username deve conter 6 letras, apenas letras minúsculas, sem espaços em branco ou números!")
    private String username;


    @NotBlank
    private String password;


    @NotBlank
    @Email
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            message = "Insira um e-mail válido (Ex:teste@teste.com)")
    private String email;

    @NotBlank
    private String registryUser;

    private String created;

    private String updated;


    public UserDTO (User entity){
        BeanUtils.copyProperties(entity, this);
    }
}
