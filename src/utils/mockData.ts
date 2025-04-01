import type { MenuItem } from './apis/auth-api'

export const mockMenuData: MenuItem[] = [
  {
    "id": 633,
    "parentId": null,
    "to": null,
    "label": "Hệ thống Quản trị người dùng",
    "appCode": "ADMIN",
    "status": 1,
    "ord": 4,
    "type": "1",
    "includeMenu": 1,
    "rights": [],
    "items": [
      {
        "id": 634,
        "parentId": 633,
        "to": null,
        "label": "Quản trị hệ thống",
        "appCode": "ADMIN",
        "status": 1,
        "ord": 0,
        "type": "1",
        "includeMenu": 1,
        "rights": [],
        "items": [
          {
            "id": 636,
            "parentId": 634,
            "to": "/sec_module?urlPathId=636",
            "label": "1. Danh sách chức năng",
            "appCode": "ADMIN",
            "status": 1,
            "ord": 0,
            "type": "2",
            "includeMenu": 1,
            "rights": [],
            "items": []
          },
          {
            "id": 635,
            "parentId": 634,
            "to": "/applicationList?urlPathId=635",
            "label": "2. Danh sách ứng dụng",
            "appCode": "ADMIN",
            "status": 1,
            "ord": 1,
            "type": "2",
            "includeMenu": 1,
            "rights": [],
            "items": []
          },
          {
            "id": 637,
            "parentId": 634,
            "to": "/listGroupUser?urlPathId=637",
            "label": "3. Danh sách NSD và Nhóm NSD",
            "appCode": "ADMIN",
            "status": 1,
            "ord": 2,
            "type": "2",
            "includeMenu": 1,
            "rights": [],
            "items": []
          },
          {
            "id": 638,
            "parentId": 634,
            "to": "/listScheduleAccess?urlPathId=638",
            "label": "4. Danh sách lịch truy nhập",
            "appCode": "ADMIN",
            "status": 1,
            "ord": 3,
            "type": "2",
            "includeMenu": 1,
            "rights": [],
            "items": []
          },
          {
            "id": 647,
            "parentId": 634,
            "to": "/sec_ip?urlPathId=647",
            "label": "5. Danh sách IP",
            "appCode": "ADMIN",
            "status": 1,
            "ord": 4,
            "type": "2",
            "includeMenu": 1,
            "rights": [],
            "items": []
          },
          {
            "id": 640,
            "parentId": 634,
            "to": "/sec_system_policy?urlPathId=640",
            "label": "6. Chính sách bảo mật",
            "appCode": "ADMIN",
            "status": 1,
            "ord": 5,
            "type": "2",
            "includeMenu": 1,
            "rights": [],
            "items": []
          }
        ]
      },
      {
        "id": 641,
        "parentId": 633,
        "to": "/accessLog?urlPathId=641",
        "label": "Theo dõi truy nhập",
        "appCode": "ADMIN",
        "status": 1,
        "ord": 1,
        "type": "2",
        "includeMenu": 1,
        "rights": [],
        "items": []
      },
      {
        "id": 642,
        "parentId": 633,
        "to": "/followChange?urlPathId=642",
        "label": "Theo dõi thay đổi",
        "appCode": "ADMIN",
        "status": 1,
        "ord": 2,
        "type": "2",
        "includeMenu": 1,
        "rights": [],
        "items": []
      }
    ]
  }
]
