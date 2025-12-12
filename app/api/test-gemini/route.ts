import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "No se encontró API KEY" },
      { status: 500 }
    )
  }

  try {
    // Truco: Hacemos una petición REST manual para listar modelos
    // porque a veces el SDK oculta el error real.
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    )

    const data = await response.json()

    return NextResponse.json({
      clave_usada: apiKey.substring(0, 5) + "...", // Para verificar que lee la clave
      modelos_disponibles: data,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
