package com.ms.product.dto;


import com.ms.product.model.Product;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.BeanUtils;
//import jakarta.validation.constraints.NotBlank;


import java.io.Serializable;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO implements Serializable {

    private String id;
    @NotBlank
    private String name;
    private String description;
    private String idCategory;
    private String brand;
    private String stock;
    private String supplier;
    private String registryUser;
    @NotNull
    private BigDecimal price;
    private BigDecimal discount;
    private String image;

    private Integer quantity;
    private String created;
    private String updated;

    public  ProductDTO(Product entity){

        BeanUtils.copyProperties(entity, this);
    }

}
