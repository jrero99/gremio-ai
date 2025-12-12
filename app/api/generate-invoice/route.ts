import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

// Asegúrate de que la API Key se carga correctamente
const apiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey!)

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: "Falta la GEMINI_API_KEY" },
        { status: 500 }
      )
    }

    const { text, userSettings } = await req.json()

    // CAMBIO IMPORTANTE AQUÍ: Usamos 'gemini-1.5-flash'
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `
      Actúa como un asistente administrativo experto.
      DATOS DEL USUARIO:
      - Precio Hora: ${userSettings.precio_hora}€
      - IVA: ${userSettings.iva_default}%
      TEXTO DEL TRABAJO: "${text}"
      TAREA:
      Extrae los ítems, calcula totales y devuelve SOLO un JSON válido con esta estructura:
      {
        "items": [{ "concept": "string", "quantity": number, "price_unit": number, "total": number }],
        "subtotal": number,
        "iva_amount": number,
        "total_final": number
      }
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const textResponse = response.text()

    // Limpieza básica por si la IA devuelve bloques de código markdown
    const jsonString = textResponse.replace(/```json|```/g, "").trim()

    return NextResponse.json(JSON.parse(jsonString))
  } catch (error: any) {
    console.error("Error detallado:", error)
    return NextResponse.json(
      { error: error.message || "Error procesando con IA" },
      { status: 500 }
    )
  }
}
