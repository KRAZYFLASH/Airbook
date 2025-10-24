// =============================================================
// AirBook Backend — Cities Routes
// =============================================================

import { Router } from "express";
import { CitiesController } from "./cities.controller";

const router = Router();

// Cities routes
router.get("/city", CitiesController.getAll);
router.get("/city/active", CitiesController.getActive);
router.get("/city/country/:countryId", CitiesController.getByCountry);
router.get(
  "/city/country/:countryId/active",
  CitiesController.getActiveByCountry
);
router.get("/city/:id", CitiesController.getById);
router.post("/city", CitiesController.create);
router.put("/city/:id", CitiesController.update);
router.delete("/city/:id", CitiesController.delete);

export default router;
