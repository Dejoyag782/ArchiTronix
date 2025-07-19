// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
    GoogleGenAI,
    Type,
  } from '@google/genai';

export const gatherQuote = async (components: string) => {
    const ai = new GoogleGenAI({
      apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    });
    const config = {
      thinkingConfig: {
        thinkingBudget: -1,
      },
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        required: ["electrical_specifications"],
        properties: {
          electrical_specifications: {
            type: Type.OBJECT,
            required: ["components", "total_quote"],
            properties: {
              components: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["name", "quantity", "product_url", "product_price", "class_name", "total"],
                  properties: {
                    name: {
                      type: Type.STRING,
                    },
                    quantity: {
                      type: Type.INTEGER,
                    },
                    product_url: {
                      type: Type.STRING,
                    },
                    product_price: {
                      type: Type.INTEGER,
                    },
                    class_name: {
                      type: Type.STRING,
                    },
                    total: {
                      type: Type.INTEGER,
                    },
                  },
                },
              },
              total_quote: {
                type: Type.INTEGER,
              },
            },
          },
        },
      },
      systemInstruction: [
          {
            text: `
            You are tasked to audit electrical components, the electrical components are to be of Philippine standards, 
            you are free to create the search url with the product name.            
            `, 
          }
      ],
    };
    const model = 'gemini-2.5-pro';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: JSON.stringify(JSON.parse(components), null, 2),
          },
        ],
      },
    ];
  
    console.log("Gather Quote:", JSON.stringify(contents));
  
    const response = await ai.models.generateContent({
      model,
      config: config as any,
      contents,
    });
    
    return response;
  }
  