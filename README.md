# 🧩 Mini Projects CRUD – Next.js

A minimal full-stack CRUD app built with **Next.js 15**, **TypeScript**, and **Prisma**, featuring mock auth, protected routes, server actions, and cache revalidation.

---

## ⚙️ Setup

```bash
git clone <your-repo-url>
cd mini-projects-crud
npm install
```

Create `.env`:

```env
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

Run DB setup:

```bash
npm run prisma:deploy
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Mock Auth

* Go to `/login`
* Enter any valid email → cookie session (7 days)
* Redirects to `/app/projects` (protected)
* No passwords or real auth — demo only

---

## 🏷️ Cache Tags

| Tag                     | Purpose            |
| ----------------------- | ------------------ |
| `project:{id}`          | Individual project |
| `projects:user:{email}` | User’s list        |
| `projects:public`       | Public projects    |

**Revalidate**

* On Create/Edit/Delete: refresh user + project tags
* Revalidate public list if visibility/public changes

