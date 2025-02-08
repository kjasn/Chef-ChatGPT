import { HfInference } from "@huggingface/inference";
import axios from "axios";
import OpenAI from "openai";

const SYSTEM_PROMPT = `
你是鸡皮提大厨，你善于根据现有食材做出家常菜肴。请根据提供的食材推荐一道菜的做法，请包含以下信息：
    1. 菜品名称
    2. 难度（用⭐表示，1-5颗星）
    3. 用到的食材（可以不全部使用到）
    4. 详细步骤
并且请用Markdown格式回复。记得始终使用中文回复。
`;

const hf = new HfInference(import.meta.env.VITE_HF_API_KEY);

export async function getRecipeFromZephyr(ingredients) {
    try {
        const ingredientsList = Object.keys(ingredients).join("、");

        const response = await hf.textGeneration({
            model: "HuggingFaceH4/zephyr-7b-beta",
            inputs: `${ingredientsList}`,
            prompt: SYSTEM_PROMPT,
            parameters: {
                max_new_tokens: 1024,
                temperature: 0.85,
                top_p: 0.95,
                return_full_text: false,
            },
        });

        return response.generated_text;
    } catch (error) {
        console.error("生成菜谱时出错：", error);
        return "抱歉，生成菜谱时出现错误，请稍后再试。";
    }
}

export async function getRecipeFromDeepSeek(ingredients) {
    try {
        const ingredientsList = Object.keys(ingredients).join("、");

        const data = {
            messages: [
                {
                    content: SYSTEM_PROMPT,
                    role: "system",
                },
                {
                    content: `我有这些食材：${ingredientsList}`,
                    role: "user",
                },
            ],
            model: "deepseek-chat",
            // model: "deepseek-ai/deepseek-r1",
            max_tokens: 2048,
            temperature: 0.5,
            top_p: 0.95,
            // response_format: {
            //     type: "text",
            // },
        };

        const config = {
            method: "post",
            url: `${import.meta.env.VITE_DEEPSEEK_API_URL}`,
            // url: `${import.meta.env.VITE_DEEPSEEK_API_URL_NVDA}`,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
                // Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY_NVDA}`,
            },
            data: data,
        };

        const response = await axios(config);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("生成菜谱时出错：", error);
        return "抱歉，生成菜谱时出现错误，请稍后再试。";
    }
}

export async function getRecipeFromDeepSeekNVDA(ingredients) {
    try {
        const ingredientsList = Object.keys(ingredients).join("、");
        let result = "";

        const openai = new OpenAI({
            apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY_NVDA,
            baseURL: import.meta.env.VITE_DEEPSEEK_API_URL_NVDA,
            dangerouslyAllowBrowser: true,
        });
        const completion = await openai.chat.completions.create({
            model: "deepseek-ai/deepseek-r1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `我有这些食材：${ingredientsList}` },
            ],
            temperature: 0.6,
            top_p: 0.7,
            max_tokens: 4096,
            stream: true,
        });

        for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || "";
            result += content;
        }

        return result;
    } catch (error) {
        console.error("生成菜谱时出错：", error);
        return "抱歉，生成菜谱时出现错误，请稍后再试。";
    }
}
