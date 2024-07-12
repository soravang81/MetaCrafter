import OpenAI from "openai"
import dotenv from "dotenv"
dotenv.config()
const apiKEY = process.env.NEXT_PUBLIC_REPLICATE_OPENAI_API_KEY
const openai = new OpenAI({apiKey :  apiKEY , dangerouslyAllowBrowser: true})

export const generateImage = async(prompt : string) =>{
    const axios = require("axios").default;
    const options = {
    method: "POST",
    url: "https://api.edenai.run/v2/image/generation",
    headers: {
        authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDRjOGNkOWEtYWUyOS00NWU5LWIwY2YtNGFiMWZhOGI3Yzg0IiwidHlwZSI6ImFwaV90b2tlbiJ9.USxm9cYdyj2Rh-oojMgw-u5rpxcWMDR5StnNs46KPFg",
    },
    data: {
        providers: "replicate",
        text: prompt,
        resolution: "512x512",
    },
    };

    axios
    .request(options)
    .then((response:any) => {
        console.log(response.data);
        return response.data
    })
    .catch((error:any) => {
        console.error(error);
    });

}