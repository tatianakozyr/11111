
import { GoogleGenAI, Type } from "@google/genai";
import { MaterialEstimate, Language } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const getSystemInstruction = (lang: Language) => {
  const langName = lang === 'uk' ? 'українською' : lang === 'ru' ? 'русском' : 'English';
  
  return `
Ти — експертний технолог швейного виробництва. 
Твоє завдання — проаналізувати зображення куртки та надати детальну технічну інформацію.
1. Визнач тип куртки.
2. Для кожного розміру (S, M, L, XL, XXL) визнач:
   - Орієнтовні виміри готового виробу: Довжина по спинці, Напівобхват грудей, Довжина рукава. Базуйся на стандартних розмірних сітках для верхнього одягу.
   - Розрахуй витрати тканини та фурнітури.
3. СУВОРО дотримуйся вказаної ширини тканини при розрахунках, якщо вона надана користувачем.
4. Результат має бути виключно мовою: ${langName}.
`;
};

export const analyzeJacketImage = async (
  base64Image: string,
  mainFabricWidth: string | undefined,
  liningFabricWidth: string | undefined,
  insulationWidth: string | undefined,
  language: Language = 'uk'
): Promise<MaterialEstimate[]> => {
  try {
    // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const langName = language === 'uk' ? 'українською' : language === 'ru' ? 'російською' : 'англійською';
    let promptText = `Проаналізуй цю куртку. Склади таблицю параметрів виробу та витрат матеріалів для розмірів S, M, L, XL, XXL. Мова відповіді: ${langName}.`;

    // Append specific width instructions if provided
    if (mainFabricWidth || liningFabricWidth || insulationWidth) {
      promptText += "\n\nВАЖЛИВО: Виконай розрахунок витрат (розкладку) базуючись на наступних параметрах ширини рулону:\n";
      if (mainFabricWidth) {
        promptText += `- Ширина ОСНОВНОЇ тканини: ${mainFabricWidth} см.\n`;
      } else {
        promptText += `- Ширина ОСНОВНОЇ тканини: Стандартна (визнач сама).\n`;
      }
      
      if (liningFabricWidth) {
        promptText += `- Ширина ПІДКЛАДКИ: ${liningFabricWidth} см.\n`;
      } else {
        promptText += `- Ширина ПІДКЛАДКИ: Стандартна (визнач сама).\n`;
      }

      if (insulationWidth) {
        promptText += `- Ширина УТЕПЛЮВАЧА: ${insulationWidth} см.\n`;
      } else {
        promptText += `- Ширина УТЕПЛЮВАЧА: Стандартна (визнач сама).\n`;
      }
    } else {
      promptText += "\n\nВикористовуй стандартну ширину рулону для всіх тканин (зазвичай 1.4-1.5м), оскільки користувач не вказав специфічних даних.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: promptText
          }
        ]
      },
      config: {
        systemInstruction: getSystemInstruction(language),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              size: {
                type: Type.STRING,
                description: "Size label (S, M, L, XL, etc)"
              },
              backLength: {
                type: Type.STRING,
                description: "Back length in cm with unit"
              },
              chestWidth: {
                type: Type.STRING,
                description: "Chest width (half-girth) in cm with unit"
              },
              sleeveLength: {
                type: Type.STRING,
                description: "Sleeve length from shoulder in cm with unit"
              },
              mainFabric: {
                type: Type.STRING,
                description: "Main fabric usage in meters with unit"
              },
              liningFabric: {
                type: Type.STRING,
                description: "Lining fabric usage in meters with unit"
              },
              insulation: {
                type: Type.STRING,
                description: "Insulation usage (if any) or dash"
              },
              hardware: {
                type: Type.STRING,
                description: "List of hardware (zippers, buttons, etc) translated to target language"
              },
              notes: {
                type: Type.STRING,
                description: "Short notes in target language"
              }
            },
            required: ["size", "backLength", "chestWidth", "sleeveLength", "mainFabric", "liningFabric", "hardware"]
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("Gemini returned empty response.");
    }

    const data: MaterialEstimate[] = JSON.parse(response.text);
    return data;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw error;
  }
};
