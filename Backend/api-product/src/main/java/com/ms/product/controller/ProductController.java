package com.ms.product.controller;


import com.ms.product.dto.ProductDTO;
import com.ms.product.exceptions.ProductNofFoundException;
import com.ms.product.exceptions.ServiceException;
import com.ms.product.services.ProductService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping(value="/api/products")
@Slf4j
@CrossOrigin

public class ProductController {

    private final ProductService service;

    @Autowired
    public ProductController(ProductService service) {

        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> findAll() {
        try {
            List<ProductDTO> products = service.findAll();
            if (products.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(products);
        } catch (ServiceException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<ProductDTO> create(@RequestParam("file") MultipartFile file, @RequestPart("product") ProductDTO productDTO) {
        try {
            String image = service.saveImage(file);
            productDTO.setImage(image);

            ProductDTO createdProduct = service.create(productDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (ServiceException | IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }


    @GetMapping(value="/getId/{id}")
    public ResponseEntity<ProductDTO> findById(@PathVariable String id) {
        try {
            ProductDTO product = service.findById(id);
            return ResponseEntity.ok(product);
        } catch (ServiceException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping(value="/getName/{name}")
    public ResponseEntity<ProductDTO> findByName(@PathVariable String name) {
        try {
            ProductDTO client = service.findByName(name);
            if (client != null) {
                return ResponseEntity.ok(client);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(value="/findByIdCategory/{idCategory}")
    public ResponseEntity<List<ProductDTO>>  findByIdCategory(@PathVariable String idCategory) {
        try {
            List<ProductDTO> products = service.findByIdCategory(idCategory);
            if (products.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(products);
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(value="/findByDiscount/")
    public ResponseEntity<List<ProductDTO>>  findByDiscount() {
        try {
            List<ProductDTO> products = service.findByDiscount("1","99");
            if (products.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(products);
        } catch (ServiceException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping(value="/{id}",  consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDTO> update(@PathVariable String id, @RequestPart(value = "file",
            required = false) MultipartFile file, @RequestPart("product") @Valid ProductDTO productDTO) {
        try {
            if (file != null && !file.isEmpty()) {
                String image = service.saveImage(file);
                productDTO.setImage(image);
            }
                ProductDTO updatedProduct = service.update(id, productDTO, file);
                return ResponseEntity.ok(updatedProduct);
            } catch(ProductNofFoundException e){
                return ResponseEntity.notFound().build();
            }
                catch (ServiceException | IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
}



    @DeleteMapping(value="/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            service.delete(id);
            return ResponseEntity.ok().build();
        } catch (ServiceException e) {
            return ResponseEntity.notFound().build();
        }
    }
}