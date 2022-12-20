import { NextApiRequest, NextApiResponse } from "next";
import initStripe from 'stripe';
import { buffer } from 'micro'
import { getServiceSupabase } from "../../utils/supabase";

export const config = { api: { bodyParser: false } }

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = getServiceSupabase();
    const stripe = new initStripe(process.env.STRIPE_SECRET_KEY as string, {
        typescript: true,
        apiVersion: "2022-11-15"
    });
    const signature = req.headers["stripe-signature"] as string;
    const signingSecret = process.env.STRIPE_SIGNING_SECRET as string;
    const reqBuffer = await buffer(req);

    let event;

    try {
        event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);
    } catch (error: any) {
        console.log(error);
        return res.status(400).send(`Webhook error: ${error.message}`)
    }

    // console.log("event", event.data);

    switch (event.type) {
        case "customer.subscription.updated":
            await supabase.from("profile").update({
                is_subscribed: true,
                //@ts-ignore
                interval: event.data.object.items.data[0].plan.interval
                // @ts-ignore
            }).eq("stripe_customer", event.data.object.customer)
            break;
        case "customer.subscription.deleted":
            await supabase.from("profile").update({
                is_subscribed: false,
                interval: null
                // @ts-ignore
            }).eq("stripe_customer", event.data.object.customer)
            break;
    }

    res.send({ received: true })
}

export default handler