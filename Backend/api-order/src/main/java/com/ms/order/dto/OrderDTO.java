package com.ms.order.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ms.order.model.Order;
import com.ms.order.validation.ValidDateFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.BeanUtils;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO implements Serializable {

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
    public OrderDTO(Order entity){
        BeanUtils.copyProperties(entity, this);
    }

    public String getOrderItemsAsString() throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(orderItems);
    }

}
