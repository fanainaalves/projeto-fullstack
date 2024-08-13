package com.ms.user.services;

import com.ms.user.dto.UserDTO;
import com.ms.user.exceptions.ServiceException;
import com.ms.user.exceptions.UserNotFoundException;
import com.ms.user.model.User;
import com.ms.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {

    @Autowired
    UserRepository repository;

    private final PasswordEncoder passwordEncoder;


    public List<UserDTO> findAll() throws ServiceException {
        List<User> list = repository.findAll();
        if (list.isEmpty()) {
            throw new UserNotFoundException("No users found");
        }
        return list.stream().map(UserDTO::new).toList();
    }

    @Transactional
    public UserDTO create(UserDTO userDTO) throws ServiceException {
        User entity = new User(userDTO);
        entity.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        entity.setRegistryUser(userDTO.getRegistryUser());
        entity.setCreated(LocalDateTime.now().toString());
        repository.save(entity);
        return new UserDTO(entity);
    }

    public UserDTO findById(String id) throws ServiceException {
        return repository.findById(id)
                .map(UserDTO::new)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));
    }

    public UserDTO findByEmail(String email) throws ServiceException {
        return repository.findByEmail(email)
                .map(UserDTO::new)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    @Transactional
    public UserDTO update(String id, UserDTO userDTO) throws ServiceException {
        Optional<User> optionalUser = repository.findById(id);
        if (optionalUser.isPresent()) {
            User entity = optionalUser.get();
            entity.setName(userDTO.getName());
            entity.setUsername(userDTO.getUsername());
            entity.setEmail(userDTO.getEmail());
            entity.setRegistryUser(userDTO.getRegistryUser());
            entity.setUpdated(LocalDateTime.now().toString());

            if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
                entity.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            }

            repository.save(entity);
            return new UserDTO(entity);
        } else {
            throw new UserNotFoundException("User not found with ID: " + id);
        }
    }

    public void delete(String id) throws ServiceException {
        if (!repository.existsById(id)) {
            throw new UserNotFoundException("User not found with ID: " + id);
        }
        repository.deleteById(id);
    }
}

