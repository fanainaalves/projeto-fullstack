import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../model/product';
import { ProductService } from '../service/product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from 'src/app/category/category';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/login/services/login.service';
import { NgForm } from "@angular/forms";


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  product: Product;

  formTouched: boolean = false;
  areFieldsFilledForCreate: boolean = false;

  success: boolean = false;
  errors: string[];
  id: string;

  products: Product[] = [];
  categories: Category[] = [];
  selectedProduct: Product;
  successMessage: string;
  errorMessage: string;
  imagePreview: string | ArrayBuffer | null = null;
  //selectedFile: File | null = null;
  modalTitle: string = '';
  modalBody: string = '';
  updatedData: string[] = [];

  originalProduct: Product;

  @ViewChild('productForm', { static: true }) productForm: NgForm;


  constructor(
    private service: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private http: HttpClient,
  ) {
    this.product = new Product();
    this.product.registryUser = this.loginService.getUserSession().name;
  }

  ngOnInit(): void {
    let params: Observable<Params> = this.activatedRoute.params;
    params.subscribe((urlParams) => {
      this.id = urlParams["id"];
      if (this.id) {
        this.service.getById(this.id).subscribe(
          (response) => {
            console.log('Cliente do banco de dados:', response);
            this.originalProduct = response;
            this.product = Object.assign({}, response);
            this.markAllFieldsAsTouched();
            if (this.product.image) {
              this.loadImagePreview(this.product.image);
            }
          },
          (errorResponse) => {
            this.product = new Product();
          }
        );
      }
    });
    this.loadCategories();
  }

  loadCategories(){
    this.service.findByTypeProduct().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (errorReponse) => {
        console.error('', errorReponse);
      }
    )
  }

  deleteProduct() {
    this.service.deleteId(this.selectedProduct)
      .subscribe(
        response => {
          this.successMessage = 'Produto excluído com sucesso!';
          window.location.reload();
        },
        error => {
          console.error('Erro ao excluir produto:', error);
          this.errorMessage = 'Erro ao excluir produto: ' + error.message;
        }
      );
  }

  confirmDeletion(product : Product) {
    this.selectedProduct = product;
    this.modalTitle = 'Excluir Produto';
    this.modalBody = `Deseja realmente excluir o produto <b>${product.name}</b>?`;
  }

        onFileSelected(event: any) {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              this.imagePreview = e.target?.result;
            };
            reader.readAsDataURL(file);
            this.product.image = file.name;
          }
        }

        loadImagePreview(imageUrl: string){
          this.imagePreview =  `../../../assets/img/market/${imageUrl}`;
        }

        public getUserSession(): any {
          return this.loginService.getUserSession();
        }
        returnList() {
          this.router.navigate(["/product-list"]);
        }

  onSubmit() {
    if (this.id) {
      if (this.product.registryUser !== this.loginService.getUserSession().name) {
        this.product.registryUser = this.loginService.getUserSession().name;
    }
    this.confirmUpdate(this.product);
  } else {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0]

      this.service.create(this.product, file).subscribe(
        (response) => {
          this.success = true;
          this.errors = null;
          this.product = response;
          this.router.navigate(['/product-form:id']);
        },
        (errorResponse) => {
          this.success = false;
            this.errors = errorResponse.error;
            console.log(errorResponse.error);
        }
      );
    } else {
      this.errors = ["Por favor, selecione um arquivo!"]
    }
  }
}


