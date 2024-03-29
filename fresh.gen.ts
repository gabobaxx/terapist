// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/_404.tsx";
import * as $1 from "./routes/_500.tsx";
import * as $2 from "./routes/api/login.ts";
import * as $3 from "./routes/api/logout.ts";
import * as $4 from "./routes/api/oauth.ts";
import * as $5 from "./routes/api/signup.ts";
import * as $6 from "./routes/api/subscription.ts";
import * as $7 from "./routes/blog/[slug].tsx";
import * as $8 from "./routes/blog/index.tsx";
import * as $9 from "./routes/dashboard/_middleware.ts";
import * as $10 from "./routes/dashboard/account.tsx";
import * as $11 from "./routes/dashboard/api/client.ts";
import * as $12 from "./routes/dashboard/api/kid.ts";
import * as $13 from "./routes/dashboard/api/solicitude.ts";
import * as $14 from "./routes/dashboard/api/todo.ts";
import * as $15 from "./routes/dashboard/api/vaccine.ts";
import * as $16 from "./routes/dashboard/index.tsx";
import * as $17 from "./routes/dashboard/patients.tsx";
import * as $18 from "./routes/dashboard/solicitudes.tsx";
import * as $19 from "./routes/dashboard/todos.tsx";
import * as $20 from "./routes/dashboard/vaccines.tsx";
import * as $21 from "./routes/index.tsx";
import * as $22 from "./routes/login/index.tsx";
import * as $23 from "./routes/login/success.tsx";
import * as $24 from "./routes/logout.ts";
import * as $25 from "./routes/signup.tsx";
import * as $$0 from "./islands/AdminPatientsList.tsx";
import * as $$1 from "./islands/AuthFragmentCatcher.tsx";
import * as $$2 from "./islands/ClientPatientList.tsx";
import * as $$3 from "./islands/TodoList.tsx";
import * as $$4 from "./islands/VaccinesList.tsx";

const manifest = {
  routes: {
    "./routes/_404.tsx": $0,
    "./routes/_500.tsx": $1,
    "./routes/api/login.ts": $2,
    "./routes/api/logout.ts": $3,
    "./routes/api/oauth.ts": $4,
    "./routes/api/signup.ts": $5,
    "./routes/api/subscription.ts": $6,
    "./routes/blog/[slug].tsx": $7,
    "./routes/blog/index.tsx": $8,
    "./routes/dashboard/_middleware.ts": $9,
    "./routes/dashboard/account.tsx": $10,
    "./routes/dashboard/api/client.ts": $11,
    "./routes/dashboard/api/kid.ts": $12,
    "./routes/dashboard/api/solicitude.ts": $13,
    "./routes/dashboard/api/todo.ts": $14,
    "./routes/dashboard/api/vaccine.ts": $15,
    "./routes/dashboard/index.tsx": $16,
    "./routes/dashboard/patients.tsx": $17,
    "./routes/dashboard/solicitudes.tsx": $18,
    "./routes/dashboard/todos.tsx": $19,
    "./routes/dashboard/vaccines.tsx": $20,
    "./routes/index.tsx": $21,
    "./routes/login/index.tsx": $22,
    "./routes/login/success.tsx": $23,
    "./routes/logout.ts": $24,
    "./routes/signup.tsx": $25,
  },
  islands: {
    "./islands/AdminPatientsList.tsx": $$0,
    "./islands/AuthFragmentCatcher.tsx": $$1,
    "./islands/ClientPatientList.tsx": $$2,
    "./islands/TodoList.tsx": $$3,
    "./islands/VaccinesList.tsx": $$4,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
