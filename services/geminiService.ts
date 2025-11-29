import { GoogleGenAI, Type } from "@google/genai";
import { MaterialEstimate } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
Ти — експертний технолог швейного виробництва. 
Твоє завдання — проаналізувати зображення куртки та надати детальну технічну інформацію.
1. Визнач тип куртки.
2. Для кожного розміру (M, L, XL, XXL, XXXL) визнач:
   - Орієнтовні виміри готового виробу: Довжина по спинці, Напівобхват грудей, Довжина рукава. Базуйся на стандартних розмірних сітках для верхнього одягу.
   - Розрахуй витрати тканини та фурнітури.
3. СУВОРО дотримуйся вказаної ширини тканини при розрахунках, якщо вона надана користувачем.
4. Результат має бути українською мовою.
`;

export const analyzeJacketImage = async (
  base64Image: string,
  mainFabricWidth?: string,
  liningFabricWidth?: string,
  insulationWidth?: string
): Promise<MaterialEstimate[]> => {
  try {
    // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    let promptText = "Проаналізуй цю куртку. Склади таблицю параметрів виробу та витрат матеріалів для розмірів M, L, XL, XXL, XXXL.";

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
              mimeType: "image/jpeg", // Assuming JPEG for simplicity, API handles most common types
              data: cleanBase64
            }
          },
          {
            text: promptText
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              size: {
                type: Type.STRING,
                description: "Розмір (M, L, XL, XXL, XXXL)"
              },
              backLength: {
                type: Type.STRING,
                description: "Довжина виробу по спинці (в см), наприклад '72 см'"
              },
              chestWidth: {
                type: Type.STRING,
                description: "Напівобхват грудей (в см), наприклад '54 см'"
              },
              sleeveLength: {
                type: Type.STRING,
                description: "Довжина рукава від плеча (в см), наприклад '64 см'"
              },
              mainFabric: {
                type: Type.STRING,
                description: "Кількість основної тканини (в метрах), наприклад '1.8 м'"
              },
              liningFabric: {
                type: Type.STRING,
                description: "Кількість підкладкової тканини (в метрах)"
              },
              insulation: {
                type: Type.STRING,
                description: "Кількість утеплювача (якщо є), або прочерк"
              },
              hardware: {
                type: Type.STRING,
                description: "Список фурнітури (блискавки, кнопки, люверси), наприклад 'Блискавка 70см, 6 кнопок'"
              },
              notes: {
                type: Type.STRING,
                description: "Короткі примітки"
              }
            },
            required: ["size", "backLength", "chestWidth", "sleeveLength", "mainFabric", "liningFabric", "hardware"]
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("Не вдалося отримати відповідь від Gemini.");
    }

    const data: MaterialEstimate[] = JSON.parse(response.text);
    return data;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw error;
  }
};