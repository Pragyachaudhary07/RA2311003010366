# Notification System Design

---

## Stage 1 – API Design

### Endpoints
- GET /notifications/:studentId  
- POST /notifications  
- PATCH /notifications/:id  

### Response (GET /notifications/:studentId)

```json
{
  "notifications": [
    {
      "ID": "1",
      "Type": "Result",
      "Message": "mid-sem",
      "Timestamp": "2026-04-22"
    }
  ]
}
