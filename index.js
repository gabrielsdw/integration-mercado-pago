import { MercadoPagoService } from './mercadopago.js'
import { User } from './user.js'
import { Product } from './product.js';


(async () => {
    const product = new Product(1, 'Azeitona', 2, 23.99, 'Azeitona po');
    const user = new User(7);

    const mercadoPagoService = new MercadoPagoService();

    let link = await mercadoPagoService.createPaymentLink(product, user);
    console.log(link); 
})();