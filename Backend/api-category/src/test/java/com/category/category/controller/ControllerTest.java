package com.category.category.controller;

import com.category.category.domain.dto.CategoryDTO;
import com.category.category.service.CategoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import java.math.BigDecimal;
import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(CategoryController.class)
@ActiveProfiles("tests")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ControllerTest {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UploadController controller;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CategoryService categoryService;

    private String id = "65f4826c5488840d27e9868e";

    public static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    @Order(1)
    public void testCreate() throws Exception {
        log.info("testCreateCategory");
        CategoryDTO categoryDTO = new CategoryDTO(
                id, "Teste", 1,  "test-image.png",
                "admin", "null", "null");

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-image.png",
                MediaType.IMAGE_PNG_VALUE,
                "test image content".getBytes()
        );

        MockMultipartFile service = new MockMultipartFile(
                "category",
                "category.json",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(categoryDTO)
        );

        Mockito.when(categoryService.create(Mockito.any(CategoryDTO.class))).thenReturn(categoryDTO);
        this.mockMvc.perform(multipart("/api/category/create")
                        .file(file)
                        .file(service)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    @Order(2)
    public void testFindAll() throws Exception {
        log.info("testFindAll");
        CategoryDTO categoryDTO = new CategoryDTO(id, "Teste", 1,"test-image.png","admin","null", "null");
        Mockito.when(categoryService.findAll()).thenReturn(Collections.singletonList(categoryDTO));

        this.mockMvc.perform(MockMvcRequestBuilders.get("/api/category/findAll"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isNotEmpty());
    }

    @Test
    @Order(3)
    public void testClientFindByService() throws Exception {
        log.info("testFindByService");
        CategoryDTO categoryDTO = new CategoryDTO(id, "Teste", 1,"test-image.png","admin","null", "null");
        Mockito.when(categoryService.findByTypeService()).thenReturn(Collections.singletonList(categoryDTO));

        this.mockMvc.perform(MockMvcRequestBuilders.get("/api/category/findByTypeService"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isNotEmpty());
    }

    @Test
    @Order(4)
    public void testUpdate() throws Exception {
        log.info("testUpdateCategory");
        CategoryDTO categoryDTO = new CategoryDTO(
                id, "teste", 1,  "updated-image.png",
                "null", "null", "null");

        byte[] fileContent = "updated image content".getBytes();

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "updated-image.png",
                MediaType.IMAGE_PNG_VALUE,
                fileContent
        );

        MockMultipartFile service = new MockMultipartFile(
                "category",
                "category.json",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(categoryDTO)
        );

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders
                        .multipart("/api/category/" + id)
                        .file(file)
                        .file(service)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryDTO))
                        .with(request -> {
                            request.setMethod(HttpMethod.PUT.name());
                            return request;
                        }))
                .andExpect(status().isOk())
                .andReturn();
    }

    @Test
    @Order(5)
    public void testClientFindByProduct() throws Exception {
        log.info("test findByProduct");
        CategoryDTO categoryDTO = new CategoryDTO(id, "Teste", 2,"test-image.png","admin","null", "null");
        Mockito.when(categoryService.findByTypeProduct()).thenReturn(Collections.singletonList(categoryDTO));

        this.mockMvc.perform(MockMvcRequestBuilders.get("/api/category/findByTypeProduct"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isNotEmpty());
    }

    @Test
    @Order(6)
    public void testFindById() throws Exception {
        log.info("testFindById");
        CategoryDTO categoryDTO = new CategoryDTO(id, "Teste", 1,"test-image.png","admin","null", "null");
        Mockito.when(categoryService.findById(id)).thenReturn(categoryDTO);

        this.mockMvc.perform(MockMvcRequestBuilders.get("/api/category/search/" + id))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isNotEmpty())
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    @Order(7)
    public void testDeleteClient() throws Exception {
        CategoryDTO categoryDTO = new CategoryDTO(id, "Teste", 1,"test-image.png","admin","null", "null");
        Mockito.when(categoryService.findAll()).thenReturn(Collections.singletonList(categoryDTO));

        log.info("testDelete");
        this.mockMvc.perform(MockMvcRequestBuilders
                        .delete("/api/category/delete/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").doesNotExist());
    }
}

