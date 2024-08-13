package com.ms.order.model;

import com.ms.order.dto.OrderDTO;
import com.ms.order.dto.OrderItemDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import org.springframework.beans.BeanUtils;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
@Document(collection = "orders")
public class Order implements Serializable {
    @Id
    private String id;
    private String client;
    private String userId;
    private String orderStatus;
    private List<OrderItemDTO> orderItems;
    private String paymentMethod;
    private String paymentInformation;
    private String orderNotes;
    private String created;
    private String updated;
    private String status;
    public Order(OrderDTO orderDTO){
        BeanUtils.copyProperties(orderDTO, this);
    }

    public Order() {
        super();
    }

}