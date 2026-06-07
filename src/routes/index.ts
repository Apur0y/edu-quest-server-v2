import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import usersRoutes from "../modules/users/users.route";
import sessionsRoutes from "../modules/sessions/sessions.route";
import bookedRoutes from "../modules/booked/booked.route";
import notesRoutes from "../modules/notes/notes.route";
import materialsRoutes from "../modules/materials/materials.route";
import reviewsRoutes from "../modules/reviews/reviews.route";
import paymentsRoutes from "../modules/payments/payments.route";

const router = Router();

// All routes — matching original flat structure for 100% API compat
const moduleRoutes = [
  { path: "/", router: authRoutes },
  { path: "/", router: usersRoutes },
  { path: "/", router: sessionsRoutes },
  { path: "/", router: bookedRoutes },
  { path: "/", router: notesRoutes },
  { path: "/", router: materialsRoutes },
  { path: "/", router: reviewsRoutes },
  { path: "/", router: paymentsRoutes },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
