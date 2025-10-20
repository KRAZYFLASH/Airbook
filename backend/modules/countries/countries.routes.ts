// =============================================================
// AirBook Backend — Countries Routes
// =============================================================

import { Router } from "express";
import { CountriesController } from "./countries.controller";

const router = Router();

// Countries routes
router.get("/country", CountriesController.getAll);
router.get("/country/active", CountriesController.getActive);
router.get("/country/:id", CountriesController.getById);
router.post("/country", CountriesController.create);
router.put("/country/:id", CountriesController.update);
router.delete("/country/:id", CountriesController.delete);

export default router;
