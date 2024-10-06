import express from 'express'
import { MercadoPagoService } from './mercadopago.js';
const app = express();  

const mercadoPagoService = new MercadoPagoService()


app.use(express.json());

app.get('/api/v1/', (req, res) => {
    res.send("Tudo ok!")
})

app.post('/api/v1/payments/webhook/', async (req, res) => {
    const data = req.body;
    try {
        const paymentId = data.data.id
        const paymentDetails = await mercadoPagoService.paymentSearch(paymentId)
    
        console.log(paymentDetails)    
    } 
    catch (error) {
    }
    
    // for(let payment of paymentDetails.results) {
        
    //     console.log(payment.description)
    //     console.log(payment.metadata)
    // }

    res.status(200).json({});
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})
