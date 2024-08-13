package com.category.category.controller;

import com.category.category.domain.dto.CategoryDTO;
import com.category.category.exception.CategoryException;
import com.category.category.exception.CategoryNotFoundException;
import com.category.category.service.CategoryService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/category")
@CrossOrigin
@Slf4j
public class CategoryController {

    @Value("${app.path.files}")
    String pathFiles;
    private final CategoryService service;


    @Autowired
    public CategoryController(CategoryService service) {
        this.service = service;
    }


    @PostMapping("/create")
    public ResponseEntity create(@RequestParam("file") MultipartFile file, @RequestPart("category") @Valid CategoryDTO categoryDTO) {
        try {
            String image = service.saveImage(file);
            categoryDTO.setImage(image);

            CategoryDTO createdCategory = service.create(categoryDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/upload/file")
    public ResponseEntity<Map<String, String>> saveFile(@RequestParam("file") MultipartFile file) {
        var fileName = file.getOriginalFilename();
        var path = pathFiles + fileName;
        try {
            Files.copy(file.getInputStream(), Path.of(path), StandardCopyOption.REPLACE_EXISTING);
            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", fileName);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("mensagem", "Erro ao carregar o arquivo!");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/findAll")
    public ResponseEntity<List<CategoryDTO>> findAll() {
        try{
            List<CategoryDTO> categories = service.findAll();
            if(categories.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }


    @GetMapping("/findByTypeService")
    public ResponseEntity<List<CategoryDTO>> findByTypeService() {
        try{
            List<CategoryDTO> categories = service.findByTypeService();
            if(categories.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/findByTypeProduct")
    public ResponseEntity<List<CategoryDTO>> findByTypeProduct() {
        try{
            List<CategoryDTO> categories = service.findByTypeProduct();
            if(categories.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<CategoryDTO> findById(@PathVariable String id) {
        try{
            CategoryDTO category = service.findById(id);
            return ResponseEntity.ok(category);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CategoryDTO> update(@PathVariable String id, @RequestPart(value = "file",
            required = false) MultipartFile file, @RequestPart("category") @Valid CategoryDTO categoryDTO) {
        try {
            if (file != null && !file.isEmpty()) {
                String image = service.saveImage(file);
                categoryDTO.setImage(image);
            }
            CategoryDTO updatedCategory = service.update(id, categoryDTO);
            return ResponseEntity.ok(updatedCategory);
        } catch (CategoryNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (CategoryException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try{
            service.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
