# Notification System Design

## Stage 1 – API Design

GET /notifications/:studentId  
POST /notifications  
PATCH /notifications/:id  

Response:
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

Used WebSockets for real-time notifications instead of repeated polling.

---

## Stage 2 – Database Design

Database: PostgreSQL  

Table: notifications  

Fields:
- id (Primary Key)  
- studentId  
- type (Event / Result / Placement)  
- message  
- timestamp  
- isRead (boolean)  

Use indexing and pagination to handle large-scale data efficiently.

---

## Stage 3 – Query Optimization

Problem: Slow query due to full table scan.

Example:
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC;

Solution:
Create composite index on (studentId, isRead, timestamp)

CREATE INDEX idx_notifications
ON notifications(studentId, isRead, createdAt DESC);

Do not index every column as it increases write overhead.

---

## Stage 4 – Performance Improvement

Use:
- Redis caching (reduce database load)  
- Pagination (limit results)  
- Lazy loading (load data when needed)  
- WebSockets (real-time updates)  

---

## Stage 5 – Reliable System

Problem: Loop-based email/notification sending is slow.

Solution:
Use message queue (RabbitMQ / Kafka)

Benefits:
- Async processing  
- Retry failed jobs  
- Better scalability and fault tolerance  

---

## Stage 6 – Code
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

    const data = (res.data && res.data.notifications) ? res.data.notifications : [];

    const sorted = data.sort((a, b) => {
      const typeA = a.Type || a.type;
      const typeB = b.Type || b.type;

      if (priorityMap[typeB] !== priorityMap[typeA]) {
        return (priorityMap[typeB] || 0) - (priorityMap[typeA] || 0);
      }

      const timeA = new Date(a.Timestamp || a.timestamp);
      const timeB = new Date(b.Timestamp || b.timestamp);

      return timeB - timeA;
    });

    const top10 = sorted.slice(0, 10);

    console.log(top10);
  } catch (err) {
    console.log("Error fetching notifications");
  }
}

getTopNotifications();
