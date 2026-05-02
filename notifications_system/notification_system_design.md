# Notification System Design

## Stage 1 – API Design

GET /notifications/:studentId  
POST /notifications  
PATCH /notifications/:id  

### Response
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

Used WebSockets for real-time notifications.

---

## Stage 2 – Database Design

Database: PostgreSQL

Table: notifications

Fields:
- id
- studentId
- type
- message
- timestamp
- isRead

Use indexing and pagination for performance.

---

## Stage 3 – Query Optimization

Problem: Slow query due to full table scan.

Solution:
Create index on (studentId, isRead, timestamp)

Do not index every column as it slows writes.

---

## Stage 4 – Performance Improvement

Use:
- Redis caching
- Pagination
- Lazy loading
- WebSockets

---

## Stage 5 – Reliable System

Problem: Loop-based email sending is slow.

Solution:
Use message queue (RabbitMQ / Kafka)

Benefits:
- Async processing
- Retry failed jobs
- Better scalability

---

## Stage 6 – Code

```js
const axios = require("axios");

const priorityMap = {
  Placement: 3,
  Result: 2,
  Event: 1
};

async function getTopNotifications() {
  try {
    const res = await axios.get(
      "http://20.207.122.201/evaluation-service/notifications",
      {
        headers: { "x-access-code": "QkbpxH" }
      }
    );

    const data = res.data.notifications;

    const sorted = data.sort((a, b) => {
      if (priorityMap[b.Type] !== priorityMap[a.Type]) {
        return priorityMap[b.Type] - priorityMap[a.Type];
      }
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    const top10 = sorted.slice(0, 10);

    console.log(top10);
  } catch (err) {
    console.log("Error fetching notifications");
  }
}

getTopNotifications();
