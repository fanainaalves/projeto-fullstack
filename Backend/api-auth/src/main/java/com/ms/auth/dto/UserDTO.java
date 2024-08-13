package com.ms.auth.dto;

import com.ms.auth.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.BeanUtils;
import org.springframework.data.annotation.Id;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO implements Serializable {

    @Id
    private String id;

    @NotBlank
    @Pattern(regexp = "^[A-Z][a-z]+\s[A-Z][a-z]+$",
            message = "O nome completo deve conter: " +
                    "Nome e sobrenome com iniciais em Letra Maiúscula!")
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Pattern(regexp = "^[a-z]{6}$",
            message = "O username não pode estar vazio: " +
                    "O username deve conter 6 letras, apenas letras minúsculas, sem espaços em branco ou números!")
    private String username;


    public UserDTO (User entity){
        BeanUtils.copyProperties(entity, this);
    }

}