updateProduct(){
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0]
      this.service.update(this.product, file).subscribe(
        (response) => {
          this.success = true;
          this.errors = null;
        },
        (errorResponse) => {
          this.errors = ["Erro ao atualizar o produto!"];
        }
      );
    } else {
      this.service.update(this.product, null).subscribe(
        (response) => {
          this.success = true;
          this.errors = null;
        },
        (errorResponse) => {
          this.errors = ["Erro ao atualizar o produto!"];
        }
      );
    }
}


  confirmUpdate(product: Product) {
    this.selectedProduct = product;
    this.modalTitle = 'Atualizar Produto';
    this.modalBody = `Deseja realmente atualizar o produto <b>${product.name}</b>?`;

    this.updatedData = this.getUpdatedData(this.originalProduct, product);
    if (this.updatedData.length > 0) {
        console.log('Dados atualizados:', this.updatedData);
    }
  }

  get isNameEmpty(): boolean {
    return !this.product.name || this.product.name.trim() === '';
  }

  getUpdatedData(originalProduct: Product, updatedProduct: Product): string[] {
    const updatedData: string[] = [];

    if (originalProduct.name !== this.updateProduct.name) {
        updatedData.push(`<strong ><span class="text-decoration-line-through text-danger"> ${originalProduct.name}</span></strong> <i class="fa fa-sync-alt"></i> <strong> <span class="text-success"> ${updatedProduct.name}</span></strong>`);
    }
    if (originalProduct.description !== updatedProduct.description) {
        updatedData.push(`<strong><span class="text-decoration-line-through text-danger">${originalProduct.description}</span></strong> <i class="fa fa-sync-alt"></i> <strong><span class="text-success">${updatedProduct.description}</span></strong>`);
    }
    if (originalProduct.price !== updatedProduct.price) {
        updatedData.push(`<strong><span class="text-decoration-line-through text-danger">${originalProduct.price}</span></strong> <i class="fa fa-sync-alt"></i> <strong><span class="text-success">${updatedProduct.price}</span></strong>`);
    }
    if (originalProduct.idCategory !== updatedProduct.idCategory) {
        updatedData.push(`<strong><span class="text-decoration-line-through text-danger">${originalProduct.idCategory}</span></strong> <i class="fa fa-sync-alt"></i> <strong><span class="text-success">${updatedProduct.idCategory}</span></strong>`);
    }
    if (originalProduct.brand !== updatedProduct.brand) {
      updatedData.push(`<strong><span class="text-decoration-line-through text-danger">${originalProduct.brand}</span></strong> <i class="fa fa-sync-alt"></i> <strong><span class="text-success">${updatedProduct.brand}</span></strong>`);
    }
    if (originalProduct.stock !== updatedProduct.stock) {
      updatedData.push(`<strong><span class="text-decoration-line-through text-danger">${originalProduct.stock}</span></strong> <i class="fa fa-sync-alt"></i> <strong><span class="text-success">${updatedProduct.stock}</span></strong>`);
    }
    if (originalProduct.supplier !== updatedProduct.supplier) {
      updatedData.push(`<strong><span class="text-decoration-line-through text-danger">${originalProduct.supplier}</span></strong> <i class="fa fa-sync-alt"></i> <strong><span class="text-success">${updatedProduct.supplier}</span></strong>`);
    }
    if (originalProduct.discount !== updatedProduct.discount) {
      updatedData.push(`<strong><span class="text-decoration-line-through text-danger">${originalProduct.discount}</span></strong> <i class="fa fa-sync-alt"></i> <strong><span class="text-success">${updatedProduct.discount}</span></strong>`);
    }
    if (originalProduct.registryUser !== updatedProduct.registryUser) {
      updatedData.push(`<strong><span class="text-decoration-line-through text-danger">${originalProduct.registryUser}</span></strong> <i class="fa fa-sync-alt"></i> <strong><span class="text-success">${updatedProduct.registryUser}</span></strong>`);
    }
    if (originalProduct.image !== updatedProduct.image) {
      updatedData.push(`<strong><span class="text-decoration-line-through text-danger">${originalProduct.image}</span></strong> <i class="fa fa-sync-alt"></i> <strong><span class="text-success">${updatedProduct.image}</span></strong>`);
    }
    if (updatedData.length === 0) {
      updatedData.push(`<strong>Não foi realizada nenhuma modificação</strong>`);
  }

    return updatedData;
  }

  checkForChanges(): boolean {
    return JSON.stringify(this.product) !== JSON.stringify(this.originalProduct);
  }


  checkForEmptyFields(): boolean {
    const controls = this.productForm.controls;
    return !controls['name'].value || !controls['description'].value || !controls['price'].value || !controls['idCategory'].value || !controls['brand'].value
    || !controls['stock'].value || !controls['supplier'].value || !controls['discount'].value || !controls['image'].value ;
  }

  isFormValid(): boolean {
    const controls = this.productForm.controls;
    return controls['name'].valid && controls['description'].valid && controls['price'].valid && controls['idCategory'].valid && controls['brand'].valid
    && controls['stock'].valid && controls['supplier'].valid && controls['discount'].valid && controls['image'].valid;
  }

  cancelUpdate() {
    window.location.reload();
  }


  markAllFieldsAsTouched() {
    Object.keys(this.productForm.controls).forEach(field => {
      const control = this.productForm.controls[field];
      control.markAsTouched();
      control.markAsDirty(); // !validação
    });
  }

  onFieldTouched(field: any) {
    if ((field.invalid || this.productForm.invalid) && (field.dirty || field.touched)) {
      this.formTouched = true;
    }
  }

  }































//     onSubmit(): void {
//       if (this.selectedFile) {
//         this.uploadFile(this.selectedFile).subscribe(response => {
//           if (response && response.imageUrl) {
//             this.product.image = response.imageUrl;
//             this.createOrUpdateProduct();
//           }
//         }, error => {
//           console.error('Upload failed:', error);
//           this.errors = ['Erro ao carregar a imagem'];
//         });
//       } else {
//         this.createOrUpdateProduct();
//       }
//     }

//       confirmDeletion(product : Product) {
//         this.selectedProduct = product;
//       }

