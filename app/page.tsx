"use client"
import { useState } from "react"

export default function Home() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleMagic = async () => {
    setLoading(true)
    // Simulamos que tenemos settings (luego vendrán de Supabase)
    const userSettings = { precio_hora: 50, iva_default: 21 }

    const res = await fetch("/api/generate-invoice", {
      method: "POST",
      body: JSON.stringify({ text: input, userSettings }),
    })

    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-5">Gremio AI - Proto v1</h1>

      <textarea
        className="w-full p-4 border rounded-lg mb-4 text-black"
        rows={4}
        placeholder="Ej: Instalé un grifo nuevo y estuve 2 horas trabajando..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleMagic}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
      >
        {loading ? "Consultando a Gemini..." : "Generar Presupuesto"}
      </button>

      {result && (
        <pre className="mt-8 p-4 bg-gray-100 text-sm rounded overflow-auto text-black">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  )
}
