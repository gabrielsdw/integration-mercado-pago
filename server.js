import express from 'express'
import { MercadoPagoService } from './mercadopago.js';

const mercadoPagoService = new MercadoPagoService()

const app = express();  
app.use(express.json());

app.post('/api/v1/payments/webhook/', async (req, res) => {
    const body = req.body;
    try {
        const paymentId = body.data.id
        const paymentDetails = await mercadoPagoService.paymentSearch(paymentId)
        if(!(paymentDetails === null)) {
            console.log(paymentDetails)
            if(paymentDetails.status == 'approved') {
                const metaData = paymentDetails.metadata
                const user_id = metaData.user_id
                console.log(user_id)
            }
        }
    } 
    catch (error) {
        res.status(500)
    }
    res.status(200)
})

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})