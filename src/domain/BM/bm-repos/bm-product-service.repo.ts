// src/domain/BM/bm-repos/bm-product-service.repo.ts

import { BMProduct } from '../bm-models/bm-product.model';

/**
 * Repository interface cho bm_product
 * Định nghĩa các hàm typed để lấy dữ liệu sản phẩm.
 */
export interface BMProductRepository {

  /** Lấy toàn bộ khóa học (product_type = 'COURSE') */
  findAllCourses(): Promise<BMProduct[]>;

  /** Lấy toàn bộ sản phẩm mọi loại */
  findAllProducts(): Promise<BMProduct[]>;

  /** Lấy danh sách sản phẩm theo product_type */
  findByProductType(productType: string): Promise<BMProduct[]>;

  /** Lấy chi tiết sản phẩm theo id */
  findById(id: number): Promise<BMProduct | null>;

  /** Lấy chi tiết sản phẩm theo product_code */
  findByProductCode(productCode: string): Promise<BMProduct | null>;
}
