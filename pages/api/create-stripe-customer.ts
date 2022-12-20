import initStripe from 'stripe';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServiceSupabase } from '../../utils/supabase';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
        return res.status(401).send("You are not authorized to call this api")
    }

    const stripe = new initStripe(process.env.STRIPE_SECRET_KEY as string, {
        typescript: true,
        apiVersion: "2022-11-15"
    });
    const supabase = getServiceSupabase()

    const customer = await stripe.customers.create({
        email: req.body.record.email
    })

    await supabase.from("profile").update({
        stripe_customer: customer.id
    }).eq("id", req.body.record.id)

    return res.send({ message: `Stripe customer created ${customer.id}` })
}


export default handler;