//       deleteProduct() {
//         this.service.deleteId(this.selectedProduct)
//           .subscribe(
//               response => {
//                 this.successMessage = 'Produto excluído com sucesso!';
//                 // Recarregar a página
//                 window.location.reload();
//               },
//               error => {
//                 console.error('Erro ao excluir produto:', error);
//                 this.errorMessage = 'Erro ao excluir produto: ' + error.message;
//               }
//           );
//       }

//       returnList() {
//         this.router.navigate(['/product-list'])
//       }



//       onFileSelected(event: any): void {
//   const file = event.target.files[0];
//   if (file) {
//     this.selectedFile = file;
//     const reader = new FileReader();
//     reader.onload = (e: any) => {
//       this.imagePreview = e.target.result;
//     };
//     reader.readAsDataURL(file);
//   }
// }

// uploadFile(file: File): Observable<any> {
//   const formData: FormData = new FormData();
//   formData.append('file', file, file.name);
//   return this.http.post<any>('http://localhost:9006/api/products/file', formData);
// }

// createOrUpdateProduct(): void {
//   if (this.selectedFile) {
//     // Se um arquivo estiver selecionado, faça o upload primeiro
//     this.uploadFile(this.selectedFile).subscribe(
//       (fileResponse) => {
//         // Assumindo que a resposta do upload do arquivo inclui a URL ou algum identificador do arquivo
//         this.product.id = fileResponse.url || fileResponse.fileId;
//         // Agora podemos continuar com a criação ou atualização do produto
//         this.saveProduct();
//       },
//       (errorResponse) => {
//         this.errors = ['Erro ao fazer upload do arquivo'];
//       }
//     );
//   } else {
//     // Se não houver arquivo selecionado, apenas salve o produto
//     this.saveProduct();
//   }
// }

// saveProduct(): void {
//   if (this.id) {
//     this.service.update(this.product).subscribe(
//       (response) => {
//         this.success = true;
//         this.errors = null;
//         this.router.navigate(['/product-list']);
//       },
//       (errorResponse) => {
//         this.errors = ['Erro ao atualizar produto'];
//       }
//     );
//   } else {
//     this.service.create(this.product).subscribe(
//       (response) => {
//         this.success = true;
//         this.errors = null;
//         this.product = response;
//         this.router.navigate(['/product-list']);
//       },
//       (errorResponse) => {
//         this.success = false;
//         this.errors = errorResponse.error;
//         console.log(errorResponse.error);
//       }
//     );
//   }
// }




//       // onFileSelected(event: any): void {
//       //   const file = event.target.files[0];
//       //   if (file) {
//       //     this.selectedFile = file;
//       //     const reader = new FileReader();
//       //     reader.onload = (e: any) => {
//       //       this.imagePreview = e.target.result;
//       //     };
//       //     reader.readAsDataURL(file);
//       //   }
//       // }
//       // uploadFile(file: File): Observable<any> {
//       //   const formData: FormData = new FormData();
//       //   formData.append('file', file, file.name);
//       //   return this.http.post<any>('http://localhost:9006/api/products/file', formData);
//       // }

//       // createOrUpdateProduct(): void {
//       //   if (this.id) {
//       //     this.service.update(this.product).subscribe(
//       //       (response) => {
//       //         this.success = true;
//       //         this.errors = null;
//       //         this.router.navigate(['/product-list']);
//       //       },
//       //       (errorResponse) => {
//       //         this.errors = ['Erro ao Atualizar produto'];
//       //       }
//       //     );
//       //   } else {
//       //     this.service.create(this.product).subscribe(
//       //       (response) => {
//       //         this.success = true;
//       //         this.errors = null;
//       //         this.product = response;
//       //         this.router.navigate(['/product-list']);
//       //       },
//       //       (errorResponse) => {
//       //         this.success = false;
//       //         this.errors = errorResponse.error;
//       //         console.log(errorResponse.error);
//       //       }
//       //     );
//       //   }
//       // }

//       // getProductImagePath(): string {
//       //   if (this.imagePreview) {
//       //     return this.imagePreview as string;
//       //   } else if (this.product.image) {
//       //     return `../../../assets/img/market/${this.product.image}`;
//       //   } else {
//       //     return '';
//       //   }
//       // }

//       getProductImagePath(): string {
//         if (this.imagePreview) {
//           return this.imagePreview as string;
//         } else if (this.product.image) {
//           if (this.isExternalUrl(this.product.image)) {
//             return this.product.image;  // URL externa
//           } else if (this.isAlternativeDirectory(this.product.image)) {
//             return `../${this.product.image}`;  // Diretório alternativo
//           } else {
//             return `../../../assets/img/market/${this.product.image}`;  // Diretório padrão
//           }
//         } else {
//           return '';
//         }
//       }

//       isExternalUrl(url: string): boolean {
//         return /^(http|https):\/\//.test(url);
//       }

//       isAlternativeDirectory(image: string): boolean {
//         return image.startsWith('alt-');
//       }





