import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'
import dotenv from 'dotenv'
dotenv.config()

export class MercadoPagoService {
    #client
    #webhook_url
    
    constructor() {
        this.#client = new MercadoPagoConfig({
            accessToken: process.env.MP_TOKEN,
            options: {
                timeout: 5000,
                idempotencyKey: "abc"
            }
        })
        this.#webhook_url = process.env.URL_WEBHOOK
    }

    async createPaymentLink(product, user) {
        const preference = new Preference(this.#client);
        
        try {
            const response = await preference.create({
                body: {
                    payment_methods: {
                        excluded_payment_methods: [
                            { id: "bolbradesco" },
                            { id: "pec" }
                        ],
                        excluded_payment_types: [
                            { id: "credit_card" },
                            { id: "debit_card" }
                        ],
                        installments: 1
                    },
                    items: [
                        {
                            title: product.title,
                            quantity: product.quantity,
                            unit_price: product.price
                        }
                    ],
                    notification_url: `${this.#webhook_url}/api/v1/payments/webhook/`,
                    metadata: {
                        user_id: user.id,
                    }
                }
            })
            console.log(response)
            return response.init_point
        } 
        catch (error) {
            console.error('Erro ao criar link de pagamento: ', error);
            return null;
        }
    }

    async paymentSearch(payment_id) {
        const payment = new Payment(this.#client)
        
        try {       
            const response = await payment.get({
                id: `${payment_id}`
            })
            console.log(response)
            return response
        }
        catch (error) {
            console.log('Erro ao buscar pagamento: ', error)
            return null;
        }
    }
}