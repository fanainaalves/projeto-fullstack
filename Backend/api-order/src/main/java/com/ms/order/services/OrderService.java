package com.ms.order.services;

import com.ms.order.dto.OrderDTO;
import com.ms.order.dto.OrderItemConverter;
import com.ms.order.dto.OrderItemDTO;
import com.ms.order.dto.StatusOrderDTO;
import com.ms.order.enums.StatusOrder;
import com.ms.order.exceptions.ClientNotFoundException;
import com.ms.order.exceptions.ServiceException;
import com.ms.order.model.Order;
import com.ms.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    OrderRepository repository;

    public List<OrderDTO> findAll() throws ServiceException {
        List<Order> list = repository.findAll();
        if (list.isEmpty()) {
            throw new ClientNotFoundException("No clients found");
        }
        return list.stream().map(OrderDTO::new).toList();
    }

    public List<OrderDTO> findByUserId(String userId) throws ServiceException {
        List<Order> clients = repository.findByUserId(userId);
        if (clients.isEmpty()) {
            throw new ClientNotFoundException("No clients found for userId: " + userId);
        }
        return clients.stream().map(OrderDTO::new).toList();
    }

    @Transactional
    public OrderDTO create(OrderDTO orderDTO) throws ServiceException {
        Order entity = new Order(orderDTO);
        entity.setCreated(LocalDateTime.now().toString());
        repository.save(entity);
        return new OrderDTO(entity);
    }

    public OrderDTO findById(String id) throws ServiceException {
        return repository.findById(id)
                .map(OrderDTO::new)
                .orElseThrow(() -> new ClientNotFoundException("Client not found with ID: " + id));
    }

    public OrderDTO findByClient(String client) throws ServiceException {
        return repository.findByClient(client)
                .map(OrderDTO::new)
                .orElseThrow(() -> new ClientNotFoundException("Client not found with email: " + client));
    }

    @Transactional
    public OrderDTO update(String id, OrderDTO orderDTO) throws ServiceException {
        Optional<Order> optionalClient = repository.findById(id);
        if (optionalClient.isPresent()) {
            Order entity = optionalClient.get();
            entity.setClient(orderDTO.getClient());
            try {
                List<OrderItemDTO> orderItems = OrderItemConverter.convertStringToOrderItems(orderDTO.getOrderItemsAsString());
                entity.setOrderItems(orderItems);
            } catch (IOException e) {
                throw new RuntimeException("Error converting order items from JSON", e);
            }

            entity.setOrderStatus(orderDTO.getOrderStatus());
            entity.setPaymentMethod(orderDTO.getPaymentMethod());
            entity.setPaymentInformation(orderDTO.getPaymentInformation());
            entity.setOrderNotes(orderDTO.getOrderNotes());
            entity.setCreated(orderDTO.getCreated());
            entity.setUpdated(LocalDateTime.now().toString());

            repository.save(entity);
            return new OrderDTO(entity);
        } else {
            throw new ClientNotFoundException("Client not found with ID: " + id);
        }
    }

    public void delete(String id) throws ServiceException {
        if (!repository.existsById(id)) {
            throw new ClientNotFoundException("Client not found with ID: " + id);
        }
        repository.deleteById(id);
    }

    public List<StatusOrderDTO> listStatusOrder() throws ServiceException{
        return Arrays.stream(StatusOrder.values())
                .map(StatusOrderDTO::new)
                .collect(Collectors.toList());
    }
}
