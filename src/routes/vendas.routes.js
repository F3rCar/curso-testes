import { Router } from 'express';
import { VendasController } from '#controllers/vendas.controller.js';
import db from '#db/singleton-connection.js';

const router = Router();

const vendasController = new VendasController(db);

router.post('/vendas', vendasController.registrarVenda);

export default router;
