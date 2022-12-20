import { NextApiRequest, NextApiResponse } from "next";
import cookie from 'cookie';
import initStripe from 'stripe';
import { getServiceSupabase } from "../../utils/supabase";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = getServiceSupabase();

    let token = req.headers.cookie && cookie.parse(req.headers.cookie)['supabase-auth-token'];

    if (!token) {
        res.status(401).send({ "message": "Unauthorized" });
    }

    token = JSON.parse(token as string)[0]; //jwt

    const { data: { user } } = await supabase.auth.getUser(token as string);

    if (!user) res.status(401).send({ "message": "Unauthorized" });

    const { data } = await supabase.from("profile").select("stripe_customer").eq("id", user?.id).single()

    const stripe = new initStripe(process.env.STRIPE_SECRET_KEY as string, {
        typescript: true,
        apiVersion: "2022-11-15"
    });


    const session = await stripe.billingPortal.sessions.create({
        customer: data!.stripe_customer,
        return_url: "http://localhost:3000/profile"
    })

    return res.send({
        url: session.url
    })
}

export default handler