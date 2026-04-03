import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { KCARS_KNOWLEDGE } from "@/lib/knowledge-base";
import { supabase } from "@/lib/supabase";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Si priateľský AI asistent autobazáru K cars. Pomáhaš zákazníkom s otázkami o autách, cenách, financovaní, výkupe a komisnom predaji.

Tu sú všetky informácie o K cars:

${KCARS_KNOWLEDGE}

Pravidlá:
- Odpovedaj stručne (max 3-4 vety), priateľsky a profesionálne
- Hovor v jazyku akým ti zákazník píše (SK, HU, CZ, DE, EN)
- Ak sa pýta na konkrétne auto, vyhľadaj v aktuálnej ponuke (dostaneš ju ako kontext)
- Pri otázkach o splátkach použi VÚB kalkulačku
- Vždy ponúkni kontakt: ☎ +421 905 489 662 alebo WhatsApp
- Neodpovedaj na otázky nesúvisiace s autami alebo K cars
- Ak si nie si istý, nasmeruj na kontakt`;

export async function POST(request: NextRequest) {
  try {
    const { message, locale } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "AI not configured" }, { status: 500 });
    }

    // Fetch current car inventory for context
    const { data: cars } = await supabase
      .from("cars")
      .select("brand, model, price, year, mileage, fuel, transmission, body_type, slug")
      .eq("status", "available")
      .neq("body_type", "doplnky")
      .order("price", { ascending: false });

    const inventory = (cars || [])
      .map((c) => `${c.brand} ${c.model} (${c.year}, ${c.mileage?.toLocaleString()} km, ${c.fuel}, ${c.price?.toLocaleString()} €)`)
      .join("\n");

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: SYSTEM_PROMPT + `\n\nAktuálna ponuka (${cars?.length || 0} áut):\n${inventory}`,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({
      reply: "Prepáčte, momentálne nemôžem odpovedať. Kontaktujte nás na ☎ +421 905 489 662 alebo cez WhatsApp.",
    });
  }
}
