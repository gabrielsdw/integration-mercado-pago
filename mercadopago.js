import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'
import dotenv from 'dotenv'
dotenv.config()

export class Product {
    constructor(id, title, quantity, price, description) {
        this.id = id
        this.title = title
        this.quantity = quantity
        this.price = price
        this.description = description
    }
}

export class User {
    constructor(id) {
        this.id = id
    }
}

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
        console.log(process.env.MP_TOKEN)
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
                        name_user: 'Gabriel'
                    }
                }
            })
            console.log(response)
            if (response.api_response.status == 201) {
                return response.sandbox_init_point;  
            } else {
                return null;
            }
        } catch (error) {
            console.error('Erro ao criar link de pagamento:', error);
            return null;
        }
    }

    async paymentSearch(payment_id) {
        const payment = new Payment(this.#client)
        try {       
            const response = await payment.get({
                id: payment_id
            })
            if (response.api_response.status == 200) {
                return response;  
            } else {
                return null;
            }
        }
        catch (error) {
            console.log(error)
            return null;
        }
    }
}