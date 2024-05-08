export const STORAGE_KEY = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  ROLE: 'role',
  USER_INFO: 'user_info',
  PERMISSION: 'permission',
  NHA_THUOC: 'nha_thuoc'
};

export const STATUS_CODE = {
  SUCCESS: 200,
  ERROR: 201,
  UNAUTHORIZED: 401,
};

export const RECORD_STATUS = {
  ACTIVE: 0,
  ARCHIVED: 1,
  DELETED: 2,
  DELETED_DATABASE: 3,
  TEMPORARY: 4,
  ACCEPTANCE_PENDING: 101
};

export const LOAI_PHIEU = {
  PHIEU_NHAP : 1,
  PHIEU_XUAT : 2,
  PHIEU_NHAP_TU_KH : 3,
  PHIEU_TRA_LAI_NCC : 4,
  PHIEU_KIEM_KE : 5,
  PHIEU_TON_BAN_DAU : 6,
  PHIEU_NO_DAU_KY : 7,
  PHIEU_CHUYEN_KHO : 8,
  PHIEU_XUAT_HUY : 9,
  PHIEU_KHAM_BENH : 11,
  PHIEU_DICH_VU : 12,
  PHIEU_CHO_KHAM : 13,
  PHIEU_THU_TIEN : 14,
  PHIEU_DU_TRU : 15
}

export const ORDER_STORE_MAPPING = {
  NONE : 0,
  ACTIVE : 1,
  SET_DEFAULT : 2
}

export const LOAI_SAN_PHAM = {
  THUOC: 0,
  DICH_VU: 1
}

export const TRANG_THAI_PHIEU_KHAM = {
  CHO_KHAM: 0,
  DANG_KHAM: 1,
  DA_KHAM: 2,
  DA_HUY: 3,
  LIEU_TRINH: 4
}

export const TRANG_THAI_DONG_BO = {
  IGNORE: 0,
  NOT_SYNC: 1,
  FAILED: 2,
  SYNCHRONIZED: 3,
};

export const LOAI_THU_CHI = {
  THU_NO_KHACH_HANG: 1,
  CHI_TRA_NO_NHA_CUNG_CAP: 2,
  THU_KHAC: 3,
  CHI_KHAC: 4,
  CHI_PHI_KINH_DOANH: 5,
  THU_LAI_NHA_CUNG_CAP: 6,
  CHI_TRA_LAI_KHACH_HANG: 7
}

export const DATE_RANGE = {
  ALL: 0,
  BY_DATE: 1,
};

export const PAGE_SIZE_DEFAULT = 10;
