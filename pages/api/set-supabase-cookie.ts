import { NextApiRequest, NextApiResponse } from "next";
import cookie from 'cookie';
import { supabase } from "../../utils/supabase"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.send({ "message": "Ok" });
}

export default handler