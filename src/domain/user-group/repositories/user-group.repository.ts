
import type { ParentViewUser } from '../models/parent-view-user.dto';

export interface UserGroupRepository {
  /**
   * Tìm user theo email hoặc số điện thoại
   * @param identifier Email hoặc số điện thoại
   */
  findParentsEmail(studentId: number): Promise<string | null>;

  //getStudentsByParentId
  /**
   * Lấy danh sách học sinh theo ID phụ huynh
   * @param parentId ID phụ huynh
   */
  getStudentsByParentId(parentId: number): Promise<ParentViewUser[]>;
}


