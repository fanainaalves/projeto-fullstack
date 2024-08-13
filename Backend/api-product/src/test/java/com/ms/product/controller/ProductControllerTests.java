package com.ms.product.controller;

        import com.fasterxml.jackson.databind.ObjectMapper;

        import com.ms.product.dto.ProductDTO;
        import com.ms.product.services.ProductService;
        import org.junit.jupiter.api.MethodOrderer;
        import org.junit.jupiter.api.Order;
        import org.junit.jupiter.api.Test;
        import org.junit.jupiter.api.TestMethodOrder;
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
        import org.springframework.test.web.servlet.MockMvc;
        import org.springframework.test.web.servlet.MvcResult;
        import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
        import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
        import org.springframework.web.multipart.MultipartFile;


        import java.math.BigDecimal;
        import java.util.Collections;

        import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
        import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
        import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

//@ExtendWith(SpringExtension.class)
@WebMvcTest(ProductController.class)
@ActiveProfiles("tests")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ProductControllerTests {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;


    @MockBean
    private ProductService productService;

    @MockBean
    private UploadController uploadController;

    private String id = "65f4a2469fc0a90f375dba5f";
    private String name = "Kilo de Cebola Nacional";
    private String idCategory = "idCategory";

    @Test
    @Order(1)
    public void testCreate() throws Exception {
        log.info("testCreateProduct");
        ProductDTO productDTO = new ProductDTO(
                id,
                "Kilo de Cebola Nacional",
                "description",
                idCategory,
                "marca - brand",
                "em estoque - stock",
                "fornecedor - supplier",
                "Admin - registryUser",
                new BigDecimal(20),
                new BigDecimal(10),
                "image",
                1,
                null,
                null);

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-image.png",
                MediaType.IMAGE_PNG_VALUE,
                "test image content".getBytes()
        );

        MockMultipartFile product = new MockMultipartFile(
                "product",
                "product.json",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(productDTO)
        );

        Mockito.when(productService.create(Mockito.any(ProductDTO.class))).thenReturn(productDTO);
        this.mockMvc.perform(multipart("/api/products/create")
                        .file(file)
                        .file(product)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists());
    }




    @Test
    @Order(2)
    public void testFindAll() throws Exception {
        log.info("testFindAllServices");
        ProductDTO productDTO = new ProductDTO(
                id,
                "Kilo de Cebola Nacional",
                "description",
                idCategory,
                "marca - brand",
                "em estoque - stock",
                "fornecedor - supplier",
                "Admin - registryUser",
                new BigDecimal(20), new BigDecimal(10),
                "image",
                1,
                null,
                null);
        Mockito.when(productService.findAll()).thenReturn(Collections.singletonList(productDTO));

        this.mockMvc.perform(MockMvcRequestBuilders.get("/api/products"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isNotEmpty());
    }

    @Test
    @Order(3)
    public void testFindById() throws Exception {
        log.info("testFindById");
        ProductDTO productDTO = new ProductDTO(id,
                "Kilo de Cebola Nacional",
                "description",
                idCategory,
                "marca - brand",
                "em estoque - stock",
                "fornecedor - supplier",
                "Admin - registryUser",
                new BigDecimal(20), new BigDecimal(10),
                "image",
                1,
                null,
                null);
        Mockito.when(productService.findById(id)).thenReturn(productDTO);

        this.mockMvc.perform(MockMvcRequestBuilders.get("/api/products/getId/" + id))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isNotEmpty())
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    @Order(4)
    public void testFindByName() throws Exception {
        log.info("testFindByProductName");
        ProductDTO productDTO = new ProductDTO(id,
                "Kilo de Cebola Nacional",
                "description",
                idCategory,
                "marca - brand",
                "em estoque - stock",
                "fornecedor - supplier",
                "Admin - registryUser",
                new BigDecimal(20), new BigDecimal(10),
                "test-image.jpg",
                1,
                null,
                null);
        Mockito.when(productService.findByName(name)).thenReturn(productDTO);

        this.mockMvc.perform(MockMvcRequestBuilders.get("/api/products/getName/" + name))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isNotEmpty())
                .andExpect(jsonPath("$.name").exists());
    }

    @Test
    @Order(5)
    public void testFindByIdCategory() throws Exception {
        log.info("testFindByIdCategory");
        ProductDTO productDTO = new ProductDTO(
                id,
                "Kilo de Cebola Nacional",
                "description",
                idCategory,
                "marca - brand",
                "em estoque - stock",
                "fornecedor - supplier",
                "Admin - registryUser",
                new BigDecimal(20), new BigDecimal(10),
                "image",
                1,
                null,
                null);
        Mockito.when(productService.findByIdCategory(idCategory)).thenReturn(Collections.singletonList(productDTO));

        this.mockMvc.perform(MockMvcRequestBuilders.get("/api/products//findByIdCategory/{idCategory}", idCategory))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[*].idCategory").exists());
    }

    @Test
    @Order(6)
    public void testUpdate() throws Exception {
        log.info("testUpdateProduct");
        ProductDTO productDTO = new ProductDTO(
                id,
                " UPDATE - Kilo de Cebola Nacional",
                "description",
                idCategory,
                "marca - brand",
                "em estoque - stock",
                "fornecedor - supplier",
                "Admin - registryUser",
                new BigDecimal(20), new BigDecimal(10),
                "test-image.jpg",
                1,
                null,
                null);

        byte[] fileContent = "updated image content".getBytes();


        MockMultipartFile file = new MockMultipartFile(
                "file",
                "updated-image.png",
                MediaType.IMAGE_PNG_VALUE,
                fileContent
        );

        MockMultipartFile service = new MockMultipartFile(
                "product",
                "product.json",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(productDTO)
        );

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders
                        .multipart("/api/products/" + id)
                        .file(file)
                        .file(service)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productDTO))
                        .with(request -> {
                            request.setMethod(HttpMethod.PUT.name());
                            return request;
                        }))
                .andExpect(status().isOk())
                .andReturn();
    }

    @Test
    @Order(7)
    public void testDelete() throws Exception {
        log.info("testDeleteProduct");
        Mockito.doNothing().when(productService).delete(id);

        this.mockMvc.perform(MockMvcRequestBuilders.delete("/api/products/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    public static String asJsonString(final Object object) {
        try {
            return new ObjectMapper().writeValueAsString(object);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
