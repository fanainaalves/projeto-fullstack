package com.ms.order.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDTO {

    private String idProduct;
    private String name;
    private String description;
    private BigDecimal quantity;
    private BigDecimal price;
    private BigDecimal discount;
}